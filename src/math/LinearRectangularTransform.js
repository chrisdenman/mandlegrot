import Point from "./Point";

/**
 * Represents a transform from a 1-dimensional data structure to a 2-dimensional data structure.
 * <p>
 * Useful e.g. transforming offset coordinates into an array into an on-screen region with a defined width and height.
 */
export default class LinearRectangularTransform {

    /**
     * @type {number}
     */
    #width

    /**
     * @type {number}
     */
    #height

    /**
     * Class constructor specifying the width and height of the 2-dimensional data structure.
     *
     * @param {number} width - the width of our 2-dimensional data structure
     * @param height height - the height of our 2-dimensional data structure
     */
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
    }

    /**
     * Transform an offset from the 1-dimensional data structure into a 2-dimensional offset.
     * <P>
     * Note that no checks are done with this method to ensure that the given location returned is in the bounds of the
     * given 'width' and 'height' properties.
     *
     * @param offset {number} the offset into our 1-dimensional data structure
     *
     * @return {Point} the 2-dimensional location
     */
    forward = (offset) => Point.at(offset % this.#width, Math.trunc(offset / this.#height));

    /**
     * Transform a 2-dimensional location into an offset into a 1-dimensional data structure.
     * <P>
     * Note that no checks are performed here to ensure that the given point is outside the region defined by the bounds
     * passed in the constructor.
     *
     * @param {Point} location - the location of a point within our 2-dimensional region
     *
     * @return {number} an offset into the 1-dimensional data structure
     */
    inverse = (location) => location.x + location.y * this.#width;

    /**
     * @param {Point|undefined} lastLocation
     *
     * @return {Point|undefined}
     */
    nextLocation(lastLocation) {
        const IS_START = lastLocation === undefined;
        const LAST_X = lastLocation?.x;
        const LAST_Y = lastLocation?.y;
        const NEXT_X = IS_START ? 0 : (LAST_X + 1) % this.#width;
        const IS_NEW_LINE = NEXT_X <= LAST_X;
        const NEXT_Y = IS_START ? 0 : IS_NEW_LINE ? (LAST_Y + 1) % this.#width : LAST_Y;
        const IS_FINISHED = IS_NEW_LINE && NEXT_Y <= LAST_Y;

        return IS_FINISHED ?
            undefined :
            Point.at(NEXT_X, NEXT_Y);
    }
}