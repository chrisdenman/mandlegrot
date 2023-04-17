import {StateMachine} from "@ceilingcat/state-machine";

/**
 * @typedef ReactState
 * @property {ControlsReactState} controls - the state for the controls (the render button)
 * @property {InputsReactState} inputs - the state for the input controls
 * @property {MandlebrotEngineReactState} mandlebrotEngine - the state for the mandlebrot engine
 * @property {Palette} mandlebrotPalette - the state for the palette used to store the colour to use for rendering non-divergent points
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
 * @property {StateMachine} [machine] - the state machine for the mandlebrot engine
 * @property {HistoricRender[]} [history] - the render history stack
 * @property {RenderRequest} [renderRequest] - the last requested rendering information
 * @property {WindowViewportTransform} [windowViewportTransform] - a transform from window coordinate space to world
 * coordinate space
 */

/**
 * @typedef HistoricRender
 * @property {RenderRequest} renderRequest
 * @property {Palette} palette
 * @property {Palette} mandlebrotPalette
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

/**
 * @typedef IterationColouringExports
 * @property {IterationColouringFunction} iterationColouring
 */

/**
 * @callback IterationColouringFunction
 * @param {number} count
 * @param {number} maxIterationCount
 * @param {number} mandlebrotColour
 * @param {number} numPaletteEntries
 */

export const Types = {};