import React from "react";
import {StateMachine} from "@ceilingcat/state-machine";
import Point from "./math/Point.js";
import './App.css';
import Cache from "./misc/Cache.js";
import MandlebrotEngineStates from "./state/mandlebrotEngine/MandlebrotEngineStates";
import MandlebrotEngineEvents from "./state/mandlebrotEngine/MandlebrotEngineEvents";
import PropertyIdentifiers from "./data/PropertyIdentifiers";
import CacheKeyNames from "./misc/CacheKeyNames";
import PropertyGroupIdentifiers from "./data/PropertyGroupIdentifiers";
import MandlebrotWorker from "./worker/MandlebrotWorker";
import MouseStateMachine from "./state/mouse/MouseStateMachine";
import InputStateMachine from "./state/inputs/InputsStateMachine";
import MandlebrotEngineStateMachine from "./state/mandlebrotEngine/MandlebrotEngineStateMachine";
import MemoryHelper from "./misc/wasm/MemoryHelper";
import StateInfo from "./components/StateInfo";
import InputsEvents from "./state/inputs/InputsEvents";
import CanvasDisplay from "./components/CanvasDisplay";
import WindowMouseEvents from "./state/mouse/WindowMouseEvents";
import ValidatedInputs from "./components/ValidatedInputs";
import ControlsStateMachine from "./state/controls/ControlsStateMachine";
import StringStateHelper from "./state/StringStateHelper";
import ControlsStates from "./state/controls/ControlsStates";
import Palette from "./graphics/Palette";
import PaletteEditor from "./components/PaletteEditor";
import WindowViewportTransform from "./math/WindowViewportTransform";
import ArrayHelpers from "./misc/ArrayHelpers";
import InputsStates from "./state/inputs/InputsStates";
import RGBColour from "./graphics/RGBColour";
import MouseStates from "./state/mouse/MouseStates";
import {DEFAULT_PROPS} from "./AppDefaultProps";
import {VOID, withIt} from "./misc/ScopeHelper";
import {createState, getJsProp, setInputValues} from "./data/StateHelper";

const MAX_WEBASSEMBLY_MEMORY_PAGES = 1024;

export default class App extends React.Component {

    static get defaultProps() {
        return DEFAULT_PROPS;
    }

    /**
     * @type {React.RefObject<HTMLCanvasElement>}
     */
    #canvasRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            mandlebrotEngine: {
                machine: MandlebrotEngineStateMachine(VOID, this.#mandlebrotEngineEndTransitionHandler),
                cache: new Cache()
            },
            mouse: {machine: MouseStateMachine(this.#mouseStartTransitionHandler).provide(WindowMouseEvents.initialised)},
            controls: {machine: ControlsStateMachine()},
            maxIterationsPalette: new Palette([RGBColour.BLACK]),
            palette: Palette.create(55, 255, 5),
            inputs: {
                machine: InputStateMachine(VOID, this.#inputEndTransitionHandler),
                propertyCollectionsGroup: createState(props.propertyCollectionsGroup),
            }
        };
    };

    componentDidMount = () => {
        this.#setInputValues();
    }

    /**
     * @return {boolean}
     */
    get #shouldRenderCanvas() {
        return !StringStateHelper.inState(this.#typedState.inputs.machine, InputsStates.invalid) ||
            !StringStateHelper.inState(this.#typedState.mandlebrotEngine.machine, MandlebrotEngineStates.created);
    }

    /**
     * @return {[number, number]}
     */
    #getCanvasDisplayDimensions() {
        const inputWindowWidth = this.#getPropertyValue(PropertyIdentifiers.windowWidth, PropertyGroupIdentifiers.viewport);
        const inputWindowHeight = this.#getPropertyValue(PropertyIdentifiers.windowHeight, PropertyGroupIdentifiers.viewport);

        const mandlebrotEngineStateMachine = this.#typedState.mandlebrotEngine.machine;
        const inputsStateMachine = this.#typedState.inputs.machine;

        if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.created)) {
            return [inputWindowWidth, inputWindowHeight];
        } else {
            const {windowWidth, windowHeight} = this.#renderRequest;
            const inputsValid = StringStateHelper.inState(inputsStateMachine, InputsStates.valid);
            if (inputsValid) {
                return [Math.max(windowWidth, inputWindowWidth), Math.max(windowHeight, inputWindowHeight)];
            } else {
                return [windowWidth, windowHeight];
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const inputsStateMachine = this.#typedState.inputs.machine;
        const mandlebrotEngineStateMachine = this.#typedState.mandlebrotEngine.machine;
        const mouseStateMachine = this.#typedState.mouse.machine;

        if (!StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.created) &&
            !StringStateHelper.inState(inputsStateMachine, InputsStates.invalid)) {
            const canvasContext = this.#canvasRef.current.getContext('2d');
            // const inputWindowWidth =
            //     this.#getPropertyValue(PropertyIdentifiers.windowWidth, PropertyCollectionIdentifiers.viewport);
            // const inputWindowHeight =
            //     this.#getPropertyValue(PropertyIdentifiers.windowHeight, PropertyCollectionIdentifiers.viewport);
            const {windowWidth, windowHeight} = this.#renderRequest;
            // const maxDimensions =
            //     [Math.max(windowWidth, inputWindowWidth), Math.max(windowHeight, inputWindowHeight)];

            if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.finished, MandlebrotEngineStates.recolouring)) {
                canvasContext.putImageData(this.#getCacheValue(CacheKeyNames.imageData), 0, 0);
            }

            if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.finished)) {
                const windowCursorLocation = this.#typedState.mouse.windowCursorLocation;
                if (StringStateHelper.inState(mouseStateMachine, MouseStates.active)) {

                    canvasContext.beginPath();
                    canvasContext.lineWidth = 1;
                    canvasContext.strokeStyle = RGBColour.WHITE.hexString;

                    canvasContext.beginPath();
                    canvasContext.moveTo(0, windowCursorLocation.y);
                    canvasContext.lineTo(windowWidth, windowCursorLocation.y);
                    canvasContext.stroke();

                    canvasContext.beginPath();
                    canvasContext.moveTo(windowCursorLocation.x, 0);
                    canvasContext.lineTo(windowCursorLocation.x, windowHeight);
                    canvasContext.stroke();
                } else if (StringStateHelper.inState(mouseStateMachine, MouseStates.dragging)) {
                    const windowDragStartLocation = this.#typedState.mouse.windowDragStartLocation;
                    canvasContext.lineWidth = 1;
                    canvasContext.strokeStyle = RGBColour.WHITE.hexString;
                    canvasContext.beginPath();
                    withIt(windowCursorLocation.subtract(windowDragStartLocation), (deltas) =>
                        canvasContext.rect(windowDragStartLocation.x, windowDragStartLocation.y, deltas.x, deltas.y)
                    );
                    canvasContext.stroke();
                }
            }
        }
    }

    #inputEndTransitionHandler = (currentState, input) =>
        this.#updateControlsState(({machine}) => ({machine: machine.provide(input)}))

    #mouseStartTransitionHandler = (currentState, input, nextState) => {
        if (currentState === MouseStates.dragging && nextState === MouseStates.active) {
            const dragStartLocation = this.#typedState.mouse.windowDragStartLocation;
            const dragEndLocation = this.#typedState.mouse.windowCursorLocation;
            if (!dragStartLocation.equals(dragEndLocation)) {
                const [tl, br] = Point.sort(dragStartLocation, dragEndLocation)
                    .map((point) => this.#typedState.mandlebrotEngine.windowViewportTransform.transform(point));

                this.#setInputValues(PropertyGroupIdentifiers.world, {
                        [PropertyIdentifiers.worldMinX]: tl.x,
                        [PropertyIdentifiers.worldMinY]: tl.y,
                        [PropertyIdentifiers.worldMaxX]: br.x,
                        [PropertyIdentifiers.worldMaxY]: br.y,
                    }
                );
            }
        }
        if ([WindowMouseEvents.cursorEntered, WindowMouseEvents.cursorMoved].includes(input)) {
            this.#updateMouseState(({event}) =>
                ({windowCursorLocation: this.#windowCursorLocation(event)})
            );
        } else if (input === WindowMouseEvents.cursorLeft) {
            this.#updateMouseState(() => ({
                windowCursorLocation: undefined,
                windowDragStartLocation: undefined
            }));
        } else if (input === WindowMouseEvents.buttonDown) {
            this.#updateMouseState(({event}) =>
                ({windowDragStartLocation: this.#windowCursorLocation(event)})
            );
        } else if (input === WindowMouseEvents.buttonUp) {
            this.#updateMouseState(() => ({windowDragStartLocation: undefined}));
        }
    }

    /**
     * @param {MandlebrotWorker} workerTask
     */
    #onWorkerTaskSuccess = (workerTask) => this.#completedTaskPool.add(workerTask.windowY);


    #onWorkerTaskFailure = function (workerTask) {
    }

    #processWorkers = () => {
        const pendingTaskPool = this.#getCacheValue(CacheKeyNames.pendingLineNumberPool);
        const completedTaskPool = this.#completedTaskPool;

        const {windowWidth, windowHeight: totalNumberOfTasks} = this.#renderRequest
        if (completedTaskPool.size === totalNumberOfTasks) {
            this.#updateMandlebrotEngineState(({machine}) => ({
                machine: machine.provide(MandlebrotEngineEvents.calculationFinished)
            }));
        } else {
            const {worldTopLeft, worldBottomRight, maxModulusSquared, maxIterations} = this.#renderRequest
            const idleWorkers = this.#workers.filter((worker) => worker.isReady);
            if (idleWorkers.length !== 0) {
                idleWorkers
                    .forEach((idleWorkerTask) => {
                        if (pendingTaskPool.size > 0) {
                            const nextLineOffset = pendingTaskPool.keys().next().value;
                            if (pendingTaskPool.delete(nextLineOffset)) {
                                const taskWorldStartLocation =
                                    this.#typedState.mandlebrotEngine.windowViewportTransform.transform(
                                        Point.at(0, nextLineOffset)
                                    );
                                idleWorkerTask.execute(
                                    nextLineOffset * windowWidth,
                                    windowWidth,
                                    taskWorldStartLocation.x,
                                    taskWorldStartLocation.y,
                                    nextLineOffset,
                                    worldBottomRight.subtract(worldTopLeft).x / windowWidth,
                                    maxModulusSquared,
                                    maxIterations
                                );
                            }
                        }
                    });
            }
            setTimeout(() => this.#processWorkers.call(this));
        }
    };

    /**
     * @param {number} numWindowPoints
     * @return {number} the number of 64KiB pages required to store our iteration data
     */
    #iterationDataPagesRequired = (numWindowPoints) => MemoryHelper.pagesRequired(numWindowPoints * 4);

    #iterationDataAndPalettePagesRequired = (numWindowPoints) =>
        withIt(this.#typedState.palette.length, (numberOfPaletteEntries) =>
            MemoryHelper.pagesRequired((numWindowPoints + numberOfPaletteEntries) * 4))

    /**
     * @param {String} key - the cache entry's key identifier
     */
    #getCacheValue = (key) => this.#cache.get(key);

    /**
     * @return {WebAssembly.Memory}
     */
    get #iterationDataAndPaletteMemory() {
        return this.#getCacheValue(CacheKeyNames.iterationDataAndPaletteMemory);
    }

    /**
     * @return {Set<number>}
     */
    get #completedTaskPool() {
        return this.#getCacheValue(CacheKeyNames.completedLineNumberPool);
    }

    /**
     * @return {MandlebrotWorker[]}
     */
    get #workers() {
        return this.#getCacheValue(CacheKeyNames.mandlebrotWorkers);
    }

    /**
     * @return {Cache}
     */
    get #cache() {
        return this.#typedState.mandlebrotEngine.cache;
    }

    /**
     * @return {RenderRequest}
     */
    get #createRenderRequest() {

        const windowWidth = this.#getPropertyValue(PropertyIdentifiers.windowWidth, PropertyGroupIdentifiers.viewport);
        const windowHeight = this.#getPropertyValue(PropertyIdentifiers.windowHeight, PropertyGroupIdentifiers.viewport);
        const maxModulus = this.#getPropertyValue(PropertyIdentifiers.maxModulus, PropertyGroupIdentifiers.engine);
        return {
            worldTopLeft: Point.at(
                this.#getPropertyValue(PropertyIdentifiers.worldMinX, PropertyGroupIdentifiers.world),
                this.#getPropertyValue(PropertyIdentifiers.worldMinY, PropertyGroupIdentifiers.world)
            ),
            worldBottomRight: Point.at(
                this.#getPropertyValue(PropertyIdentifiers.worldMaxX, PropertyGroupIdentifiers.world),
                this.#getPropertyValue(PropertyIdentifiers.worldMaxY, PropertyGroupIdentifiers.world)
            ),
            windowWidth: windowWidth,
            windowHeight: windowHeight,
            maxModulus: maxModulus,
            maxModulusSquared: maxModulus * maxModulus,
            maxIterations: this.#getPropertyValue(PropertyIdentifiers.maxIterations, PropertyGroupIdentifiers.engine),
            numWorkers: this.#getPropertyValue(PropertyIdentifiers.numWorkers, PropertyGroupIdentifiers.engine),
            numWindowPoints: windowWidth * windowHeight
        };
    }

    #renderRequested = () => {
        this.#updateMandlebrotEngineState(({machine}) => ({
            machine: machine.provide(MandlebrotEngineEvents.initialiseCalculations)
        }));
    };

    /**
     * @param {MandlebrotWorker} worker
     */
    #mandlebrotWorkerInitialised(worker) {
        const workers = this.#workers;
        workers.push(worker);
        if (workers.length === this.#typedState.mandlebrotEngine.renderRequest.numWorkers) {
            this.#signalMandlebrotEngineCalculationsInitialised();
        }
    }

    #signalMandlebrotEngineCalculationsInitialised() {
        this.#updateMandlebrotEngineState(({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.calculationInitialised)})
        );
    }

    #mandlebrotEngineEndTransitionHandler = (lastState, input, currentState) => {
        if (currentState === MandlebrotEngineStates.initialisingCalculations) {
            const lastRenderRequest = this.#typedState.mandlebrotEngine.renderRequest;
            const renderRequest = this.#createRenderRequest;
            const cache = this.#cache;

            const iterationDataMemory = MemoryHelper.createOrGrow(
                this.#iterationDataPagesRequired(renderRequest.numWindowPoints),
                MAX_WEBASSEMBLY_MEMORY_PAGES,
                true,
                cache.get(CacheKeyNames.iterationDataMemory)
            );

            const iterationDataAndPaletteMemory = MemoryHelper.createOrGrow(
                this.#iterationDataAndPalettePagesRequired(renderRequest.numWindowPoints),
                MAX_WEBASSEMBLY_MEMORY_PAGES,
                false,
                this.#iterationDataAndPaletteMemory
            );

            cache.set(CacheKeyNames.iterationDataMemory, iterationDataMemory);
            cache.set(CacheKeyNames.iterationDataAndPaletteMemory, iterationDataAndPaletteMemory);
            cache.set(
                CacheKeyNames.pendingLineNumberPool,
                new Set(ArrayHelpers.createInit(renderRequest.windowHeight, i => i))
            );
            cache.set(CacheKeyNames.completedLineNumberPool, new Set());
            const workersDelta = renderRequest.numWorkers - (lastRenderRequest?.numWorkers ?? 0);
            let callback = VOID;
            if (workersDelta < 0) {
                const workersArray = this.#workers;
                const newWorkers = workersArray.slice(0, renderRequest.numWorkers);
                workersArray.slice(renderRequest.numWorkers).forEach((worker) => {
                    worker.terminate();
                });
                cache.set(CacheKeyNames.mandlebrotWorkers, newWorkers);
                callback = () => this.#signalMandlebrotEngineCalculationsInitialised();
            } else if (workersDelta === 0) {
                callback = () => this.#signalMandlebrotEngineCalculationsInitialised();
            } else if (workersDelta > 0) {
                if (lastRenderRequest === undefined) {
                    cache.set(CacheKeyNames.mandlebrotWorkers, []);
                }
                callback = () => {
                    [...Array(workersDelta).keys()].forEach(() => {
                        new MandlebrotWorker(
                            iterationDataMemory,
                            this.#mandlebrotWorkerInitialised.bind(this),
                            this.#onWorkerTaskSuccess,
                            this.#onWorkerTaskFailure
                        ).init()
                    });
                }
            }
            this.#updateMandlebrotEngineState(() => ({
                renderRequest: renderRequest,
                windowViewportTransform: new WindowViewportTransform(
                    renderRequest.worldTopLeft,
                    renderRequest.worldBottomRight,
                    Point.ORIGIN,
                    Point.at(renderRequest.windowWidth, renderRequest.windowHeight)
                )
            }), callback);
        } else if (currentState === MandlebrotEngineStates.calculating) {
            setTimeout(() => this.#processWorkers(this));
        } else if (currentState === MandlebrotEngineStates.initialisingColourMapping) {
            WebAssembly.instantiateStreaming(
                fetch("MandlebrotColouring.wasm"),
                {env: {iterationAndPaletteData: this.#iterationDataAndPaletteMemory}}
            ).then((webAssemblyInstantiatedSource) => {
                this.#updateMandlebrotEngineState(({machine, cache}) => {
                        cache.set(CacheKeyNames.mandlebrotColouringModule, webAssemblyInstantiatedSource.instance);
                        return {
                            machine: machine.provide(MandlebrotEngineEvents.colouringInitialised)
                        };
                    }
                );
            });
        } else if (currentState === MandlebrotEngineStates.colourMapping || currentState === MandlebrotEngineStates.recolouring) {
            const renderRequest = this.#typedState.mandlebrotEngine.renderRequest;

            const {windowWidth, windowHeight, numWindowPoints} = renderRequest;

            const numWindowBytes = numWindowPoints << 2;
            const imageDataArray = new Uint8ClampedArray(this.#iterationDataAndPaletteMemory.buffer, 0, numWindowBytes);
            new Uint32Array(imageDataArray.buffer).set(
                new Uint32Array(
                    this.#getCacheValue(CacheKeyNames.iterationDataMemory).buffer, 0, numWindowPoints
                )
            );
            new Uint32Array(imageDataArray.buffer, numWindowBytes)
                .set(this.#typedState.palette.getArray.map((colour) => parseInt(colour.toWasmArgument)));
            this.#cache.set(CacheKeyNames.imageData, new ImageData(imageDataArray, windowWidth, windowHeight));

            this.#getCacheValue(CacheKeyNames.mandlebrotColouringModule).exports.iterationColouring(
                numWindowPoints,
                renderRequest.maxIterations,
                parseInt(this.#typedState.maxIterationsPalette.getEntry(0).toWasmArgument),
                this.#typedState.palette.length
            );
            this.#updateMandlebrotEngineState(({machine}) => ({
                machine: machine.provide(MandlebrotEngineEvents.colouringFinished)
            }));
        }
    }

    #getPropertyValue = (propertyIdentifier, propertyCollectionIdentifier) => getJsProp(
        propertyCollectionIdentifier,
        propertyIdentifier,
        this.props.propertyCollectionsGroup,
        this.state.inputs.propertyCollectionsGroup
    )

    /**
     *
     * @param {string} [groupIdentifier]
     * @param [updates]
     */
    #setInputValues = (groupIdentifier = PropertyGroupIdentifiers.world, updates = {}) => {
        const {propertyCollectionGroupState, isValid} = setInputValues(
            this.state.inputs.propertyCollectionsGroup,
            this.props.propertyCollectionsGroup,
            groupIdentifier,
            updates,
        )

        this.#updateInputsState(({machine}) => ({
                machine: machine.provide(isValid ? InputsEvents.validated : InputsEvents.invalidated)
            }),
            () => this.#updateInputsState(
                () => ({propertyCollectionsGroup: propertyCollectionGroupState}))
        );
    }

    get #renderRequest() {
        return this.#typedState.mandlebrotEngine.renderRequest
    }

    #onInputChange = (inputCollectionIdentifier, inputIdentifier, value) =>
        this.#setInputValues(inputCollectionIdentifier, {[inputIdentifier]: value});

    #movePaletteEntry = (oldIndex, newIndex) =>
        this.setState(
            {palette: this.#typedState.palette.movePaletteEntry(oldIndex, newIndex)},
            () => this.#updateMandlebrotEngineState(({machine}) => (
                    {machine: machine.provide(MandlebrotEngineEvents.paletteChange)}
                )
            )
        );

    /**
     * @param {React.MouseEvent} event
     *
     * @return {Point}
     */
    #windowCursorLocation = (event) =>
        withIt(this.#canvasRef.current.getBoundingClientRect(), rect =>
            Point.at(
                Math.min(event.clientX - Math.floor(rect.left), rect.width - 1),
                Math.min(event.clientY - Math.floor(rect.top), rect.height - 1)
            )
        )

    /**
     *
     * @param {string} mouseStateEvent
     * @param {React.MouseEvent} mouseEvent
     */
    #mouseEvent = (mouseStateEvent, mouseEvent) => {
        mouseEvent.preventDefault();
        this.#updateMouseState(
            () => ({event: mouseEvent}),
            () => this.#updateMouseState(
                ({machine}) => ({machine: machine.provide(mouseStateEvent)})
            )
        )
    }

    /**
     * @param {(MouseReactState) => MouseReactState} stateMutator
     * @param {() => void} [callback]
     */
    #updateMouseState = (stateMutator, callback) => {
        withIt(this.#typedState.mouse, it =>
            this.setState({mouse: Object.assign(it, stateMutator(it))}, callback)
        )
    }

    /**
     * @param {(MandlebrotEngineReactState) => MandlebrotEngineReactState} stateMutator
     * @param {() => any} [callback]
     */
    #updateMandlebrotEngineState = (stateMutator, callback) => {
        withIt(this.#typedState.mandlebrotEngine, it =>
            this.setState({mandlebrotEngine: Object.assign(it, stateMutator(it))}, callback)
        )
    }

    /**
     * @param {(InputsReactState) => InputsReactState} stateMutator
     * @param {() => any} [callback]
     */
    #updateInputsState = (stateMutator, callback) => {
        withIt(this.#typedState.inputs, it =>
            this.setState({inputs: Object.assign(it, stateMutator(it))}, callback)
        )
    }

    /**
     * @param {(ControlsReactState) => ControlsReactState} stateMutator
     * @param {() => any} [callback]
     */
    #updateControlsState = (stateMutator, callback) => {
        withIt(this.#typedState.controls, it =>
            this.setState({controls: Object.assign(it, stateMutator(it))}, callback)
        )
    }

    /**
     * @return {ReactState,Readonly<S>}
     */
    get #typedState() {
        return this.state;
    }

    #renderCanvas = () => (
        <CanvasDisplay
            theRef={this.#canvasRef}
            onMouseEnter={this.#mouseEvent.bind(this, WindowMouseEvents.cursorEntered)}
            onMouseMove={this.#mouseEvent.bind(this, WindowMouseEvents.cursorMoved)}
            onMouseDown={this.#mouseEvent.bind(this, WindowMouseEvents.buttonDown)}
            onMouseUp={this.#mouseEvent.bind(this, WindowMouseEvents.buttonUp)}
            onMouseLeave={this.#mouseEvent.bind(this, WindowMouseEvents.cursorLeft)}
            width={this.#getCanvasDisplayDimensions()[0]}
            height={this.#getCanvasDisplayDimensions()[1]}
        />
    );

    #getRenderInfo = () => Object.entries(this.#typedState.inputs.propertyCollectionsGroup).map(([propertyGroupIdentifier, propertyGroup]) =>
        ({
            identifier: propertyGroupIdentifier,
            properties: Object.entries(propertyGroup.properties).map(([propertyIdentifier, propertyValues]) =>
                Object.assign({identifier: propertyIdentifier}, propertyValues)
            ).sort((left, right) => left.index - right.index),
            errors: propertyGroup.errors
        })
    );

    #renderInputElements = () => (
        this.#getRenderInfo().map(
            ({identifier, properties, errors}) =>
                <ValidatedInputs
                    key={identifier}
                    disabled={false}
                    properties={properties}
                    errors={errors}
                    onChange={this.#onInputChange.bind(this, identifier)}
                />
        )
    );

    #renderControls = () => (
        <div className="controls">
            <button
                onClick={this.#renderRequested.bind(this)}
                disabled={StringStateHelper.inState(this.#typedState.controls.machine, ControlsStates.disabled)}>Render
            </button>
        </div>
    );

    render() {
        return (
            <div className="grid">
                <div className={"paletteColumn"}>
                    <span>MaxIterations</span>
                    <PaletteEditor palette={this.#typedState.maxIterationsPalette}/>
                    <span>Palette</span>
                    <PaletteEditor palette={this.#typedState.palette}
                                   onPaletteEntryPositionChange={this.#movePaletteEntry}/>
                </div>

                <div className="inputsColumn">
                    {this.#renderInputElements()}
                    {this.#renderControls()}
                </div>

                <div className="canvasColumn">
                    {this.#shouldRenderCanvas && this.#renderCanvas()}

                    <StateInfo
                        inputs={this.#typedState.inputs.machine}
                        controls={this.#typedState.controls.machine}
                        mandlebrotEngine={this.#typedState.mandlebrotEngine.machine}
                        mouse={this.#typedState.mouse.machine}/>
                </div>

            </div>
        );
    }
}

/**
 * @typedef ReactState
 * @property {ControlsReactState} controls - the state for the controls (the render button)
 * @property {InputsReactState} inputs - the state for the input controls
 * @property {MandlebrotEngineReactState} mandlebrotEngine - the state for the mandlebrot engine
 * @property {Palette} maxIterationsPalette - the state for the palette used to store the colour to use for rendering non-divergent points
 * @property {MouseReactState} mouse - the mouse state
 * @property {Palette} palette - the normal palette's state
 */

/**
 * @typedef ControlsReactState
 * @property {StateMachine} machine - the state machine for the controls
 */

/**
 * @typedef InputsReactState
 * @property {StateMachine} [machine] - the state machine for the input elements
 * @property {PropertyCollectionGroup} [propertyCollectionsGroup] - the render state for the input elements
 */

/**
 * @typedef MandlebrotEngineReactState
 * @property {Cache} [cache] - a cache used store off-screen image data and iteration count data else undefined if the cursor is not over the canvas * @property {StateMachine} machine
 * @property {StateMachine} [machine] - the state machine for the mandlebrot engine
 * @property {RenderRequest} [renderRequest] - the last requested rendering information
 * @property {WindowViewportTransform} [windowViewportTransform] - a transform from window coordinate space to world
 * coordinate space
 */

/**
 * @typedef MouseReactState
 * @property {React.MouseEvent} [event] - the last native mouse event
 * @property {StateMachine} [machine] - the window's mouse state machine
 * @property {Point} [windowCursorLocation] - the location of the cursor in the window's (canvas's) coordinate space
 * @property {Point} [windowDragStartLocation] - the location of the cursor in the canvas's coordinate space when a drag started
 */

/**
 * @typedef RenderRequest
 * @property {number} maxIterations - the maximum permitted iterations
 * @property {number} maxModulus - the maximum permitted modulus
 * @property {number} maxModulusSquared - the square of the maximum permitted modulus
 * @property {number} numWindowPoints - the number of points in total to calculate and render
 * @property {number} numWorkers - the number of WASM web workers to use
 * @property {number} windowHeight - the pixel height of the window (canvas)
 * @property {number} windowWidth - the pixel height of the window (canvas)
 * @property {Point} worldBottomRight - the bottom-right world point to calculate
 * @property {Point} worldTopLeft - the top-left world point to calculate
 */

/**
 * @typedef PropertyCollectionsGroup
 * @property {PropertyCollectionGroup} viewportPropertyGroup
 * @property {PropertyCollectionGroup} worldInputCollection
 * @property {PropertyCollectionGroup} engineInputCollection
 */

/**
 * @typedef PropertyCollectionGroup
 * @property properties
 * @property {String[]} [errors]
 */

