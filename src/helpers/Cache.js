/**
 * An eternal key/value store that uses a standard <code>Map</code> to store entries.
 * <P>
 * Keys or values stored will prevent garbage collection of them.
 */
export default class Cache {

    /**
     * @type {Map}
     */
    #cache;

    /**
     * Construct a new cache possibly supplying some initial entries.
     * <P>
     * Any types are allowed for keys.
     * <P>
     * A shallow copy of 'entries' is made before utilisation if supplied.
     *
     * @param {array} [entries] - an optional array of arrays of key/value entries.
     *
     * @return {Cache} a new <code>Cache</code> either empty, or populated with the given values supplied.
     */
    constructor(entries) {
        this.#cache = new Map(entries?.slice() ?? []);
    }

    /**
     * Associate a value with a key.
     *
     * @param {*} key - the identity of the entry
     * @param {*} value - the associated value
     *
     * @return {*} the 'value' argument passed in
     */
    set = (key, value) => this.#cache.set(key, value).get(key);

    /**
     * Does the cache contain a value associated with the supplied key?
     *
     * @param {*} key
     *
     * @return <code>true</code> if 'key' is known, <code>false</code> otherwise
     */
    has = (key) => this.#cache.has(key);

    /**
     * Obtain the value associated with a given key.
     *
     * @param {*} key
     *
     * @return {*} the previously stored value else <code>undefined</code>
     */
    get = (key) => this.#cache.get(key);
}