import ArrayHelpers from "../../ArrayHelpers";

describe(
    "ArrayHelpers tests",
    () => {

        it(
            "That moving elements does not alter the original array.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [0, 1];
                ArrayHelpers.move(ORIGINAL, 1, 0);
                expect(EXPECTATION).toEqual(ORIGINAL);
            }
        );

        it(
            "That moving elements of an array of length 2 works as expected.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [1, 0];
                const RESULT = ArrayHelpers.move(ORIGINAL, 1, 0);
                expect(EXPECTATION).toEqual(RESULT);
            }
        );

        it(
            "That we get the same results if we swap the indices.",
            () => {
                const ORIGINAL = [0, 1];
                const EXPECTATION = [1, 0];
                const RESULT0 = ArrayHelpers.move(ORIGINAL, 1, 0);
                const RESULT1 = ArrayHelpers.move(ORIGINAL, 0, 1);
                expect(EXPECTATION).toEqual(RESULT0);
                expect(RESULT0).toEqual(RESULT1);
            }
        );
    }
);