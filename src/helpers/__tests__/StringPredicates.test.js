import StringPredicates from "../StringPredicates";

describe(
    "String Predicates Tests",
    () => {

        describe(
            "That isString correctly identifies values as either string values or not",
            () => {
                // noinspection JSCheckFunctionSignatures
                it.each`
                    value           | expectation                 
                    ${''}           | ${true}
                    ${' '}          | ${true}
                    ${'value'}      | ${true}
                    ${0}            | ${false}
                    ${1}            | ${false}
                    ${undefined}    | ${false}
                    ${null}         | ${false}
                    ${{}}           | ${false}
                `(
                    'returns $expectation for "$value"',
                    ({value, expectation}) => expect(StringPredicates.isString(value)).toBe(expectation)
                );
            }
        );

        describe(
            "That isTrimmedNotEmpty correctly identifies values as either string values or not",
            () => {
                // noinspection JSCheckFunctionSignatures
                it.each`
                    value           | expectation                 
                    ${''}           | ${false}
                    ${' '}          | ${false}
                    ${'\t'}         | ${false}
                    ${'a'}          | ${true}
                `(
                    'returns $expectation for "$value"',
                    ({value, expectation}) => expect(StringPredicates.isTrimmedNotEmpty(value)).toBe(expectation)
                );
            }
        );

        describe(
            "That isNumber correctly identifies values as number values or not",
            () => {
                // noinspection JSCheckFunctionSignatures
                it.each`
                    value           | expectation                 
                    ${''}           | ${false}
                    ${' '}          | ${false}
                    ${'value'}      | ${false}
                    ${'0d'}         | ${false}
                    ${'0'}          | ${true}
                    ${'-0'}         | ${true}
                    ${'1'}          | ${true}
                    ${'-1'}         | ${true}
                `(
                    'returns $expectation for "$value"',
                    ({value, expectation}) => expect(StringPredicates.isNumber(value)).toBe(expectation)
                );
            }
        );

        describe(
            "That isStrictlyLessIfNumbers returns false if both arguments are numbers as strings and the latter is greater or equal",
            () => {
                // noinspection JSCheckFunctionSignatures
                it.each`
                    lesser      | greater   | expectation
                    ${'-2'}     | ${'-1'}   | ${true}                 
                    ${'-1'}     | ${'0'}    | ${true}                 
                    ${'0'}      | ${'1'}    | ${true}
                    ${'1'}      | ${'2'}    | ${true}
                    ${''}       | ${'2'}    | ${true}
                    ${''}       | ${'2'}    | ${true}
                    ${''}       | ${''}     | ${true}
                    ${'p'}      | ${''}     | ${true}
                    ${''}       | ${'q'}    | ${true}
                    ${'p'}      | ${'q'}    | ${true}
                    ${'0'}      | ${'-1'}   | ${false}
                    ${'-1'}     | ${'-2'}   | ${false}
                    ${'1'}      | ${'0'}    | ${false}
                    
                `(
                    'returns $expectation for $lesser<$greater',
                    ({lesser, greater, expectation}) => expect(
                        StringPredicates.isStrictlyLessIfNumbers(lesser, greater)
                    ).toBe(expectation)
                );
            }
        );
    }
);
