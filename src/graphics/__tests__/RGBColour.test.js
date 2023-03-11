import RGBColour from "../RGBColour";

describe(
    "RGBColour Tests",
    () => {
        it(
            "Checking that the hex display for RGBColour.WHITE is #FFFFFF",
            () => {
                expect(RGBColour.WHITE.hexString).toBe("#FFFFFF");
            }
        );

        it(
            "Checking that the hex display for RGBColour.BLACK is #000000",
            () => {
                expect(RGBColour.BLACK.hexString).toBe("#000000");
            }
        );

        it(
            "Checking that the hex display for an arbitrary colour is correct",
            () => {
                const SUBJECT = new RGBColour(1, 99, 213);
                expect(SUBJECT.hexString).toBe("#0163D5");
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
    }
);