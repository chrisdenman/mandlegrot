import RGBColour from "./RGBColour";
import ArrayHelpers from "../misc/ArrayHelpers";
export default class Palette {

    /**
     * @type {RGBColour[]}
     */
    #colours

    /**
     * Moves a palette entry from index 'currentIndex' to index 'newIndex'.
     *
     * @param {number} currentIndex the index of the colour to move
     * @param {number} newIndex the desired index of the colour
     *
     * @return {Palette} a new palette updated by moving the colour from its old index to its new index
     */
    movePaletteEntry = (currentIndex, newIndex) =>
        new Palette(ArrayHelpers.move(this.#colours, currentIndex, newIndex));

    constructor(colours) {
        this.#colours = colours
    }

    /**
     * @param {number} [componentStart]
     * @param {number} [componentMax]
     * @param {number} [componentStep]
     * @return {Palette}
     */
    static create(
        componentStart = DEFAULT__COMPONENT_START,
        componentMax = DEFAULT__MAX_COMPONENT,
        componentStep = DEFAULT__COMPONENT_STEP
    ) {
        const reds = [];
        const blues = [];
        const greens = [];
        for (let component = componentStart; component <= componentMax; component += componentStep) {
            reds.push(new RGBColour(component, 0, 0));
            greens.push(new RGBColour(0, component, 0));
            blues.push(new RGBColour(0, 0, component));
        }
        return new Palette([...reds, ...greens, ...blues]);
    }

    /**
     * Retrieve the entry at index 'index'.
     *
     * @param {number} index
     *
     * @return {RGBColour}
     */
    getEntry = (index) => this.#colours[index];

    /**
     * How many entries are in this <code>Palette</code>?
     *
     * @return {number}
     */
    get length() {
        return this.#colours.length;
    }

    /**
     * Retrieve an array containing all the colours, in order.
     *
     * @return {RGBColour[]}
     */
   get getArray() {
        return this.#colours.slice();
   }

   static get divergentColour() {
       return DIVERGENT_COLOUR;
   }
}

const DEFAULT__COMPONENT_START = 5;
const DEFAULT__MAX_COMPONENT = 255;
const DEFAULT__COMPONENT_STEP = 10;

const DIVERGENT_COLOUR = RGBColour.BLACK;