/**
 * @typedef BinderData
 * @property {string} identifier
 */

export default class Binder {

    /**
     * @type {string}
     */
    #identifier

    /**
     * @type {function(string) : any}
     */
    #f

    /**
     *
     * @param {string} identifier
     * @param {function(string) : any} f
     */
    constructor(identifier, f) {
        this.#identifier = identifier;
        this.#f = f;
    }

    bind = (value) => this.#f(value);

    /**
     * @param {string} binderIdentifier
     * @param {*} registry
     *
     * @return {Binder}
     */
    static hydrate = (binderIdentifier, registry) => registry[binderIdentifier];

    /**
     * @return {BinderData}
     */
    get dehydrate() {
        return {
            identifier: this.#identifier
        };
    }
}