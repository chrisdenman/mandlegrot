import PropertyInputLabelText from "./PropertyInputLabelText";
import PropertiesValidator from "./validators/PropertiesValidator";
import Property from "./Property";
import ArrayHelpers from "../misc/ArrayHelpers";

/**
 * @typedef PropertyCollectionData
 * @property {string} identifier
 * @property {PropertyData[]} properties
 * @property {PropertiesValidatorData[]} propertiesValidators
 * @property {String[]} errors
 */

export default class PropertyCollection {

    /**
     * @type String
     */
    #identifier

    /**
     * @type Property[]
     */
    #properties

    /**
     * @type PropertiesValidator[]
     */
    #propertiesValidators

    /**
     * @type string[]
     */
    #errors


    /**
     * @param {string} identifier
     * @param {Property[]} properties
     * @param {PropertiesValidator[]} propertiesValidators
     * @param {String[]} errors
     *
     * @return PropertyCollection
     */
    constructor(
        identifier,
        properties,
        propertiesValidators = [],
        errors = []
    ) {
        this.#identifier = identifier;
        this.#properties = properties;
        this.#propertiesValidators = propertiesValidators;
        this.#errors = errors;
    }

    get identifier() {
        return this.#identifier;
    }

    /**
     * @param {string} identifier
     * @return {Property}
     */
    getProperty(identifier) {
        return ArrayHelpers.first(
            this.#properties,
            (property) => property.identifier === identifier
        )
    }


    /**
     * @return {boolean}
     */
    get valid() {
        return this.#properties.reduce((isValid, property) => isValid && property.valid, true) &&
            this.#errors.length === 0;
    }

    validate() {
        const PROPERTIES_VALID =
            this.#properties.reduce((acc, property) => acc && property.validate(), true);

        if (PROPERTIES_VALID) {
            this.#errors = this.#propertiesValidators.reduce(
                (acc, propertiesValidator) => {

                   const maybeError = PropertyCollection.validateProperties(
                        propertiesValidator.propertyIdentifiers,
                        propertiesValidator.validator.predicate,
                        propertiesValidator.validator.failureMessageTemplate,
                        ...(propertiesValidator.propertyIdentifiers.map(inputIdentifier =>
                            this.getProperty(inputIdentifier).value
                        ))
                    )
                    return (maybeError !== undefined) ?
                        [...acc, {propertyIdentifiers: propertiesValidator.propertyIdentifiers, error: maybeError}] :
                        acc;
                }, []);
        }
    }

    /**
     *
     * @param {string[]} propertyIdentifiers
     * @param {function(...string): boolean} predicate
     * @param {TextTemplate} errorTemplate
     * @param {...string} values
     * @return {undefined|string}
     */
    static validateProperties = (propertyIdentifiers, predicate, errorTemplate, ...values) =>
        (predicate.call(undefined, ...values) === true) ?
            undefined :
            errorTemplate.interpolate(
                new Map(
                    propertyIdentifiers.map((propertyIdentifier, index) =>
                        [`${index}`, PropertyInputLabelText.from(propertyIdentifier)]
                    )
                )
            );

    /**
     * @param {PropertyCollectionData} propertyCollectionData
     *
     * @return PropertyCollection
     */
    static hydrate = (propertyCollectionData) =>
        new PropertyCollection(
            propertyCollectionData.identifier,
            propertyCollectionData.properties.map((propertyData) => Property.hydrate(propertyData)),
            propertyCollectionData.propertiesValidators?.map(
                (propertiesValidatorData) => PropertiesValidator.hydrate(propertiesValidatorData)
            ),
            propertyCollectionData.errors?.slice()
        )

    /**
     * @return {PropertyCollectionData}
     */
    get dehydrate() {
        return {
            identifier: this.#identifier,
            properties: this.#properties.map((property) => property.dehydrate),
            propertiesValidators: this.#propertiesValidators.map(
                (propertiesValidator) => propertiesValidator.dehydrate
            ),
            errors: this.#errors.slice(),
        };
    }
}