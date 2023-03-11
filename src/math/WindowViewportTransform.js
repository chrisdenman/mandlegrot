import Point from "./Point";

/**
 * Transforms points from a window coordinate space (with integer coordinates) to a viewport coordinate space.
 */
export default class WindowViewportTransform {

    /**
     * @type {Point}
     */
    #viewportTL;

    /**
     * @type {Point}
     */
    #viewportBR;

    /**
     * @type {Point}
     */
    #windowTL;

    /**
     * @type {Point}
     */
    #windowBR

    /**
     * @type {number}
     */
    #windowWidth;

    /**
     * @type {number}
     */
    #windowHeight;

    /**
     * Constructs a 2-dimensional transform that translates points between window and viewport coordinate spaces.
     *
     * @param {Point} viewportTL - the top-left coordinate of the viewport (in world coordinates)
     * @param {Point} viewportBR - the bottom-right coordinate of the viewport (in world coordinates)
     * @param {Point} windowTL - the top-left coordinate of the window (in viewport coordinates)
     * @param {Point} windowBR - the bottom-right coordinate of the window (in viewport coordinates)
     */
    constructor(viewportTL, viewportBR, windowTL, windowBR) {
        this.#viewportTL = viewportTL;
        this.#viewportBR = viewportBR;
        this.#windowTL = windowTL;
        this.#windowBR = windowBR;
        this.#windowWidth = this.#windowBR.x - this.#windowTL.x + 1;
        this.#windowHeight = this.#windowBR.y - this.#windowTL.y + 1;
    }

    /**
     * Calculate the viewport location for a given window location.
     *
     * @param {Point} windowLocation - the window location to transform
     *
     * @return {Point} the location in world coordinates that corresponds to the given window coordinate
     */
    transform = (windowLocation) => Point.at(
        this.#viewportTL.x + windowLocation.x * (this.#viewportBR.x - this.#viewportTL.x) / (this.#windowWidth),
        this.#viewportTL.y + windowLocation.y * (this.#viewportBR.y - this.#viewportTL.y) / (this.#windowHeight)
    )
}