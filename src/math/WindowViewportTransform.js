import Point from "./Point";

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
     * @param {Point} viewportTL
     * @param {Point} viewportBR
     * @param {Point} windowTL
     * @param {Point} windowBR
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
     * @param {Point} windowLocation
     *
     * @return {Point}
     */
    transform = (windowLocation) => Point.at(
        this.#viewportTL.x + windowLocation.x * (this.#viewportBR.x - this.#viewportTL.x) / (this.#windowWidth),
        this.#viewportTL.y + windowLocation.y * (this.#viewportBR.y - this.#viewportTL.y) / (this.#windowHeight)
    )
}