import RGBColour from "./RGBColour";
import Palette from "./Palette";

export default class ChannelSeparatedLinearPalette {

    /**
     * Creates a palette consisting of a sequence of reds then greens and blues.
     * <p>
     * For each of the red, green and blue component's entries, the values are formed by the sequence:
     * 'componentStart, componentStart + componentStep, ... , componentStart + n * ComponentStep', the last one being
     * the maximum value that is less than or equal to 'componentMax'.
     *
     * @param {number} componentStart - the starting value for each component
     * @param {number} componentMax - the maximal inclusive value for a component
     * @param {number} componentStep - the amount to increase each component value by
     *
     * @throws {Error} if the 'componentStep' value is <code>0</code>
     *
     * @return {Palette} - a new <code>Palette</code>
     */
    static create(
        componentStart = RGBColour.MIN_COMPONENT,
        componentMax = RGBColour.MAX_COMPONENT,
        componentStep = 1
    ) {
        if (componentStep === 0) {
            throw new Error("The componentStep may not be 0.");
        } else {
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
    }
}
