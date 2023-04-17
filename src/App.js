import React from "react";
import Point from "./math/Point.js";
import "./App.css";
import MandlebrotEngineStates from "./state/mandlebrotEngine/MandlebrotEngineStates";
import MandlebrotEngineEvents from "./state/mandlebrotEngine/MandlebrotEngineEvents";
import PropertyIdentifiers from "./data/PropertyIdentifiers";
import AppCacheKeyNames from "./AppCacheKeyNames";
import PropertyGroupIdentifiers from "./data/PropertyGroupIdentifiers";
import MandlebrotWorker from "./workers/mandlebrotEngine/MandlebrotWorker";
import MouseStateMachine from "./state/mouse/MouseStateMachine";
import InputStateMachine from "./state/inputs/InputsStateMachine";
import MandlebrotEngineStateMachine from "./state/mandlebrotEngine/MandlebrotEngineStateMachine";
import MemoryHelper from "./helpers/MemoryHelper";
import InputsEvents from "./state/inputs/InputsEvents";
import WindowMouseEvents from "./state/mouse/WindowMouseEvents";
import ControlsStateMachine from "./state/controls/ControlsStateMachine";
import StringStateHelper from "./state/StringStateHelper";
import ControlsStates from "./state/controls/ControlsStates";
import WindowViewportTransform from "./math/WindowViewportTransform";
import InputsStates from "./state/inputs/InputsStates";
import ArrayHelper from "./helpers/ArrayHelper";
import MouseStates from "./state/mouse/MouseStates";
import {DEFAULT_PROPS} from "./AppDefaultProps";
import {VOID, withIt} from "./helpers/ScopeHelper";
import {createState, getJsProp, setInputValues} from "./data/StateHelper";
import BoxScaleWorker from "./workers/scaler/BoxScaleWorker";
import {
    cachedBoxScaleWorker,
    cachedCanvasRef,
    cachedCompletedTaskPool,
    cachedImageData,
    cachedImageDataAndThumbnailMemory,
    cachedIterationDataAndPaletteMemory,
    cachedIterationDataMemory,
    cachedMandlebrotColouringModule,
    cachedMandlebrotPalette,
    cachedMandlebrotWorkers,
    cachedPalette,
    cachedPendingLineNumberPool,
    cachedThumbnailCanvasRefs,
    cachedThumbnailMemory,
    setCacheValue,
    setCacheValueIfAbsent,
    setCacheValues
} from "./AppCache";
import {renderCanvasColumn, renderHistoryColumn, renderInputsColumn, renderPalettesColumn} from "./AppRenderer";
import {canvasCursorLocation, drawCrosshairs, drawDragSelection} from "./graphics/CanvasHelper";
import {
    createOrGrowImageDataAndThumbnailMemory,
    createOrGrowIterationDataAndPaletteMemory,
    createOrGrowIterationDataMemory,
    createOrGrowThumbnailMemory,
    pointsToBytes
} from "./AppMemoryHelper";
// noinspection ES6UnusedImports
import {Types} from "./Types";

export default class App extends React.Component {

    static get defaultProps() {
        return DEFAULT_PROPS;
    }

    constructor(props) {
        super(props);

        setCacheValues([
            [AppCacheKeyNames.thumbnailCanvasRefs, []],
            [AppCacheKeyNames.mandlebrotWorkers, []],
            [AppCacheKeyNames.canvasRef, React.createRef()],
            [AppCacheKeyNames.palette, this.props.palette],
            [AppCacheKeyNames.mandlebrotPalette, this.props.mandlebrotPalette],
        ]);

        this.state = {
            mandlebrotEngine: {
                machine: MandlebrotEngineStateMachine(VOID, this.#mandlebrotEngineEndTransitionHandler),
                history: [],
            },
            mouse: {
                machine: MouseStateMachine(this.#mouseStartTransitionHandler).provide(WindowMouseEvents.initialised)
            },
            controls: {machine: ControlsStateMachine()},
            inputs: {
                machine: InputStateMachine(VOID, this.#inputEndTransitionHandler),
                propertyCollectionsGroup: createState(props.propertyCollectionsGroup),
            }
        };
    };

    componentDidMount = () => {
        this.#setInputValues();
    };

    /**
     * @return {boolean}
     */
    get #shouldRenderCanvas() {
        return !StringStateHelper.inState(this.#state.inputs.machine, InputsStates.invalid) ||
            !StringStateHelper.inState(this.#state.mandlebrotEngine.machine, MandlebrotEngineStates.created);
    };

    /**
     * @return {[number, number]}
     */
    #getCanvasDisplayDimensions() {
        const [inputWindowWidth, inputWindowHeight] = this.#getPropertyValues(
            PropertyGroupIdentifiers.viewport,
            PropertyIdentifiers.windowWidth,
            PropertyIdentifiers.windowHeight
        );

        const mandlebrotEngineStateMachine = this.#state.mandlebrotEngine.machine;
        const inputsStateMachine = this.#state.inputs.machine;

        if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.created)) {
            return [inputWindowWidth, inputWindowHeight];
        } else {
            const {windowWidth, windowHeight} = this.#renderRequest;
            const inputsValid = StringStateHelper.inState(inputsStateMachine, InputsStates.valid);
            return inputsValid ?
                [Math.max(windowWidth, inputWindowWidth), Math.max(windowHeight, inputWindowHeight)] :
                [windowWidth, windowHeight];
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const inputsStateMachine = this.#state.inputs.machine;
        const mandlebrotEngineStateMachine = this.#state.mandlebrotEngine.machine;
        const mouseStateMachine = this.#state.mouse.machine;

        if (!StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.created) &&
            !StringStateHelper.inState(inputsStateMachine, InputsStates.invalid)) {
            const ctx = cachedCanvasRef().current.getContext("2d");
            // const inputWindowWidth =
            //     this.#getPropertyValue(PropertyIdentifiers.windowWidth, PropertyCollectionIdentifiers.viewport);
            // const inputWindowHeight =
            //     this.#getPropertyValue(PropertyIdentifiers.windowHeight, PropertyCollectionIdentifiers.viewport);
            const {windowWidth, windowHeight} = this.#renderRequest;
            // const maxDimensions =
            //     [Math.max(windowWidth, inputWindowWidth), Math.max(windowHeight, inputWindowHeight)];

            if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.finished, MandlebrotEngineStates.recolouring)) {
                ctx.putImageData(cachedImageData(), 0, 0);

                cachedThumbnailCanvasRefs().reverse().forEach((value, index) =>
                    value.current.getContext("2d").putImageData(
                        new ImageData(
                            new Uint8ClampedArray(
                                cachedThumbnailMemory().buffer,
                                index * pointsToBytes(this.#numberOfThumbnailPoints),
                                pointsToBytes(this.#numberOfThumbnailPoints)
                            ),
                            this.props.thumbnails.widthPixels,
                            this.props.thumbnails.heightPixels
                        ),
                        0,
                        0
                    )
                );
            }

            if (StringStateHelper.inState(mandlebrotEngineStateMachine, MandlebrotEngineStates.finished)) {
                const windowCursorLocation = this.#state.mouse.windowCursorLocation;
                if (StringStateHelper.inState(mouseStateMachine, MouseStates.active)) {
                    drawCrosshairs(
                        ctx,
                        windowWidth,
                        windowHeight,
                        this.props.canvas.crosshairs,
                        windowCursorLocation
                    );

                } else if (StringStateHelper.inState(mouseStateMachine, MouseStates.dragging)) {
                    drawDragSelection(
                        ctx,
                        this.props.canvas.drag,
                        this.#state.mouse.windowDragStartLocation,
                        windowCursorLocation,
                    );
                }
            }
        }
    };

    #inputEndTransitionHandler = (currentState, input) =>
        this.#updateState("controls", ({machine}) => ({machine: machine.provide(input)}));

    #mouseStartTransitionHandler = (currentState, input, nextState) => {
        if (currentState === MouseStates.dragging && nextState === MouseStates.active) {
            const dragStartLocation = this.#state.mouse.windowDragStartLocation;
            const dragEndLocation = this.#state.mouse.windowCursorLocation;
            if (!dragStartLocation.equals(dragEndLocation)) {
                const [tl, br] = Point.sort(dragStartLocation, dragEndLocation)
                    .map((point) => this.#state.mandlebrotEngine.windowViewportTransform.transform(point));

                this.#setInputValues(
                    {
                        [PropertyGroupIdentifiers.world]: {
                            [PropertyIdentifiers.worldMinX]: tl.x,
                            [PropertyIdentifiers.worldMinY]: tl.y,
                            [PropertyIdentifiers.worldMaxX]: br.x,
                            [PropertyIdentifiers.worldMaxY]: br.y,
                        }
                    }
                );
            }
        }
        if ([WindowMouseEvents.cursorEntered, WindowMouseEvents.cursorMoved].includes(input)) {
            this.#updateState("mouse", ({event}) => ({windowCursorLocation: canvasCursorLocation(event)}));
        } else if (input === WindowMouseEvents.cursorLeft) {
            this.#updateState("mouse", () => ({windowCursorLocation: undefined, windowDragStartLocation: undefined}));
        } else if (input === WindowMouseEvents.buttonDown) {
            this.#updateState("mouse", ({event}) => ({windowDragStartLocation: canvasCursorLocation(event)}));
        } else if (input === WindowMouseEvents.buttonUp) {
            this.#updateState("mouse", () => ({windowDragStartLocation: undefined}));
        }
    };

    /**
     * @param {MandlebrotWorker} workerTask
     */
    #onWorkerTaskSuccess = workerTask => cachedCompletedTaskPool().add(workerTask.windowY);

    /**
     * @param {RenderRequest} renderRequest
     */
    #processWorkers = (renderRequest) => {
        const pendingTaskPool = cachedPendingLineNumberPool();
        const {windowWidth, windowHeight: totalNumberOfTasks} = renderRequest;
        if (cachedCompletedTaskPool().size === totalNumberOfTasks) {
            this.#updateState("mandlebrotEngine", ({machine}) => ({
                machine: machine.provide(MandlebrotEngineEvents.calculationFinished)
            }));
        } else {
            const {worldTopLeft, worldBottomRight, maxModulusSquared, maxIterations} = renderRequest;
            const idleWorkers = cachedMandlebrotWorkers().filter((worker) => worker.isReady);
            if (idleWorkers.length !== 0) {
                idleWorkers
                    .forEach((idleWorkerTask) => {
                        if (pendingTaskPool.size > 0) {
                            const nextLineOffset = pendingTaskPool.keys().next().value;
                            if (pendingTaskPool.delete(nextLineOffset)) {
                                const taskWorldStartLocation =
                                    this.#state.mandlebrotEngine.windowViewportTransform.transform(
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
            setTimeout(() => this.#processWorkers.call(this, renderRequest));
        }
    };

    /**
     * @return {RenderRequest}
     */
    get #createRenderRequest() {
        const [windowWidth, windowHeight] = this.#getPropertyValues(
            PropertyGroupIdentifiers.viewport, PropertyIdentifiers.windowWidth, PropertyIdentifiers.windowHeight
        );
        const [maxModulus, maxIterations, numWorkers] = this.#getPropertyValues(
            PropertyGroupIdentifiers.engine,
            PropertyIdentifiers.maxModulus,
            PropertyIdentifiers.maxIterations,
            PropertyIdentifiers.numWorkers
        );
        const [worldMinX, worldMinY, worldMaxX, worldMaxY] = this.#getPropertyValues(
            PropertyGroupIdentifiers.world,
            PropertyIdentifiers.worldMinX,
            PropertyIdentifiers.worldMinY,
            PropertyIdentifiers.worldMaxX,
            PropertyIdentifiers.worldMaxY
        );

        return {
            worldTopLeft: Point.at(worldMinX, worldMinY),
            worldBottomRight: Point.at(worldMaxX, worldMaxY),
            windowWidth: windowWidth,
            windowHeight: windowHeight,
            maxModulus: maxModulus,
            maxModulusSquared: maxModulus * maxModulus,
            maxIterations: maxIterations,
            numWorkers: numWorkers,
            numWindowPoints: windowWidth * windowHeight
        };
    };

    #renderRequested = () =>
        this.#updateState("mandlebrotEngine", ({machine}) => ({
            machine: machine.provide(MandlebrotEngineEvents.initialiseCalculations)
        }));

    #onBoxScaleInitialised = () => {
        this.#updateState("mandlebrotEngine", ({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.thumbnailGenerationInitialised)})
        );
    };

    /**
     * @param {MandlebrotWorker} worker
     */
    #mandlebrotWorkerInitialised(worker) {
        const workers = cachedMandlebrotWorkers();
        workers.push(worker);
        if (workers.length === this.#renderRequest.numWorkers) {
            this.#signalMandlebrotEngineCalculationsInitialised();
        }
    };

    #signalMandlebrotEngineCalculationsInitialised = () =>
        this.#updateState("mandlebrotEngine", ({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.calculationInitialised)})
        );

    #onBoxScaleCompleted = () =>
        this.#updateState("mandlebrotEngine", ({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.thumbnailGenerationFinished)})
        );

    /**
     * @param {RenderRequest} renderRequest
     * @return {HistoricRender[]}
     */
    #buildRenderHistory = (renderRequest) =>
        [...this.#state.mandlebrotEngine.history, {
            renderRequest: renderRequest,
            palette: cachedPalette(),
            mandlebrotPalette: cachedMandlebrotPalette(),
        }];

    #mandlebrotEngineEndTransitionHandler = (currentState) => {
        if (currentState === MandlebrotEngineStates.initialisingCalculations) {
            const renderRequest = this.#createRenderRequest;
            const currentWorkersCount = cachedMandlebrotWorkers().length;

            const iterationDataMemory = createOrGrowIterationDataMemory(renderRequest.numWindowPoints);
            setCacheValues([
                [AppCacheKeyNames.iterationDataMemory, iterationDataMemory],
                [
                    AppCacheKeyNames.iterationDataAndPaletteMemory,
                    createOrGrowIterationDataAndPaletteMemory(
                        renderRequest.numWindowPoints,
                        cachedPalette().length
                    )],
                [
                    AppCacheKeyNames.imageDataAndThumbnailMemory,
                    createOrGrowImageDataAndThumbnailMemory(
                        renderRequest.numWindowPoints,
                        this.#numberOfThumbnailPoints
                    )],
                [
                    AppCacheKeyNames.thumbnailMemory,
                    createOrGrowThumbnailMemory(
                        this.#state.mandlebrotEngine.history.length + 1,
                        this.#numberOfThumbnailPoints
                    )
                ],
                [
                    AppCacheKeyNames.pendingLineNumberPool,
                    new Set(ArrayHelper.createInit(renderRequest.windowHeight, i => i))
                ],
                [AppCacheKeyNames.completedLineNumberPool, new Set()]
            ]);
            const workersDelta = renderRequest.numWorkers - currentWorkersCount;
            let callback = VOID;
            if (workersDelta < 0) {
                const workersArray = cachedMandlebrotWorkers();
                const newWorkers = workersArray.slice(0, renderRequest.numWorkers);
                workersArray.slice(renderRequest.numWorkers).forEach((worker) => {
                    worker.terminate();
                });
                setCacheValue(AppCacheKeyNames.mandlebrotWorkers, newWorkers);
                callback = () => this.#signalMandlebrotEngineCalculationsInitialised();
            } else if (workersDelta === 0) {
                callback = () => this.#signalMandlebrotEngineCalculationsInitialised();
            } else if (workersDelta > 0) {
                if (currentWorkersCount === 0) {
                    setCacheValue(AppCacheKeyNames.mandlebrotWorkers, []);
                }
                callback = () => {
                    [...Array(workersDelta).keys()].forEach(() => {
                        new MandlebrotWorker(
                            iterationDataMemory,
                            this.#mandlebrotWorkerInitialised.bind(this),
                            this.#onWorkerTaskSuccess
                        ).init();
                    });
                };
            }
            this.#updateState("mandlebrotEngine", () => ({
                history: this.#buildRenderHistory(renderRequest),
                windowViewportTransform: new WindowViewportTransform(
                    renderRequest.worldTopLeft,
                    renderRequest.worldBottomRight,
                    Point.ORIGIN,
                    Point.at(renderRequest.windowWidth, renderRequest.windowHeight)
                )
            }), callback);
        } else if (currentState === MandlebrotEngineStates.calculating) {
            setTimeout(() => this.#processWorkers.call(this, this.#renderRequest));
        } else if (currentState === MandlebrotEngineStates.initialisingColourMapping) {
            WebAssembly.instantiateStreaming(
                fetch("MandlebrotColouring.wasm"),
                {env: {iterationAndPaletteData: cachedIterationDataAndPaletteMemory()}}
            ).then((webAssemblyInstantiatedSource) => {
                this.#updateState("mandlebrotEngine", ({machine}) => {
                        setCacheValue(AppCacheKeyNames.mandlebrotColouringModule, webAssemblyInstantiatedSource.instance);
                        return {
                            machine: machine.provide(MandlebrotEngineEvents.colouringInitialised)
                        };
                    }
                );
            });
        } else if (StringStateHelper.in(currentState, MandlebrotEngineStates.colourMapping, MandlebrotEngineStates.recolouring)) {
            const renderRequest = this.#renderRequest;
            const {windowWidth, windowHeight, numWindowPoints} = renderRequest;
            const numWindowBytes = pointsToBytes(numWindowPoints);
            const imageDataArray = new Uint8ClampedArray(cachedIterationDataAndPaletteMemory().buffer, 0, numWindowBytes);
            new Uint32Array(imageDataArray.buffer).set(
                new Uint32Array(cachedIterationDataMemory().buffer, 0, numWindowPoints)
            );
            new Uint32Array(imageDataArray.buffer, numWindowBytes)
                .set(cachedPalette().colours.map((colour) => parseInt(colour.toWasmArgument)));
            setCacheValue(AppCacheKeyNames.imageData, new ImageData(imageDataArray, windowWidth, windowHeight));

            // noinspection JSValidateTypes
            /**
             * @type {IterationColouringExports}
             */
            const mandlebrotColouringModuleExports = cachedMandlebrotColouringModule().exports;
            mandlebrotColouringModuleExports.iterationColouring(
                numWindowPoints,
                renderRequest.maxIterations,
                parseInt(cachedMandlebrotPalette().getColour(0).toWasmArgument),
                cachedPalette().length
            );
            this.#updateState("mandlebrotEngine", ({machine}) => ({
                machine: machine.provide(MandlebrotEngineEvents.colouringFinished)
            }));
        } else if (currentState === MandlebrotEngineStates.initialisingThumbnailGeneration) {
            setCacheValueIfAbsent(
                AppCacheKeyNames.boxScaleWorker,
                new BoxScaleWorker(this.#onBoxScaleInitialised.bind(this), this.#onBoxScaleCompleted.bind(this))
            );
            cachedBoxScaleWorker().initialise();
            MemoryHelper.populate(
                cachedImageDataAndThumbnailMemory(),
                new Uint32Array(cachedIterationDataAndPaletteMemory().buffer),
                0,
                this.#renderRequest.numWindowPoints
            );
        } else if (currentState === MandlebrotEngineStates.thumbnailGeneration) {
            const renderRequest = this.#renderRequest;
            cachedBoxScaleWorker().execute({
                imageAndThumbnailMemory: cachedImageDataAndThumbnailMemory(),
                sourceWidthPixels: renderRequest.windowWidth,
                sourceHeightPixels: renderRequest.windowHeight,
                targetWidthPixels: this.props.thumbnails.widthPixels,
                targetHeightPixels: this.props.thumbnails.heightPixels,
            });
        } else if (currentState === MandlebrotEngineStates.copyingThumbnail) {
            const renderRequest = this.#renderRequest;
            const currentHistorySize = this.#state.mandlebrotEngine.history.length;
            MemoryHelper.populate(
                cachedThumbnailMemory(),
                new Uint32Array(
                    cachedImageDataAndThumbnailMemory().buffer,
                    pointsToBytes(renderRequest.numWindowPoints),
                    this.#numberOfThumbnailPoints
                ),
                (currentHistorySize - 1) * this.#numberOfThumbnailPoints
            );

            cachedThumbnailCanvasRefs().push(React.createRef());

            this.#updateState("mandlebrotEngine", ({machine}) =>
                ({machine: machine.provide(MandlebrotEngineEvents.thumbnailCopied)})
            );
        }
    };

    /**
     * @param {string} propertyIdentifiers
     * @param {string} propertyCollectionIdentifier
     * @return {*[]}
     */
    #getPropertyValues = (propertyCollectionIdentifier, ...propertyIdentifiers) =>
        propertyIdentifiers.map(
            propertyIdentifier => this.#getPropertyValue(propertyIdentifier, propertyCollectionIdentifier)
        );

    #getPropertyValue = (propertyIdentifier, propertyCollectionIdentifier) => getJsProp(
        propertyCollectionIdentifier,
        propertyIdentifier,
        this.props.propertyCollectionsGroup,
        this.state.inputs.propertyCollectionsGroup
    );

    /**
     * @param {object} [updates]
     */
    #setInputValues = (updates = {}) => {
        const {propertyCollectionGroupState, isValid} = setInputValues(
            this.state.inputs.propertyCollectionsGroup,
            this.props.propertyCollectionsGroup,
            updates,
        );

        this.#updateState(
            "inputs",
            ({machine}) => ({
                machine: machine.provide(isValid ? InputsEvents.validated : InputsEvents.invalidated),
                propertyCollectionsGroup: propertyCollectionGroupState
            })
        );
    };

    #historyItemChosen = (index) => {
        const historicRender = this.#state.mandlebrotEngine.history[index];

        setCacheValue(AppCacheKeyNames.mandlebrotPalette, historicRender.mandlebrotPalette);
        setCacheValue(AppCacheKeyNames.palette, historicRender.palette);

        this.#setInputValues({
                [PropertyGroupIdentifiers.viewport]: {
                    [PropertyIdentifiers.windowWidth]: historicRender.renderRequest.windowWidth,
                    [PropertyIdentifiers.windowHeight]: historicRender.renderRequest.windowHeight,
                },
                [PropertyGroupIdentifiers.engine]: {
                    [PropertyIdentifiers.numWorkers]: historicRender.renderRequest.numWorkers,
                    [PropertyIdentifiers.maxIterations]: historicRender.renderRequest.maxIterations,
                    [PropertyIdentifiers.maxModulus]: historicRender.renderRequest.maxModulus,
                },
                [PropertyGroupIdentifiers.world]: {
                    [PropertyIdentifiers.worldMinX]: historicRender.renderRequest.worldTopLeft.x,
                    [PropertyIdentifiers.worldMinY]: historicRender.renderRequest.worldTopLeft.y,
                    [PropertyIdentifiers.worldMaxX]: historicRender.renderRequest.worldBottomRight.x,
                    [PropertyIdentifiers.worldMaxY]: historicRender.renderRequest.worldBottomRight.y,
                }
            }
        );
    };

    /**
     * @return {RenderRequest}
     */
    get #renderRequest() {
        return this.#state.mandlebrotEngine.history.at(-1).renderRequest;
    };

    #mandlebrotPaletteChanged = palette => {
        setCacheValue(AppCacheKeyNames.mandlebrotPalette, palette);

        this.#updateState("mandlebrotEngine", ({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.paletteChange)})
        );
    };

    #paletteChanged = (palette) => {
        setCacheValue(AppCacheKeyNames.palette, palette);
        this.#updateState("mandlebrotEngine", ({machine}) =>
            ({machine: machine.provide(MandlebrotEngineEvents.paletteChange)})
        );
    };

    /**
     *
     * @param {string} mouseStateEvent
     * @param {React.MouseEvent} mouseEvent
     */
    #onMouseEvent = (mouseStateEvent, mouseEvent) => {
        mouseEvent.preventDefault();
        this.#updateState(
            "mouse",
            () => ({event: mouseEvent}),
            () => this.#updateState("mouse",
                ({machine}) => ({machine: machine.provide(mouseStateEvent)})
            )
        );
    };

    /**
     * @param {"mouse"|"mandlebrotEngine"|"inputs"|"controls"} id
     * @param {function} stateMutator
     * @param {function} [callback]
     */
    #updateState = (id, stateMutator, callback) => {
        withIt(this.#state[id], it =>
            this.setState({[id]: Object.assign(it, stateMutator(it))}, callback)
        );
    };

    /**
     * @return {ReactState,Readonly<S>}
     */
    get #state() {
        return this.state;
    };

    get #numberOfThumbnailPoints() {
        return this.props.thumbnails.widthPixels * this.props.thumbnails.heightPixels;
    };

    #getRenderInfo = () => Object
        .entries(this.#state.inputs.propertyCollectionsGroup)
        .map(
            ([propertyGroupIdentifier, propertyGroup]) =>
                ({
                    identifier: propertyGroupIdentifier,
                    properties: Object
                        .entries(propertyGroup.properties)
                        .map(
                            ([propertyIdentifier, propertyValues]) =>
                                Object.assign({identifier: propertyIdentifier}, propertyValues)
                        )
                        .sort((left, right) => left.index - right.index),
                    errors: propertyGroup.errors
                })
        );

    render = () => (
        <div className="grid">
            {
                renderPalettesColumn(
                    cachedMandlebrotPalette(),
                    cachedPalette(),
                    this.#mandlebrotPaletteChanged,
                    this.#paletteChanged,
                )
            }

            {
                renderHistoryColumn(
                    this.#state.mandlebrotEngine.history,
                    this.props.thumbnails.widthPixels,
                    this.props.thumbnails.heightPixels,
                    cachedThumbnailCanvasRefs(),
                    this.#historyItemChosen.bind(this)
                )
            }

            {
                renderInputsColumn(
                    this.#getRenderInfo(),
                    (groupIdentifier, inputIdentifier, value) =>
                        this.#setInputValues({[groupIdentifier]: {[inputIdentifier]: value}}),
                    StringStateHelper.inState(
                        this.#state.controls.machine,
                        ControlsStates.disabled
                    ) ||
                    !StringStateHelper.inState(
                        this.#state.mandlebrotEngine.machine,
                        MandlebrotEngineStates.finished, MandlebrotEngineStates.created
                    ),
                    this.#renderRequested
                )
            }

            {
                renderCanvasColumn(
                    cachedCanvasRef(),
                    this.#shouldRenderCanvas,
                    this.#getCanvasDisplayDimensions()[0],
                    this.#getCanvasDisplayDimensions()[1],
                    this.#onMouseEvent.bind(this),
                    this.#state
                )
            }
        </div>
    );
}
