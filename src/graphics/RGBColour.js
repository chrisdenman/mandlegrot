import RangeHelper from "../helpers/RangeHelper";
import ArrayHelper from "../helpers/ArrayHelper";

const DEFAULT_COMPONENT_VALUE = 0;

const MIN_COMPONENT = 0;
const MAX_COMPONENT = 255;

const HEX_BASE = 16;

const HEX_DIGITS_PER_BYTE = 2;

export default class RGBColour {

    #constrainComponent = RangeHelper.closedConstrain.bind(undefined, MIN_COMPONENT, MAX_COMPONENT);

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
     * @type {number[]}
     */
    #components;

    /**
     * @type {string}
     */
    #htmlColour;

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
        green = DEFAULT_COMPONENT_VALUE,
        blue = DEFAULT_COMPONENT_VALUE
    ) {
        this.#red = this.#constrainComponent(red);
        this.#green = this.#constrainComponent(green);
        this.#blue = this.#constrainComponent(blue);
        this.#components = Object.freeze([this.#red, this.#green, this.#blue]);
        this.#htmlColour = `#${this.#components.map(this.#componentByteToHex).join("")}`;
    }

    /**
     * Returns a random colour component value.
     *
     * @returns {number}
     */
    static get #randomComponent() {
        return Math.floor(Math.random() * (MAX_COMPONENT + 1));
    }

    /**
     * Returns a randomly coloured <code>RGBColour</code>.
     *
     * @returns {RGBColour}
     */
    static get random() {
        return new RGBColour(this.#randomComponent, this.#randomComponent, this.#randomComponent);
    }

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
     * Retrieve an <code>RGBColour</code> that encodes red.
     *
     * @return {RGBColour} the colour red
     */
    static get RED() {
        return RED;
    }

    /**
     * Retrieve an <code>RGBColour</code> that encodes green.
     *
     * @return {RGBColour} the colour green
     */
    static get GREEN() {
        return GREEN;
    }

    /**
     * Retrieve an <code>RGBColour</code> that encodes blue.
     *
     * @return {RGBColour} the colour blue
     */
    static get BLUE() {
        return BLUE;
    }

    /**
     * The minimum component value permitted.
     *
     * @returns {number}
     */
    static get MIN_COMPONENT() {
        return MIN_COMPONENT;
    }

    /**
     * The maximum component value permitted.
     *
     * @returns {number}
     */
    static get MAX_COMPONENT() {
        return MAX_COMPONENT;
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
     * Clones this object.
     *
     * @returns {RGBColour}
     */
    get clone() {
        return new RGBColour(this.#red, this.#green, this.#blue);
    }

    /**
     * Retrieve the hexadecimal representation of this colour e.g. '#RRGGBB' where RR, GG & BB are the uppercase
     * hexadecimal representation of the red, greed & blue components respectively.
     *
     * @return {string} a textual representation of this colour in hexadecimal notation.
     */
    get htmlColour() {
        return this.#htmlColour;
    }

    get toWasmArgument() {
        return `0xFF${ArrayHelper.reverse(this.#components).map(this.#componentByteToHex).join("")}`;
    }

    /**
     * Retrieve an array containing the red, green & blue components of this colour in that order.
     *
     * @return {number[]} this colour's components in a new array
     */
    get components() {
        return this.#components;
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
     * Returns <code>true</code> if 'that' is an <code>RGBColour</code> and it has the same: red, green & blue
     * components as this object, otherwise <code>false</code>.
     *
     * @param {RGBColour} that - the colour to compare with this object
     *
     * @return {boolean} <code>true</code> if this object and 'that' represent the same colour
     */
    equals(that) {
        return that instanceof RGBColour &&
            this.red === that.red &&
            this.green === that.green &&
            this.blue === that.blue;
    };
}

const BLACK = new RGBColour(MIN_COMPONENT, MIN_COMPONENT, MIN_COMPONENT);
const WHITE = new RGBColour(MAX_COMPONENT, MAX_COMPONENT, MAX_COMPONENT);
const RED = new RGBColour(MAX_COMPONENT, MIN_COMPONENT, MIN_COMPONENT);
const GREEN = new RGBColour(MIN_COMPONENT, MAX_COMPONENT, MIN_COMPONENT);
const BLUE = new RGBColour(MIN_COMPONENT, MIN_COMPONENT, MAX_COMPONENT);
