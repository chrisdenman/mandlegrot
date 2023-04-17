import {and, not, compose, bind} from "./Combinators"

/**
 * Various <code>string</code> predicates used for validating input values.
 */
export default class StringPredicates {

    static #theTypeOf = (value) => typeof value;

    static #equals = (left, right) => left === right;

    static #trim = (value) => value.trim();

    static isString = compose(
        bind(StringPredicates.#equals, 'string'),
        StringPredicates.#theTypeOf
    );

    static isTrimmedNotEmpty = and(
        StringPredicates.isString,
        not(
            compose(
                bind(StringPredicates.#equals, ""),
                StringPredicates.#trim
            )
        )
    );

    static isNumber = and(
        StringPredicates.isString,
        StringPredicates.isTrimmedNotEmpty,
        isFinite
    );

    static isInteger = and(
        StringPredicates.isString,
        StringPredicates.isTrimmedNotEmpty,
        isFinite,
        compose(Number.isInteger, Number)
    );

    static gt = (lowerBound, value) => Number(value) > lowerBound;

    static isPositiveInteger = and(
        StringPredicates.isNumber,
        StringPredicates.isInteger,
        bind(StringPredicates.gt, 0)
    );

    static isPositiveNumberValue = and(
        StringPredicates.isNumber,
        bind(StringPredicates.gt, 0)
    );

    /**
     * Returns <code>true</code> if either argument is not a number in text form or, as numbers, 'lesser' is
     * less than 'greater', otherwise <code>false</code> results.
     *
     * @param {string} lesser
     * @param {string} greater
     *
     * @return {boolean}
     */
    static isStrictlyLessIfNumbers = (lesser, greater) =>
        !StringPredicates.isNumber(lesser) || !StringPredicates.isNumber(greater) || Number(lesser) < Number(greater)
}
