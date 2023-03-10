import Point from "../Point";
import LinearRectangularTransform from "../LinearRectangularTransform";

describe(
    "LinearRectangularTransform Tests",
    () => {
        it(
            "That we handle the start of 1x1 rectangular regions correctly",
            () => {
                const SUBJECT = new LinearRectangularTransform(1, 1);
                const RESULT = getNextLocation(SUBJECT, undefined);
                const EXPECTATION = Point.at(0, 0);
                expect(compare(EXPECTATION, RESULT)).toBe(true);
            }
        );

        it(
            "That we handle the end of 1x1 rectangular regions correctly",
            () => {
                const SUBJECT = new LinearRectangularTransform(1, 1);
                const RESULT = getNextLocation(SUBJECT, Point.at(0, 0));
                const EXPECTATION = undefined;
                expect(RESULT).toBe(EXPECTATION);
            }
        );

        describe(
            "That we handle 2x2 regions correctly",
            () => {
                const SUBJECT = new LinearRectangularTransform(2, 2);
                // noinspection JSCheckFunctionSignatures
                it.each`
                    lastLocation            | expectation
                    ${undefined}            | ${Point.ORIGIN}
                    ${Point.ORIGIN}         | ${Point.at(1,0)}
                    ${Point.at(1,0)}  | ${Point.at(0,1)}
                    ${Point.at(0,1)}  | ${Point.at(1,1)}
                    ${Point.at(1,1)}  | ${undefined}
                    
                `(
                    'returns the next location providing $lastLocation is $expectation',
                    ({lastLocation, expectation}) => expect(
                        compare(SUBJECT.nextLocation(lastLocation), expectation)
                    ).toBe(true)
                );
            }
        );
    }
);

/**
 * @param {Point} expectation
 * @param {Point} result
 * @return {boolean}
 */
const compare = (expectation, result) =>
    (expectation === undefined && result === undefined) || expectation.equals(result);


/**
 * @param {LinearRectangularTransform} subject
 * @param {Point} lastLocation
 *
 * @return {Point|undefined}
 */
const getNextLocation = (subject, lastLocation) => subject.nextLocation(lastLocation);
