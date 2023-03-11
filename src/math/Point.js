/**
 * A simple 2-dimensional pont class with no restrictions on the number types permitted.
 */
export default class Point {

    /**
     * @type {number}
     */
    #x

    /**
     * @type {number}
     */
    #y

    /**
     * @param {number} x
     * @param {number} y
     *
     * @return {Point}
     */
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    /**
     * Returns the point at x=0, y=0.
     *
     * @return {Point} - the point (0,0)
     */
    static get ORIGIN() {
        return ORIGIN;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Point}
     */
    static at = (x = 0, y = 0) => new Point(x, y);

    /**
     * The x coordinate of this <code>Point</code>.
     *
     * @return {number}
     */
    get x() {
        return this.#x;
    }

    /**
     * The y coordinate of this <code>Point</code>.
     *
     * @return {number}
     */
    get y() {
        return this.#y;
    }

    /**
     * @param {Point} other
     * @return {boolean}
     */
    equals(other) {
        return other instanceof Point &&
            other.x === this.x &&
            other.y === this.y;
    }

    toString() {
        return `Point(${this.#x}, ${this.#y})`
    }
}

const ORIGIN = Point.at(0, 0);