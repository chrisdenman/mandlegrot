/**
 * @typedef ValidatorData
 * @property {string} identifier
 */
export default class Validator {

    /**
     * @type {function(*): boolean}
     */
    #predicate

    /**
     * @type {TextTemplate}
     */
    #failureMessageTemplate

    /**
     * @param {function(*): boolean} predicate - a function that returns <code>true</code> when invoked with valid
     * inputs and <code>false</code> otherwise
     * @param {TextTemplate} failureMessageTemplate
     *
     * @return {Validator}
     */
    constructor(predicate, failureMessageTemplate) {
        this.#predicate = predicate;
        this.#failureMessageTemplate = failureMessageTemplate;
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
}