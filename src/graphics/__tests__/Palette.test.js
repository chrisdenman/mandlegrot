import Palette from "../Palette";
import RGBColour from "../RGBColour";
import ArrayHelper from "../../helpers/ArrayHelper";

describe(
    "Palette Tests",
    () => {
        it(
            "Palettes with the same colours are equal",
            () => {
                const palette0 = new Palette([RGBColour.BLACK, RGBColour.WHITE]);
                const palette1 = new Palette([RGBColour.BLACK, RGBColour.WHITE]);
                expect(palette0.equals(palette1)).toBe(true);
            }
        );

        it(
            "Moving palette entries does not alter the existing palette",
            () => {
                const palette0 = new Palette([RGBColour.BLACK, RGBColour.WHITE]);
                const palette1 = new Palette([RGBColour.BLACK, RGBColour.WHITE]);
                palette0.moveColour(0, 1);

                expect(palette0.equals(palette1)).toBe(true);
            }
        );

        it(
            "That createRandom creates palettes with the correct number of colours",
            () => expect(Palette.createRandom(1).length).toBe(1)
        );

        it(
            "That clone creates a proper clone of a palette",
            () => {
                const length = 16;
                const original = Palette.createRandom(length);
                const clone = original.clone;
                expect(clone).not.toBe(original);
                ArrayHelper.createInit(length).forEach((_, index) => {
                    expect(original.getColour(index).equals(clone.getColour(index))).toBe(true);
                    expect(original.getColour(index)).not.toBe(clone.getColour(index));
                });

                expect(Palette.createRandom(1).length).toBe(1);
            }
        );

        it(
            "That the colours array used in construction cannot be altered after construction",
            () => {
                const colours = [RGBColour.BLACK, RGBColour.WHITE];
                const palette = new Palette(colours);
                colours[0] = colours[1];

                expect(palette.colours[0].equals(RGBColour.BLACK)).toBe(true);
                expect(palette.colours[0]).toEqual(RGBColour.BLACK);
                expect(palette.colours[1]).toEqual(RGBColour.WHITE);
            }
        );

        it.each`
                    colours                                             | index | resultantColours                 
                    ${[]}                                               | ${0}  | ${[]}
                    ${[RGBColour.BLACK]}                                | ${0}  | ${[]}
                    ${[RGBColour.BLACK, RGBColour.BLUE]}                | ${0}  | ${[RGBColour.BLUE]}
                    ${[RGBColour.BLACK, RGBColour.BLUE]}                | ${1}  | ${[RGBColour.BLACK]}
                    ${[RGBColour.BLACK, RGBColour.RED, RGBColour.BLUE]} | ${1}  | ${[RGBColour.BLACK, RGBColour.BLUE]}
                    `(
            "Testing the removal of palette entries",
            ({colours, index, resultantColours}) =>
                expect(new Palette(colours).removeColour(index).equals(new Palette(resultantColours))).toBe(true)
        );

        it(
            "That setColour returns a different palette",
            () => {
                const original = new Palette([RGBColour.BLACK]);
                expect(original.setColour(0, RGBColour.BLUE) !== original).toBe(true);
            }
        );

        it.each`
                    colours                                             | index | newColour             | resultantColours                 
                    ${[]}                                               | ${0}  | ${RGBColour.WHITE}    | ${[RGBColour.WHITE]}
                    ${[RGBColour.BLACK]}                                | ${0}  | ${RGBColour.WHITE}    | ${[RGBColour.WHITE]}
                    ${[RGBColour.BLACK, RGBColour.BLUE]}                | ${0}  | ${RGBColour.WHITE}    | ${[RGBColour.WHITE, RGBColour.BLUE]}
                    ${[RGBColour.BLACK, RGBColour.BLUE]}                | ${1}  | ${RGBColour.GREEN}    | ${[RGBColour.BLACK, RGBColour.GREEN]}
                    ${[RGBColour.BLACK, RGBColour.BLUE]}                | ${2}  | ${RGBColour.WHITE}    | ${[RGBColour.BLACK, RGBColour.BLUE, RGBColour.WHITE]}
                `(
            "That setColour correctly sets an entry",
            ({colours, index, newColour, resultantColours}) =>
                expect(new Palette(colours).setColour(index, newColour).equals(new Palette(resultantColours))).toBe(true)
        );

    }
);