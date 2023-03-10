import PropertyCollection from "./PropertyCollection";
import ArrayHelpers from "../misc/ArrayHelpers";

/**
 * @typedef PropertyCollectionGroupData
 * @property {PropertyCollectionData[]} propertyCollectionsGroup
 */
export default class PropertyCollectionGroup {

    /**
     * @type {PropertyCollection[]}
     */
    #propertyCollections

    /**
     *
     * @param {PropertyCollection[]} propertyCollections
     */
    constructor(propertyCollections) {
        this.#propertyCollections = propertyCollections;
    }

    /**
     * @param {string} identifier
     * @return {PropertyCollection}
     */
    getPropertyCollection(identifier) {
        return ArrayHelpers.first(
            this.#propertyCollections,
            (propertyCollection) => propertyCollection.identifier === identifier
        );
    }

    /**
     *
     * @return {boolean}
     */
    validate = () => {
        this.#propertyCollections.forEach(propertyCollection => propertyCollection.validate());
        return this.valid;
    }

    /**
     *
     * @return {boolean}
     */
    get valid() {
        return this.#propertyCollections.reduce(
            (validity, propertyCollection) => validity && propertyCollection.valid,
            true
        );
    }

    /**
     * @param {string} propertyCollectionIdentifier
     * @param {string} propertyIdentifier
     * @param {string} value
     */
    setValue(propertyCollectionIdentifier, propertyIdentifier, value) {
        this.getPropertyCollection(propertyCollectionIdentifier).getProperty(propertyIdentifier).value = value;
    }

    /**
     * @param {[[propertyCollectionIdentifier: string, propertyIdentifier: string, value: string]]} inputValueBindings
     */
    setValues(inputValueBindings = []) {
        inputValueBindings.forEach(([propertyCollectionIdentifier, propertyIdentifier, value]) =>
            this.setValue(propertyCollectionIdentifier, propertyIdentifier, value)
        )
    }

    /**
     * @param {PropertyCollectionData[]} propertyCollectionsData
     *
     * @return PropertyCollectionGroup
     */
    static hydrate = (propertyCollectionsData) =>
        new PropertyCollectionGroup(
            propertyCollectionsData.map(
                (propertyCollectionsData) => PropertyCollection.hydrate(propertyCollectionsData)
            )
        );

    /**
     * @return {PropertyCollectionGroupData}
     */
    get dehydrate() {
        return {
            propertyCollectionsGroup:
                this.#propertyCollections.map((propertyCollection) => propertyCollection.dehydrate)
        };
    }
}
