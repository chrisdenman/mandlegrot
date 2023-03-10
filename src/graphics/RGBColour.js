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
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     */
    constructor(red, green, blue) {
        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }

    /**
     * @return {number}
     */
    get red() {
        return this.#red;
    }

    /**
     * @return {number}
     */
    get green() {
        return this.#green;
    }

    /**
     * @return {number}
     */
    get blue() {
        return this.#blue;
    }

    /**
     * @return {string}
     */
    get hexString() {
        return `#${this.components.map(this.#componentByteToHex).join("")}`;
    }

    /**
     *
     * @return {number[]}
     */
    get components() {
        return [this.#red, this.#blue, this.#green];
    }

    /**
     * @param {number} component
     * @return {string}
     */
    #componentByteToHex = (component) => component
        .toString(HEX_BASE)
        .toUpperCase()
        .padStart(HEX_DIGITS_PER_BYTE, "0");

    /**
     * @return {RGBColour}
     */
    static get BLACK() {
        return BLACK;
    }

    static get WHITE() {
        return WHITE;
    }
}

const MIN_COMPONENT = 0;
const MAX_COMPONENT = 255;

const BLACK = new RGBColour(MIN_COMPONENT, MIN_COMPONENT, MIN_COMPONENT);
const WHITE = new RGBColour(MAX_COMPONENT, MAX_COMPONENT, MAX_COMPONENT);

const HEX_BASE = 16;

const HEX_DIGITS_PER_BYTE = 2;