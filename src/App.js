import React from "react";
import {IMMUTABLE_EMPTY_SET, Pair} from "@ceilingcat/collections";
import {StateMachine} from "@ceilingcat/state-machine";
import ValidatedInputs from "./components/ValidatedInputs.js";
import Mandlebrot from "./math/Mandlebrot.js";
import Point from "./math/Point.js";
import './App.css';
import WindowViewportTransform from "./math/WindowViewportTransform.js";
import Cache from "./misc/Cache.js";
import Palette from "./graphics/Palette.js";
import CoordinateDisplay from "./components/CoordinateDisplay";
import ComplexNumber from "@ceilingcat/complex-number";
import PaletteEditor from "./components/PaletteEditor";
import LinearRectangularTransform from "./math/LinearRectangularTransform";
import AppStates from "./state/AppStates";
import AppEvents from "./state/AppEvents";
import PropertyIdentifiers from "./data/PropertyIdentifiers";
import CacheKeyNames from "./misc/CacheKeyNames";
import PropertyCollectionIdentifiers from "./data/PropertyCollectionIdentifiers";
import CanvasDisplay from "./components/CanvasDisplay";
import StateDisplay from "./components/StateDisplay";
import AppStateDisplayText from "./state/AppStateDisplayText";
import MouseEvents from "./state/MouseEvents";
import MouseStates from "./state/MouseStates";
import RGBColour from "./graphics/RGBColour";
import PropertyCollectionGroup from "./data/PropertyCollectionGroup";
import {DEFAULT_PROPS} from "./AppDefaultProps";

/**
 * @typedef RenderState
 * @property {Cache} cache - a cache used store off-screen image data and iteration count data
 * else undefined if the cursor is not over the canvas
 * @property {Point} lastRenderedLocation - the last location processed
 * @property {LinearRectangularTransform} linearRectangularTransform - a transform between one-dimensional data
 * structures and two-dimensional ones (the window/canvas e.g.)
 * @property {WindowViewportTransform} windowViewportTransform - a transform from window coordinate space to world
 * coordinate space
 * @property {number} renderIntervalId - the current rendering interval timer's identifier
 */

/**
 * @typedef MouseState
 * @property {Point|undefined} windowCursorLocation - the location of the cursor in the canvas's coordinate space
 * @property {StateMachine} machine - the location of the cursor in the canvas's coordinate space
 * @property {Point} windowDragStartLocation - the location of the cursor in the canvas's coordinate space when a drag started
 */
export default class App extends React.Component {

    static get defaultProps() {
        return DEFAULT_PROPS;
    }

    /**
     * @type {React.RefObject<HTMLCanvasElement>}
     */
    #canvasRef = React.createRef();

    /**
     * @param {string} currentState
     * @param {string} event
     * @param {string} nextState
     */
    static makeTransitionFunctionEntry =
        (currentState, event, nextState) => [new Pair(currentState, event), nextState];

    constructor(props) {
        super(props);
        this.state = Object.assign(
            {
                machine: new StateMachine(
                    AppEvents.all,
                    AppStates.all,
                    AppStates.CREATED,
                    new Map(
                        [
                            App.makeTransitionFunctionEntry(AppStates.CREATED, AppEvents.INPUT_VALIDATION_SUCCESS, AppStates.INPUTS_VALID),
                            App.makeTransitionFunctionEntry(AppStates.CREATED, AppEvents.INPUT_VALIDATION_FAILURE, AppStates.INPUTS_INVALID),
                            App.makeTransitionFunctionEntry(AppStates.INPUTS_INVALID, AppEvents.INPUT_VALIDATION_FAILURE, AppStates.INPUTS_INVALID),
                            App.makeTransitionFunctionEntry(AppStates.INPUTS_INVALID, AppEvents.INPUT_VALIDATION_SUCCESS, AppStates.INPUTS_VALID),
                            App.makeTransitionFunctionEntry(AppStates.INPUTS_VALID, AppEvents.INPUT_VALIDATION_FAILURE, AppStates.INPUTS_INVALID),
                            App.makeTransitionFunctionEntry(AppStates.INPUTS_VALID, AppEvents.INPUT_VALIDATION_SUCCESS, AppStates.INPUTS_VALID),
                            App.makeTransitionFunctionEntry(AppStates.INPUTS_VALID, AppEvents.START_PRESSED, AppStates.RENDERING__INIT),
                            App.makeTransitionFunctionEntry(AppStates.RENDERING__INIT, AppEvents.RENDERING_INITIALISED, AppStates.RENDERING),
                            App.makeTransitionFunctionEntry(AppStates.RENDERING, AppEvents.RENDERING_FINISHED, AppStates.RENDERING_FINISHED),
                            App.makeTransitionFunctionEntry(AppStates.RENDERING, AppEvents.INPUT_VALIDATION_SUCCESS, AppStates.INPUTS_VALID),
                        ]
                    ),
                    IMMUTABLE_EMPTY_SET,
                    this.#startTransitionHandler
                )
            },
            props
        );
    };

    componentDidMount() {
        this.#ifState(AppStates.CREATED, this.#setInputValues);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.#isState(AppStates.RENDERING__INIT)) {
            this.#handle(AppEvents.RENDERING_INITIALISED);
        } else if (this.#isShowingCanvas()) {
            const RENDERING_CONTEXT = this.#canvasRenderingContext;
            const WINDOW_WIDTH = this.#windowWidth;
            const WINDOW_HEIGHT = this.#windowHeight;
            const COMPUTED_CANVAS_STYLES = getComputedStyle(this.#canvasRef.current);
            RENDERING_CONTEXT.fillStyle = COMPUTED_CANVAS_STYLES.backgroundColor;
            RENDERING_CONTEXT.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

            if (this.#isShowingMandlebrot()) {
                RENDERING_CONTEXT.putImageData(this.#cache.get(CacheKeyNames.imageData), 0, 0);
            }

            if (this.#mouseMachine.state === MouseStates.MOVING) {
                const windowCursorLocation = this.#windowCursorLocation;
                this.#canvasRenderingContext.beginPath();
                RENDERING_CONTEXT.lineWidth = 1;
                RENDERING_CONTEXT.strokeStyle = RGBColour.WHITE.hexString;

                RENDERING_CONTEXT.beginPath();
                RENDERING_CONTEXT.moveTo(0, windowCursorLocation.y);
                RENDERING_CONTEXT.lineTo(WINDOW_WIDTH, windowCursorLocation.y);
                RENDERING_CONTEXT.stroke();

                RENDERING_CONTEXT.beginPath();
                RENDERING_CONTEXT.moveTo(windowCursorLocation.x, 0);
                RENDERING_CONTEXT.lineTo(windowCursorLocation.x, WINDOW_HEIGHT);
                RENDERING_CONTEXT.stroke();
            } else if (this.#mouseMachine.state === MouseStates.DRAGGING) {
                const windowDragStartLocation = this.#windowDragStartLocation;
                const windowCursorLocation = this.#windowCursorLocation;

                RENDERING_CONTEXT.lineWidth = 1;
                RENDERING_CONTEXT.strokeStyle = RGBColour.WHITE.hexString;

                RENDERING_CONTEXT.beginPath();
                RENDERING_CONTEXT.rect(
                    windowDragStartLocation.x,
                    windowDragStartLocation.y,
                    windowCursorLocation.x - windowDragStartLocation.x,
                    windowCursorLocation.y - windowDragStartLocation.y
                );
                RENDERING_CONTEXT.stroke();
            }
        }
    }

    #mouseStartTransitionHandler = (currentState, input, nextState) => {
        if (currentState === MouseStates.DRAGGING && nextState === MouseStates.MOVING) {
            const viewportTL = this
                .#windowViewportTransform
                .transform(this.#windowDragStartLocation);

            const viewportBR = this
                .#windowViewportTransform
                .transform(this.#windowCursorLocation);


            const MIN_X = Math.min(viewportTL.x, viewportBR.x);
            const MAX_X = Math.max(viewportTL.x, viewportBR.x);
            const MIN_Y = Math.min(viewportTL.y, viewportBR.y);
            const MAX_Y = Math.max(viewportTL.y, viewportBR.y);

            this.#setInputValues([
                [PropertyCollectionIdentifiers.world, PropertyIdentifiers.worldMinX, `${MIN_X}`],
                [PropertyCollectionIdentifiers.world, PropertyIdentifiers.worldMinY, `${MIN_Y}`],
                [PropertyCollectionIdentifiers.world, PropertyIdentifiers.worldMaxX, `${MAX_X}`],
                [PropertyCollectionIdentifiers.world, PropertyIdentifiers.worldMaxY, `${MAX_Y}`],
            ]);
        }
    }

    #startTransitionHandler = (currentState, input, nextState) => {
        if (currentState === AppStates.RENDERING) {
            this.#stopRenderingTimer();
        } else if (currentState === AppStates.INPUTS_VALID && nextState === AppStates.RENDERING__INIT) {

            const WINDOW_WIDTH = this.#windowWidth;
            const WINDOW_HEIGHT = this.#windowHeight;

            this.setState({
                render: {
                    cache: new Cache([
                        [CacheKeyNames.iterationData, []],
                        [
                            CacheKeyNames.imageData,
                            this.#canvasRenderingContext.createImageData(WINDOW_WIDTH, WINDOW_HEIGHT)
                        ]
                    ]),
                    lastRenderedLocation: undefined,
                    linearRectangularTransform:
                        new LinearRectangularTransform(WINDOW_WIDTH, WINDOW_HEIGHT),
                    windowViewportTransform:
                        new WindowViewportTransform(
                            ...(this.#worldExtents()),
                            Point.ORIGIN,
                            Point.at(WINDOW_WIDTH, WINDOW_HEIGHT)
                        ),
                    renderIntervalId: this.#startRenderingTimer()
                }
            });
        } else if (nextState === AppStates.INPUTS_VALID) {
            this.setState({
                mouse: {
                    machine: new StateMachine(
                        MouseEvents.all,
                        MouseStates.all,
                        MouseStates.INACTIVE,
                        new Map(
                            [
                                App.makeTransitionFunctionEntry(
                                    MouseStates.INACTIVE,
                                    MouseEvents.ENTERED_WINDOW,
                                    MouseStates.MOVING
                                ),
                                App.makeTransitionFunctionEntry(
                                    MouseStates.MOVING,
                                    MouseEvents.MOUSE_DOWN,
                                    MouseStates.DRAGGING
                                ),
                                App.makeTransitionFunctionEntry(
                                    MouseStates.DRAGGING,
                                    MouseEvents.MOUSE_UP,
                                    MouseStates.MOVING
                                ),
                                App.makeTransitionFunctionEntry(
                                    MouseStates.DRAGGING,
                                    MouseEvents.LEFT_WINDOW,
                                    MouseStates.INACTIVE
                                ),
                                App.makeTransitionFunctionEntry(
                                    MouseStates.MOVING,
                                    MouseEvents.LEFT_WINDOW,
                                    MouseStates.INACTIVE
                                ),
                            ]
                        ),
                        IMMUTABLE_EMPTY_SET,
                        this.#mouseStartTransitionHandler
                    )
                }
            });
        }
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * @return {[Point,Point]}
     */
    #worldExtents = () => [
        Point.at(
            ...([PropertyIdentifiers.worldMinX, PropertyIdentifiers.worldMinY]
                .map((identifier) => this.#getPropertyValue(identifier, PropertyCollectionIdentifiers.world)))
        ),
        Point.at(
            ...([PropertyIdentifiers.worldMaxX, PropertyIdentifiers.worldMaxY]
                .map((identifier) => this.#getPropertyValue(identifier, PropertyCollectionIdentifiers.world)))
        )
    ];

    #startRenderingTimer = () => window.setInterval(this.#processNextLocationOrFinish.bind(this), 0);

    #stopRenderingTimer = () => clearInterval(this.#renderState.renderIntervalId);

    #processNextLocation = () => {
        const WINDOW_COORDINATE = this.#getNextLocation(this.#renderState.lastRenderedLocation);
        const VIEWPORT_COORDINATE = this.#windowViewportTransform.transform(WINDOW_COORDINATE);
        const Z0 = ComplexNumber.createRectangular(VIEWPORT_COORDINATE.x, VIEWPORT_COORDINATE.y);
        const ITERATION_COUNT = Mandlebrot.execute(
            Z0,
            this.#getPropertyValue(PropertyIdentifiers.maxModulus, PropertyCollectionIdentifiers.engine),
            this.#getPropertyValue(PropertyIdentifiers.maxIterations, PropertyCollectionIdentifiers.engine)
        );
        this.#iterationData.push(ITERATION_COUNT);
        this.#setPixelColour(WINDOW_COORDINATE, ITERATION_COUNT);
        this.setState({
            render: Object.assign(this.#renderState, {lastRenderedLocation: WINDOW_COORDINATE})
        });
    }

    #processNextLocationOrFinish = () =>
        this.#ifState(
            AppStates.RENDERING,
            () => {
                this.#getNextLocation(this.#renderState.lastRenderedLocation) === undefined ?
                    this.#handle(AppEvents.RENDERING_FINISHED) :
                    this.#processNextLocation();
            }
        );

    /**
     * @param {Point} lastRenderedLocation
     * @return {Point|undefined}
     */
    #getNextLocation = lastRenderedLocation =>
        lastRenderedLocation === undefined ?
            Point.ORIGIN :
            this.#renderState.linearRectangularTransform.nextLocation(lastRenderedLocation);

    /**
     * @param {number} iterationCount
     * @return {RGBColour}
     */
    #pixelColour = iterationCount =>
        iterationCount === Number.POSITIVE_INFINITY ?
            Palette.divergentColour :
            this.#palette.getEntry(iterationCount % this.#palette.length);

    /**
     * @param {Point} viewportLocation
     * @param {number} iterationCount
     */
    #setPixelColour = (viewportLocation, iterationCount) =>
        this.#setMandlegrotPixelColour(viewportLocation, this.#pixelColour(iterationCount));

    /**
     * @return {number[]}
     */
    get #iterationData() {
        return this.#cache.get(CacheKeyNames.iterationData);
    }

    get #windowViewportTransform() {
        return this.#renderState.windowViewportTransform;
    }

    get #cache() {
        return this.#renderState.cache;
    }

    #reRenderCanvas() {
        this.#iterationData.forEach((value, offset) =>
            this.#setPixelColour(
                this.#renderState.linearRectangularTransform.forward(offset),
                value
            )
        )
    }

    /**
     * @param {Point} location
     * @param {RGBColour} rgbColour
     */
    #setMandlegrotPixelColour(location, rgbColour) {
        /**
         * @type {ImageData}
         */
        const imageData = this.#renderState.cache.get(CacheKeyNames.imageData)
        const pixelOffset = this.#renderState.linearRectangularTransform.inverse(location);
        const dataOffset = pixelOffset << 2;
        const imageDataData = imageData.data;
        imageDataData[dataOffset] = rgbColour.red;
        imageDataData[dataOffset + 1] = rgbColour.green;
        imageDataData[dataOffset + 2] = rgbColour.blue;
        imageDataData[dataOffset + 3] = 255;
    }

    /**
     * @return CanvasRenderingContext2D
     */
    get #canvasRenderingContext() {
        return this.#canvas.getContext('2d');
    }

    /**
     * @return {HTMLCanvasElement}
     */
    get #canvas() {
        return this.#canvasRef.current;
    }

    #handle = (event) => this.setState({machine: this.#appStateMachine.provide(event)});

    /**
     * @param event
     *
     * @return {Point}
     */
    #getCanvasPosition(event) {
        const rect = this.#canvas.getBoundingClientRect();
        return Point.at(event.clientX - Math.trunc(rect.left) - 1, event.clientY - Math.trunc(rect.top) - 1);
    }


    #onCanvasMouseEnter = (event) => {
        if (this.#isShowingCanvas()) {
            this.setState(
                {
                    mouse: Object.assign(
                        this.#mouseState, {machine: this.#mouseMachine.provide(MouseEvents.ENTERED_WINDOW)}
                    )
                });
            event.preventDefault();
        }
    }

    #onCanvasMouseMove = (event) => {
        if (this.#isShowingCanvas() &&
            (this.#mouseMachine.state === MouseStates.MOVING || this.#mouseMachine.state === MouseStates.DRAGGING)) {
            this.#setWindowCursorLocation(this.#getCanvasPosition(event));
            event.preventDefault();
        }
    }

    #onCanvasMouseDown = (event) => {
        if (this.#isShowingMandlebrot()) {
            this.setState({
                mouse: Object.assign(
                    this.#mouseState,
                    {
                        windowDragStartLocation: this.#getCanvasPosition(event),
                        machine: this.#mouseMachine.provide(MouseEvents.MOUSE_DOWN)
                    }
                )
            });
            event.preventDefault();
        }
    }

    #onCanvasMouseUp = (event) => {
        if (this.#isShowingCanvas()) {
            this.setState({
                mouse: Object.assign(
                    this.#mouseState, {machine: this.#mouseMachine.provide(MouseEvents.MOUSE_UP)})
            });
            event.preventDefault();
        }
    }

    #onCanvasMouseLeave = (_) => {
        if (this.#isShowingCanvas()) {
            this.setState({
                mouse: Object.assign(
                    this.#mouseState, {machine: this.#mouseMachine.provide(MouseEvents.LEFT_WINDOW)})
            });
        }
    }

    /**
     * @param {string} propertyIdentifier
     * @param {string}  propertyCollectionIdentifier
     *
     * @return {*}
     */
    #getPropertyValue = (propertyIdentifier, propertyCollectionIdentifier) =>
        this.#getProperty(propertyIdentifier, propertyCollectionIdentifier).boundValue;

    /**
     * @param {string} propertyIdentifier
     * @param {string} propertyCollectionIdentifier
     *
     * @return {Property}
     */
    #getProperty = (propertyIdentifier, propertyCollectionIdentifier) =>
        this
            .#propertyCollectionGroup
            .getPropertyCollection(propertyCollectionIdentifier)
            .getProperty(propertyIdentifier);

    #setInputValues = (inputValueBindings = []) => {
        const propertyCollectionGroup = this.#propertyCollectionGroup;

        propertyCollectionGroup.setValues(inputValueBindings);

        const VALIDATION_EVENT = propertyCollectionGroup.validate() ?
            AppEvents.INPUT_VALIDATION_SUCCESS :
            AppEvents.INPUT_VALIDATION_FAILURE;

        this.setState(propertyCollectionGroup.dehydrate, () => this.#handle(VALIDATION_EVENT));
    }

    #onInputChange = (inputCollectionIdentifier, inputIdentifier, value) => {
        this.#setInputValues([[inputCollectionIdentifier, inputIdentifier, value]]);
    }

    /**
     * @return {number|undefined}
     */
    get #windowWidth() {
        return this.#getPropertyValue(PropertyIdentifiers.windowWidth, PropertyCollectionIdentifiers.viewport);
    }

    /**
     * @return {number|undefined}
     */
    get #windowHeight() {
        return this.#getPropertyValue(PropertyIdentifiers.windowHeight, PropertyCollectionIdentifiers.viewport);
    }
    #movePaletteEntry = (oldIndex, newIndex) => {
        this.setState({palette: this.#palette.movePaletteEntry(oldIndex, newIndex)});
        if (this.#isShowingMandlebrot()) {
            this.#reRenderCanvas();
            this.forceUpdate();
        }
    }

    /**
     * @return {Point|undefined}
     */
    #lastRenderedLocation = () => this.#ifState(AppStates.RENDERING, () => this.#renderState.lastRenderedLocation);

    /**
     * @return {boolean}
     */
    #isState = (state) => AppStates.equals(this.#machineState, state);

    /**
     * @return {boolean}
     */
    #isStateIn = (...states) => AppStates.in(this.#machineState, ...states);

    #ifState = (state, f, e) => this.#isState(state) ?
        (typeof f === 'function' ? f() : f) :
        (e === undefined ?
                e :
                ((typeof e === 'function' ?
                        e() :
                        e
                ))
        );

    get #machineState() {
        return this.#appStateMachine.state;
    }

    /**
     * @return {PropertyCollectionGroup}
     */
    get #propertyCollectionGroup() {
        /**
         *
         * @type {PropertyCollectionData[]}
         */
        const propertyCollectionsGroupData = this.#propertyCollectionsGroupState;
        return PropertyCollectionGroup.hydrate(propertyCollectionsGroupData);
    }

    get #mouseMachine() {
        return this.#mouseState.machine;
    }

    /**
     * @return {PropertyCollectionData[]}
     */
    get #propertyCollectionsGroupState() {
        return this.state.propertyCollectionsGroup;
    }

    /**
     * @return {Palette}
     */
    get #palette() {
        return this.state.palette;
    }

    /**
     * @return {RenderState}
     */
    get #renderState() {
        return this.state.render;
    }

    /**
     * @return {StateMachine}
     */
    get #appStateMachine() {
        return this.state.machine;
    }

    /**
     * @return {MouseState}
     */
    get #mouseState() {
        return this.state.mouse;
    }

    /**
     * @return {Point}
     */
    get #windowCursorLocation() {
        return this.#mouseState.windowCursorLocation;
    }

    /**
     * @return {Point}
     */
    get #windowDragStartLocation() {
        return this.#mouseState.windowDragStartLocation;
    }

    #setWindowCursorLocation = location =>
        this.setState({mouse: Object.assign(this.#mouseState, {windowCursorLocation: location})});

    /**
     * @return {boolean}
     */
    #areInputsDisabled = () => !this.#isStateIn(AppStates.INPUTS_INVALID, AppStates.INPUTS_VALID);

    /**
     * @return {boolean}
     */
    #isStartButtonEnabled = () => this.#isState(AppStates.INPUTS_VALID);

    /**
     * @return {boolean}
     */
    #isShowingCanvas = () => this.#isStateIn(AppStates.RENDERING, AppStates.RENDERING_FINISHED, AppStates.INPUTS_VALID);

    /**
     * @return {boolean}
     */
    #isRendering = () => this.#isState(AppStates.RENDERING);

    /**
     * @return {boolean}
     */
    #isShowingMandlebrot = () => this.#isStateIn(AppStates.RENDERING, AppStates.RENDERING_FINISHED);

    #renderInputElements = () => (
        this.#propertyCollectionsGroupState.map(
            ({identifier, properties, errors}) =>
                <ValidatedInputs
                    key={identifier}
                    disabled={this.#areInputsDisabled()}
                    properties={
                        [...properties]
                            .sort(
                                (left, right) => left.index - right.index
                            )
                    }
                    errors={errors}
                    onChange={this.#onInputChange.bind(this, identifier)}
                />
        )
    );

    #renderControls = () => (
        <div className="controls">
            <button
                onClick={() => this.#handle(AppEvents.START_PRESSED)}
                disabled={!this.#isStartButtonEnabled()}>Start
            </button>
        </div>
    );

    #renderCanvas = () => (
        <CanvasDisplay
            theRef={this.#canvasRef}
            onMouseMove={this.#onCanvasMouseMove.bind(this)}
            onMouseEnter={this.#onCanvasMouseEnter.bind(this)}
            onMouseLeave={this.#onCanvasMouseLeave.bind(this)}
            onMouseDown={this.#onCanvasMouseDown.bind(this)}
            onMouseUp={this.#onCanvasMouseUp.bind(this)}
            width={this.#ifState(AppStates.INPUTS_INVALID, 0, () => this.#windowWidth)}
            height={this.#ifState(AppStates.INPUTS_INVALID, 0, () => this.#windowHeight)}
        />
    );

    #renderRenderInformation = () => (
        this.#isRendering() &&
        (
            <div>
                <span>Processing Image Pixel: </span>
                <CoordinateDisplay location={this.#lastRenderedLocation()}/>
            </div>
        )
    );

    render() {
        return (
            <div className="grid">
                <div className={"paletteColumn"}>
                    <PaletteEditor palette={this.#palette} onPaletteEntryPositionChange={this.#movePaletteEntry}/>
                </div>

                <div className="inputsColumn">
                    {this.#renderInputElements()}
                    {this.#renderControls()}
                </div>

                <div className="canvasColumn">
                    {this.#renderCanvas()}

                    <div className="information">
                        <StateDisplay
                            displayText={AppStateDisplayText.from(this.#machineState)}
                        />

                        {this.#renderRenderInformation()}
                    </div>
                </div>
            </div>
        );
    }
}