import PropertyIdentifiers from "./PropertyIdentifiers";

export default class PropertyInputLabelText {

    /**
     * @param {string} propertyIdentifier
     * @return {string}
     */
    static from = (propertyIdentifier) => PROPERTY_IDENTIFIER__TO__LABEL_TEXT.get(propertyIdentifier);
}

const PROPERTY_IDENTIFIER__TO__LABEL_TEXT = new Map([
    [PropertyIdentifiers.worldMinX, "Min X"],
    [PropertyIdentifiers.worldMaxX, "Max X"],
    [PropertyIdentifiers.worldMinY, "Min Y"],
    [PropertyIdentifiers.worldMaxY, "Max Y"],
    [PropertyIdentifiers.maxIterations, "Max iterations"],
    [PropertyIdentifiers.maxModulus, "Max modulus"],
    [PropertyIdentifiers.windowWidth, "Image width"],
    [PropertyIdentifiers.windowHeight, "Image height"],
    [PropertyIdentifiers.numWorkers, "Number of workers"]
]);