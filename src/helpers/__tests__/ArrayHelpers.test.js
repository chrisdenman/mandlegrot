import ArrayHelper from "../ArrayHelper";

describe(
    "ArrayHelpers tests",
    () => {

        it(
            "That moving elements does not alter the original array.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [0, 1];
                ArrayHelper.move(ORIGINAL, 1, 0);
                expect(EXPECTATION).toEqual(ORIGINAL);
            }
        );

        it(
            "That moving elements of an array of length 2 works as expected.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [1, 0];
                const RESULT = ArrayHelper.move(ORIGINAL, 1, 0);
                expect(EXPECTATION).toEqual(RESULT);
            }
        );

        it(
            "That we get the same results if we swap the indices.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [1, 0];
                const RESULT0 = ArrayHelper.move(ORIGINAL, 1, 0);
                const RESULT1 = ArrayHelper.move(ORIGINAL, 0, 1);
                expect(EXPECTATION).toEqual(RESULT0);
                expect(RESULT0).toEqual(RESULT1);
            }
        );

        it(
            "That createInit creates arrays of the requested size.",
            () => {
                const length = 13;
                expect(ArrayHelper.createInit(length).length).toBe(length);
            }
        );

        it(
            "That createInit calls the callback initialisation function if supplied.",
            () => {
                expect(ArrayHelper.createInit(7, i => i)).toEqual([0, 1, 2, 3, 4, 5, 6]);
            }
        );

        it(
            "That removing elements by index works as expected.",
            () => {
                expect(ArrayHelper.remove([0], 0)).toEqual([]);
                expect(ArrayHelper.remove([0, 1], 0)).toEqual([1]);
                expect(ArrayHelper.remove([0, 1], 1)).toEqual([0]);
                expect(ArrayHelper.remove([0, 1, 2], 1)).toEqual([0, 2]);
            }
        );

        it.each`
                    subject         | expectation                 
                    ${[]}           | ${undefined}
                    ${[1]}          | ${1}
                    ${[2, 1]}       | ${2}`(
            "returns $expectation for \"first($subject)\"",
            ({subject, expectation}) => expect(ArrayHelper.first(subject)).toBe(expectation)
        );

        it(
            "That calling 'first' and supplying a predicate selects the first satisfying element.",
            () => {
                expect(ArrayHelper.first([0, 1, 2, 1000, 2000], it => it > 100)).toEqual(1000);
            }
        );

        it(
            "That calling 'first' and supplying an unsatisfied predicate returns 'undefined'.",
            () => {
                expect(ArrayHelper.first([2, 1000, 2000], it => it === -1)).toEqual(undefined);
            }
        );

        it(
            "That 'substitute' replaces predicate matching elements using the given replacer.",
            () => {
                expect(
                    ArrayHelper
                        .substitute(
                            [0, 1, 2, 3, 4],
                            it => it < 3,
                            it => it * 2
                        )
                ).toEqual([0, 2, 4, 3, 4]);
            }
        );

        it.each`
                    subject                         | expectation                 
                    ${[]}                           | ${[]}
                    ${[undefined]}                  | ${[]}
                    ${[undefined, undefined]}       | ${[]}
                    ${[1, undefined]}               | ${[1]}
                    ${[undefined, 2]}               | ${[2]}
                    ${[1]}                          | ${[1]}
                    ${[1, undefined, 2]}            | ${[1, 2]}
                    `(
            "That filterUndefined works",
            ({subject, expectation}) => expect(ArrayHelper.filterUndefined(subject)).toEqual(expectation)
        );
    }
);