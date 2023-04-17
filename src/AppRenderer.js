import ValidatedInputs from "./components/ValidatedInputs";
import React from "react";
import CanvasDisplay from "./components/CanvasDisplay";
import WindowMouseEvents from "./state/mouse/WindowMouseEvents";
import StateInfo from "./components/StateInfo";
import RenderHistory from "./components/RenderHistory";
import PaletteEditor from "./components/palette/PaletteEditor";

const renderCanvas = (canvasRef, width, height, onMouseEvent) => (
    <CanvasDisplay
        theRef={canvasRef}
        onMouseEnter={(event) => onMouseEvent(WindowMouseEvents.cursorEntered, event)}
        onMouseMove={(event) => onMouseEvent(WindowMouseEvents.cursorMoved, event)}
        onMouseDown={(event) => onMouseEvent(WindowMouseEvents.buttonDown, event)}
        onMouseUp={(event) => onMouseEvent(WindowMouseEvents.buttonUp, event)}
        onMouseLeave={(event) => onMouseEvent(WindowMouseEvents.cursorLeft, event)}
        width={width}
        height={height}
    />
);

const renderStateInfo = (typedState) => (
    <StateInfo
        inputs={typedState.inputs.machine}
        controls={typedState.controls.machine}
        mandlebrotEngine={typedState.mandlebrotEngine.machine}
        mouse={typedState.mouse.machine}/>
);

/**
 *
 * @param canvasRef
 * @param shouldRenderCanvas
 * @param width
 * @param height
 * @param onMouseEvent
 * @param typedState
 * @return {JSX.Element}
 */
const renderCanvasColumn = (canvasRef, shouldRenderCanvas, width, height, onMouseEvent, typedState) => (
    <div className="canvasColumn">
        {shouldRenderCanvas && renderCanvas(canvasRef, width, height, onMouseEvent)}
        {renderStateInfo(typedState)}
    </div>
);

const renderInputElements = (renderInfo, onInputChange) => (
    renderInfo.map(
        ({identifier, properties, errors}) =>
            <ValidatedInputs
                key={identifier}
                disabled={false}
                properties={properties}
                errors={errors}
                onChange={onInputChange.bind(this, identifier)}
            />
    )
);

const renderControls = (disabled, onclick) => (
    <div className="controls">
        <button
            onClick={onclick}
            disabled={disabled}>Render
        </button>
    </div>
);

const renderInputsColumn = (renderInfo, onInputChange, renderButtonDisabled, renderRequested) => (
    <div className="inputsColumn">
        {renderInputElements(renderInfo, onInputChange)}
        {renderControls(renderButtonDisabled, renderRequested)}
    </div>
);

const renderHistoryColumn = (history, thumbnailWidthPixels, thumbnailHeightPixels, canvasRefs, onDoubleClick) => (
    <div className="historyColumn">
        <RenderHistory
            history={history}
            thumbnailWidthPixels={thumbnailWidthPixels}
            thumbnailHeightPixels={thumbnailHeightPixels}
            canvasRefs={canvasRefs}
            onDoubleClick={onDoubleClick}
        />
    </div>
);

/**
 *
 * @param {Palette} mandlebrotPalette
 * @param {Palette} palette
 * @param {function} mandlebrotPaletteChanged
 * @param {function} paletteChanged
 * @return {JSX.Element}
 */
const renderPalettesColumn = (mandlebrotPalette, palette, mandlebrotPaletteChanged, paletteChanged) => (
    <div className={"paletteColumn"}>
        <span>Set Colour</span>
        <PaletteEditor initial={mandlebrotPalette}
                       disableNewColours={true}
                       disableDeletingColours={true}
                       onChanged={mandlebrotPaletteChanged}/>
        <span>Palette</span>
        <PaletteEditor initial={palette}
                       onChanged={paletteChanged}/>
    </div>
);

export {
    renderCanvasColumn,
    renderHistoryColumn,
    renderInputsColumn,
    renderPalettesColumn
};