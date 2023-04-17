import {withIt} from "../helpers/ScopeHelper";
import {cachedCanvasRef} from "../AppCache";
import Point from "../math/Point";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} lineWidth
 * @param {string} strokeStyle
 * @param {Point} centrePoint
 */
const drawCrosshairs = (ctx, canvasWidth, canvasHeight, {lineWidth, strokeStyle}, centrePoint) => {
    ctx.beginPath();

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    ctx.beginPath();
    ctx.moveTo(0, centrePoint.y);
    ctx.lineTo(canvasWidth, centrePoint.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centrePoint.x, 0);
    ctx.lineTo(centrePoint.x, canvasHeight);

    ctx.stroke();
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} fillStyle
 * @param {number} lineWidth
 * @param {string} edgeColour
 * @param {string} font
 * @param {string} dimensionsBackground
 * @param {string} dimensionsForeground
 * @param {Point} windowDragStartLocation
 * @param {Point} windowCursorLocation
 */
const drawDragSelection = (
    ctx,
    {
        fillStyle,
        lineWidth,
        edgeColour,
        font,
        dimensionsBackground,
        dimensionsForeground
    },
    windowDragStartLocation,
    windowCursorLocation) => {

    const deltas = windowCursorLocation.subtract(windowDragStartLocation);
    if (deltas.x !== 0 || deltas.y !== 0) {
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.fillRect(windowDragStartLocation.x, windowDragStartLocation.y, deltas.x, deltas.y)

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = edgeColour;
        ctx.rect(windowDragStartLocation.x, windowDragStartLocation.y, deltas.x, deltas.y)
        ctx.stroke();

        ctx.font = font;
        ctx.textBaseline = 'top';

        const text = `(${Math.abs(deltas.x)}, ${Math.abs(deltas.y)})`;
        const width = ctx.measureText(text).width;
        const x = windowCursorLocation.x + 2;
        const y = windowCursorLocation.y;
        const height = parseInt(ctx.font, 10);

        ctx.fillStyle = dimensionsBackground;
        ctx.fillRect(x, y - height, width + 2, height + 2);

        ctx.fillStyle = dimensionsForeground;
        ctx.fillText(text, x + 1, y + 2 - height);
    }
};

/**
 * What's the position of the cursor within a canvas's bounds?
 *
 * @param {number} clientX - a mouse event's clientX value
 * @param {number} clientY - a mouse event's clientY value
 *
 * @return {Point} the cursor's point within the canvas
 */
const canvasCursorLocation = ({clientX, clientY}) =>
    withIt(cachedCanvasRef().current.getBoundingClientRect(), rect =>
        Point.at(
            Math.min(clientX - Math.floor(rect.left), rect.width - 1),
            Math.min(clientY - Math.floor(rect.top), rect.height - 1)
        )
    );

export {
    canvasCursorLocation,
    drawCrosshairs,
    drawDragSelection
}