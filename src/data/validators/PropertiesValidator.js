import {VALIDATORS} from "./PropertyValidators";

/**
 * @typedef PropertiesValidatorData
 * @property {string[]} propertyIdentifiers
 * @property {string} validatorIdentifier
 */
export default class PropertiesValidator {

    /**
     * @type string[]
     */
    #propertyIdentifiers

    /**
     * @type Validator
     */
    #validator

    /**
     * @param {string[]} propertyIdentifiers
     * @param {Validator} validator
     *
     * @return PropertiesValidator
     */
    constructor(propertyIdentifiers, validator) {
        this.#propertyIdentifiers = propertyIdentifiers;
        this.#validator = validator;
    }

    /**
     * @type string[]
     */
    get propertyIdentifiers() {
        return this.#propertyIdentifiers;
    }

    /**
     * @type Validator
     */
    get validator() {
        return this.#validator;
    }

    /**
     * @param {PropertiesValidatorData} propertiesValidatorData
     * @return {PropertiesValidator}
     */
    static hydrate = (propertiesValidatorData) => new PropertiesValidator(
        propertiesValidatorData.propertyIdentifiers.slice(),
        VALIDATORS[propertiesValidatorData.validatorIdentifier]
    );

    /**
     * @return {PropertiesValidatorData}
     */
    get dehydrate() {
        return {
            propertyIdentifiers: this.#propertyIdentifiers.slice(),
            validatorIdentifier: this.#validator.identifier
        };
    }
}