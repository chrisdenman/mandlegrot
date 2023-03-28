export default class RGBColour {

    /**
     * @type {number}
     */
    #red;

    /**
     * @type {number}
     */
    #green;

    /**
     * @type {number}
     */
    #blue;

    /**
     * Construct a new <code>RGBColour</code> object with the specified: red, green & blue components.
     * <p>
     * Components should be integers in the range [0, 255].
     *
     * @param {number} [red=0] the red component
     * @param {number} [green=0] the green component
     * @param {number} [blue=0] the blue component
     */
    constructor(
        red = DEFAULT_COMPONENT_VALUE,
        green= DEFAULT_COMPONENT_VALUE,
        blue= DEFAULT_COMPONENT_VALUE) {
        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }

    /**
     * Retrieve the red component of this colour.
     *
     * @return {number} this colour's red component value.
     */
    get red() {
        return this.#red;
    }

    /**
     * Retrieve the green component of this colour.
     *
     * @return {number} this colour's green component value.
     */
    get green() {
        return this.#green;
    }

    /**
     * Retrieve the blue component of this colour.
     *
     * @return {number}  this colour's blue component value.
     */
    get blue() {
        return this.#blue;
    }

    /**
     * Retrieve the hexadecimal representation of this colour e.g. '#RRGGBB' where RR, GG & BB are the uppercase
     * hexadecimal representation of the red, greed & blue components respectively.
     *
     * @return {string} a textual representation of this colour in hexadecimal notation.
     */
    get hexString() {
        return `#${this.components.map(this.#componentByteToHex).join("")}`;
    }

    get toWasmArgument() {
        return `0xff${this.components.reverse().map(this.#componentByteToHex).join("")}`;
    }

    get integerValue() {
        return (this.#red << 24) + (this.#green << 16) + (this.#blue << 8) + (0xff);
    }

    /**
     * Retrieve an array containing the red, green & blue components of this colour in that order.
     *
     * @return {number[]} this colour's components in a new array
     */
    get components() {
        return [this.#red, this.#green, this.#blue];
    }

    /**
     * Converts a colour component to it's (2 digit) uppercase hexadecimal representation.
     *
     * @param {number} component the component value to convert
     * @return {string} the component's hexadecimal textual representation
     */
    #componentByteToHex = (component) => component
        .toString(HEX_BASE)
        .toUpperCase()
        .padStart(HEX_DIGITS_PER_BYTE, "0");

    /**
     * Retrieve an <code>RGBColour</code> that encodes black.
     *
     * @return {RGBColour} the colour black
     */
    static get BLACK() {
        return BLACK;
    }

    /**
     * Retrieve an <code>RGBColour</code> that encodes white.
     *
     * @return {RGBColour} the colour white
     */
    static get WHITE() {
        return WHITE;
    }

    /**
     * Returns <code>true</code> if 'that' is an <code>RGBColour</code> and it has the same: red, green & blue
     * components as this object, otherwise <code>false</code>.
     *
     * @param {RGBColour} that - the colour to compare with this object
     *
     * @return {boolean} <code>true</code> if this object and 'that' represent the same colour
     */
    equals = (that) => that instanceof RGBColour &&
        this.red === that.red &&
        this.green === that.green &&
        this.blue === that.blue;
}

const DEFAULT_COMPONENT_VALUE = 0;

const MIN_COMPONENT = 0;
const MAX_COMPONENT = 255;

const BLACK = new RGBColour(MIN_COMPONENT, MIN_COMPONENT, MIN_COMPONENT);
const WHITE = new RGBColour(MAX_COMPONENT, MAX_COMPONENT, MAX_COMPONENT);

const HEX_BASE = 16;

const HEX_DIGITS_PER_BYTE = 2;