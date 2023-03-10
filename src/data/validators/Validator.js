import {VALIDATORS} from "./PropertyValidators";

/**
 * @typedef ValidatorData
 * @property {string} identifier
 */
export default class Validator {

    /**
     * @type {string}
     */
    #identifier

    /**
     * @type {function(*): boolean}
     */
    #predicate

    /**
     * @type {TextTemplate}
     */
    #failureMessageTemplate

    /**
     * @param {string} identifier - a unique identifier for this validator
     * @param {function(*): boolean} predicate - a function that returns <code>true</code> when invoked with valid
     * inputs and <code>false</code> otherwise
     * @param {TextTemplate} failureMessageTemplate
     *
     * @return {Validator}
     */
    constructor(identifier, predicate, failureMessageTemplate) {
        this.#identifier = identifier;
        this.#predicate = predicate;
        this.#failureMessageTemplate = failureMessageTemplate;
    }

    /**
     * @return {string}
     */
    get identifier() {
        return this.#identifier;
    }

    /**
     * @type {function(*): boolean}
     */
    get predicate() {
        return this.#predicate;
    }

    /**
     * @type {TextTemplate}
     */
    get failureMessageTemplate() {
        return this.#failureMessageTemplate;
    }

    /**
     * @param {string} validatorIdentifier
     *
     * @return Validator
     */
    static hydrate = (validatorIdentifier) => VALIDATORS[validatorIdentifier];

    /**
     * @return {ValidatorData}
     */
    get dehydrate() {
        return {
            identifier: this.#identifier
        };
    }
}