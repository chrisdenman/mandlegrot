import RGBColour from "./RGBColour";
import ArrayHelper from "../helpers/ArrayHelper";

export default class Palette {

    /**
     * @type {number}
     */
    #numberOfColours;

    /**
     * @type {RGBColour[]}
     */
    constructor(colours) {
        this.#colours = Object.freeze(colours.map(rgbColour => rgbColour.clone));
        this.#numberOfColours = colours.length;
    }

    /**
     * @type {RGBColour[]}
     */
    #colours;

    /**
     * Retrieve an array containing all the colours, in order.
     *
     * @return {RGBColour[]}
     */
    get colours() {
        return this.#colours;
    }

    /**
     * Creates a clone of this <code>Palette</code>.
     *
     * @return {Palette}
     */
    get clone() {
        return new Palette(this.#cloneColours);
    }

    /**
     * @returns {RGBColour[]}
     */
    get #cloneColours() {
        return this.#colours.map(rgbColour => rgbColour.clone);
    }

    /**
     * How many entries are in this <code>Palette</code>?
     *
     * @return {number}
     */
    get length() {
        return this.#numberOfColours;
    }

    /**
     * A palette containing the specified number of random colours.
     *
     * @param {number} numColours
     * @returns {Palette}
     */
    static createRandom = numColours =>
        new Palette(ArrayHelper.createInit(numColours, () => RGBColour.random));

    /**
     * Moves a palette entry from index 'currentIndex' to index 'newIndex'.
     *
     * @param {number} currentIndex the index of the colour to move
     * @param {number} newIndex the desired index of the colour
     *
     * @return {Palette} a new palette updated by moving the colour from its old index to its new index
     */
    moveColour = (currentIndex, newIndex) =>
        new Palette(ArrayHelper.move(this.#colours, currentIndex, newIndex));

    /**
     *
     * @param {number} index
     * @param {RGBColour} colour
     */
    setColour = (index, colour) => {
        const newColours = this.#colours.slice();
        newColours[index] = colour;
        return new Palette(newColours);
    };

    /**
     * Returns a new palette without the colour at the specified index.
     *
     * @param {number} index - the index of the colour to remove
     *
     * @returns {Palette} a new palette without the colour specified
     */
    removeColour = index => new Palette(ArrayHelper.remove(this.#colours, index));

    /**
     * Retrieve the entry at index 'index'.
     *
     * @param {number} index
     *
     * @return {RGBColour}
     */
    getColour = (index) => this.#colours[index];

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Palette} other
     * @return boolean
     */
    equals = (other) =>
        other instanceof Palette &&
        other.colours.length === this.#colours.length &&
        other.colours.reduce(
            (acc, curr, index) =>
                acc && curr.equals(this.#colours[[index]]),
            true
        );
}
