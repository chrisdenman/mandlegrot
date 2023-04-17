import RangeHelper from "../RangeHelper";

describe(
    "RangeHelper tests",
    () => {
        it(
            "That closed constrain throws an error if the lower bound is greater than the upper bound.",
            () => {
                const lowerBound = 0;
                const upperBound = lowerBound - .00000001;
                expect(() => RangeHelper.closedConstrain(lowerBound, upperBound, 0))
                    .toThrowError(`The lower bound (${lowerBound}) must not exceed the upper bound (${upperBound}).`);
            }
        );

        it.each`
lower           | upper         | value     | expectation                 
${0}            | ${0}          | ${0}      | ${0}
${0}            | ${0}          | ${1}      | ${0}
${0}            | ${0}          | ${-1}     | ${0}
${-1}           | ${-1}         | ${-1}     | ${-1}
${-1}           | ${-1}         | ${0}      | ${-1}
${-1}           | ${-1}         | ${-2}     | ${-1}
${-1}           | ${1}          | ${-2}     | ${-1}
${-1}           | ${1}          | ${2}      | ${1}
${-1}           | ${1}          | ${0}      | ${0}
${-1}           | ${0}          | ${-1.1}   | ${-1}
${-1}           | ${0}          | ${0.1}    | ${0}
${-1}           | ${0}          | ${-0.1}   | ${-0.1}
`(
            "returns $expectation for \"closedConstrain($lower, $upper, $value)\"",
            ({lower, upper, value, expectation}) =>
                expect(RangeHelper.closedConstrain(lower, upper, value)).toBe(expectation)
        );

    }
);