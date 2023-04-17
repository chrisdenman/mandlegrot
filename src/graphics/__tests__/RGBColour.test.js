import RGBColour from "../RGBColour";

describe(
    "RGBColour Tests",
    () => {
        it(
            "Checking that the hex display for RGBColour.WHITE is #FFFFFF",
            () => {
                expect(RGBColour.WHITE.htmlColour).toBe("#FFFFFF");
            }
        );

        it(
            "Checking that the hex display for RGBColour.BLACK is #000000",
            () => {
                expect(RGBColour.BLACK.htmlColour).toBe("#000000");
            }
        );

        it(
            "Checking that the hex display for an arbitrary colour is correct",
            () => {
                const SUBJECT = new RGBColour(1, 99, 213);
                expect(SUBJECT.htmlColour).toBe("#0163D5");
            }
        );

        it(
            "Checking that we can construct objects without specifying values and the resultant object equals BLACK",
            () => {
                const SUBJECT = new RGBColour();
                expect(SUBJECT.equals(RGBColour.BLACK)).toBe(true);
            }
        );

        it(
            "That RGBColour.WHITE does not equals() RGBColour.WHITE",
            () => {
                expect(RGBColour.WHITE.equals(RGBColour.BLACK)).toBe(false);
            }
        );

        it(
            "That the correct components are returned when requested",
            () => {
                const RED = 3;
                const GREEN = 122;
                const BLUE = 67;
                expect(new RGBColour(RED, GREEN, BLUE).components).toEqual([RED, GREEN, BLUE]);
            }
        );

        it(
            "That the equals method is correctly utilised",
            () => {
                const RED = 3;
                const GREEN = 122;
                const BLUE = 67;
                expect(new RGBColour(RED, GREEN, BLUE)).toEqual(new RGBColour(RED, GREEN, BLUE));
            }
        );

        it.each`
                    red             | green             | blue      | expectation                 
                    ${-1}           | ${0}              | ${0}      | ${new RGBColour(0, 0, 0)}
                    ${256}          | ${0}              | ${0}      | ${new RGBColour(255, 0, 0)}
                    ${0}            | ${-1}             | ${0}      | ${new RGBColour(0, 0, 0)}
                    ${0}            | ${256}            | ${0}      | ${new RGBColour(0, 255, 0)}
                    ${0}            | ${0}              | ${-1}     | ${new RGBColour(0, 0, 0)}
                    ${0}            | ${0}              | ${256}    | ${new RGBColour(0, 0, 255)}
                    ${-1}           | ${-1}             | ${-1}     | ${new RGBColour(0, 0, 0)}
                    ${256.00001}    | ${300.128971}     | ${800.1}  | ${new RGBColour(255, 255, 255)}
                    `(
            "Constructing with red=$red, green=$green, blue=$blue is constrained to $expectation",
            ({red, green, blue, expectation}) =>
                expect(new RGBColour(red, green, blue).equals(expectation)).toBe(true)
        );

        it(
            "That random returns RGBColour instances",
            () => expect(RGBColour.random instanceof RGBColour).toBe(true)
        );

        it(
            "That toWASMArgument returns an instance with the format '0xFFBBGGRR'.",
            () => expect(new RGBColour(87, 243, 113).toWasmArgument).toBe("0xFF71F357")
        );
    }
);