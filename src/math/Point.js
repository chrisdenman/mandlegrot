/**
 * A simple 2-dimensional point class with no restrictions on the number types permitted.
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
     * Constructs a new object with the specified x and y coordinate values.
     *
     * @param {number} x - the x coordinate value
     * @param {number} y - the y coordinate value
     *
     * @return {Point} a new <code>Pont</code> object with the specified coordinates
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
     * Takes two points representing two diagonally-opposite corner points of a rectangular region and returns an array
     * containing the top-left corner point and bottom-right corner point, respectively.
     * <p>
     * Where more right = more x and more down is more y.
     *
     * @param {Point} a - a region's corner point
     * @param {Point} b - a region's corner point that is diagonally opposite to 'a'
     *
     * @return [Point, Point] the region's top-left and bottom-right point, respectively.
     */
    static sort = (a, b) =>
        [Point.at(Math.min(a.x, b.x), Math.min(a.y, b.y)), Point.at(Math.max(a.x, b.x), Math.max(a.y, b.y))];


    /**
     * @param {number} x
     * @param {number} y
     * @return {Point}
     */
    static at = (x = 0, y = 0) => new Point(x, y);

    /**
     *
     * @param {Point} addend
     * @return {Point}
     */
    add = (addend) => Point.at(this.#x + addend.x, this.#y + addend.y);

    /**
     *
     * @param {Point} subtrahend
     * @return {Point}
     */
    subtract = (subtrahend) => Point.at(this.#x - subtrahend.x, this.#y - subtrahend.y);

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

    /**
     * Returns a new array containing the x-coordinate followed by the y-coordinate.
     *
     * @return {[number, number]} an containing this point's components.
     */
    get components() {
        return [this.#x, this.#y];
    }
}

const ORIGIN = Point.at(0, 0);