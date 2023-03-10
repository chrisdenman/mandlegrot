import Binder from "./Binder";
import PropertyCollection from "./PropertyCollection";
import ArrayHelpers from "../misc/ArrayHelpers";
import Validator from "./validators/Validator";
import {BINDERS} from "./Binders";

/**
 * @typedef PropertyData
 * @property {number} index - the order in which to show this input within the collection
 * @property {string} identifier - the identifier used to refer to this property (ideally unique amongst all input
 * collections, but at least unique within its own collection)
 * @property {string} htmlType - the HTML's input tag type
 * @property {string} label - the HTML label value to show with this input
 * @property {string} value - the property's initial value
 * @property {string} binderIdentifier - a function called with the input's value to mutate it for the application's use
 * @property {string[]} validatorIdentifiers - a collection of conditions that determine the input's validity
 * @property {string[]} errors - a collection of conditions that determine the input's validity
 */
export default class Property {

    /**
     * @type {number}
     */
    #index

    /**
     * @type {string}
     */
    #identifier

    /**
     * @type {string}
     */
    #htmlType

    /**
     * @type {string}
     */
    #label

    /**
     * @type {string}
     */
    #value

    /**
     * @type {string[]}
     */
    #errors

    /**
     * @type {Binder}
     */
    #binder

    /**
     * @type {Validator[]}
     */
    #validators

    /**
     * @param {number} index - the order in which to show this input within the collection
     * @param {string} identifier - the identifier used to refer to this input (ideally unique amongst all input
     * collections, but at least unique within its own collection)
     * @param {string} htmlType - the HTML's input tag type
     * @param {string} label - the HTML label value to show with this input
     * @param {string} value - the input's initial value
     * @param {Binder} binder - a named function called with the input's value to mutate it for the application's use
     * @param {Validator[]} validators - a collection of conditions that determine the input's validity
     * @param {string[]} errors - a collection of conditions that determine the input's validity
     */
    constructor(
        index,
        identifier,
        htmlType,
        label,
        value,
        binder,
        validators = [],
        errors = []
    ) {
        this.#index = index;
        this.#identifier = identifier;
        this.#htmlType = htmlType;
        this.#label = label;
        this.#value = value;
        this.#binder = binder;
        this.#validators = validators;
        this.#errors = errors;
    }


    get index() {
        return this.#index;
    }

    get identifier() {
        return this.#identifier;
    }

    get htmlType() {
        return this.#htmlType;
    }

    get label() {
        return this.#label;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    get binder() {
        return this.#binder;
    }

    get validators() {
        return this.#validators;
    }

    get errors() {
        return this.#errors;
    }

    get valid() {
        return this.#errors.length === 0;
    }

    get boundValue() {
        return this.#binder.bind(this.#value);
    }

    validate = () => {
        this.#errors = ArrayHelpers.filterUndefined(this.#validators
            .reduce(
                (acc, validator) => {
                    return acc.concat(
                        PropertyCollection.validateProperties(
                            [this.#identifier],
                            validator.predicate,
                            validator.failureMessageTemplate,
                            this.#value
                        )
                    );
                },
                []
            )
        );

        return this.valid;
    }


    /**
     * @param {PropertyData} propertyData
     *
     * @return Property
     */
    static hydrate = (propertyData) =>
        new Property(
            propertyData.index,
            propertyData.identifier,
            propertyData.htmlType,
            propertyData.label,
            propertyData.value,
            Binder.hydrate(propertyData.binderIdentifier, BINDERS),
            propertyData.validatorIdentifiers.map(
                (validatorIdentifier) => Validator.hydrate(validatorIdentifier)
            ),
            propertyData.errors
        )

    /**
     * @return {PropertyData}
     */
    get dehydrate() {
        return {
            index: this.#index,
            identifier: this.#identifier,
            htmlType: this.#htmlType,
            label: this.#label,
            value: this.#value,
            binderIdentifier: this.#binder.dehydrate.identifier,
            validatorIdentifiers: this.#validators.map((validator) => validator.dehydrate.identifier),
            errors: this.#errors.slice(),
        };
    }
}
