/**
 * @callback IndexCallback
 * @param {number} index
 * @return *
 */

/**
 * Miscellaneous array helper functions.
 */
export default class ArrayHelper {

    /**
     * @param {number} length
     * @param {IndexCallback} f
     * @returns {*[]}
     */
    static createInit = (
        length,
        f = () => {
        }
    ) => Array.from({length: length}, (_, i) => f(i));

    /**
     * Returns a reversed copy of an array.
     *
     * @param {*[]} array - the array to reverse
     *
     * @returns {*[]} a reversed copy of the given array
     */
    static reverse = (array) =>
        array.map((_, index, array) => array[array.length - 1 - index]);

    /**
     * Returns the first element of an array that satisfied a predicate if supplied, else the first element of an array.
     *
     * @param {*[]} array - an array of any type that the given predicate accepts
     * @param {function(*): boolean} [predicate=undefined] - an optional predicate
     * @return {*} the first element of 'array' that satisfies 'predicate', else the first element of the array
     */
    static first = (array, predicate = undefined) =>
        predicate === undefined ? array[0] : array.filter(predicate)[0];

    /**
     * Returns a copy of 'array' with all <code>undefined</code> values removed.
     *
     * @param {*[]} array the array to filter
     *
     * @return {*[]} a new array with no <code>undefined</code> values
     */
    static filterUndefined = (array) => array.filter((it) => it !== undefined);

    /**
     * Returns a copy of 'array' but with the element that was at index 'currentIndex' now at position 'newIndex'.
     *
     * @param {array} array the array to modify
     * @param {number} currentIndex the index of the element to move to a new index
     * @param {number} newIndex the desired index of the element
     *
     * @return {array} a copy of 'array' but with an element moved
     */
    static move = (array, currentIndex, newIndex) => {
        const COPY = array.slice();
        const ELEMENT = COPY.splice(currentIndex, 1)[0];
        COPY.splice(newIndex, 0, ELEMENT);

        return COPY;
    };

    static remove = (array, index) => array.filter((_, i) => i !== index);

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a new array with elements that satisfied 'predicate' substituted by calling the function 'replacer'.
     *
     * @template T
     *
     * @param {T[]} array
     * @param {function(T, T[]): boolean} predicate
     * @param {function(T, T[]): T} replacer
     *
     * @return {T[]} 'array' with elements replaced using 'replacer' for which 'predicate' returned <code>true</code>.
     */
    static substitute = (array, predicate, replacer) =>
        array.map((element) => predicate(element, array) ? replacer(element, array) : element);
}