import ChannelSeparatedLinearPalette from "../ChannelSeparatedLinearPalette";
import RGBColour from "../RGBColour";
import Palette from "../Palette";
import ArrayHelper from "../../helpers/ArrayHelper";

describe(
    "Channel Separated Linear Palette Tests",
    () => {
        it(
            "That the expected exception is thrown if we pass 0 for the componentStep value",
            () => {
                expect(() => ChannelSeparatedLinearPalette
                    .create(0, 255, 0)
                ).toThrow("The componentStep may not be 0.");
            }
        );

        it(
            "That the no-args constructor results in the expected palette",
            () => {
                expect(
                    ChannelSeparatedLinearPalette
                        .create()
                        .equals(
                            new Palette([
                                ...ArrayHelper.createInit(RGBColour.MAX_COMPONENT + 1, index =>
                                    new RGBColour(index, 0, 0)),
                                ...ArrayHelper.createInit(RGBColour.MAX_COMPONENT + 1, index =>
                                    new RGBColour(0, index, 0)),
                                ...ArrayHelper.createInit(RGBColour.MAX_COMPONENT + 1, index =>
                                    new RGBColour(0, 0, index))
                            ])
                        )
                ).toBe(true);
            }
        );

        it(
            "That palettes have the expected values",
            () => {
                expect(
                    ChannelSeparatedLinearPalette
                        .create(0, 255, 70)
                        .equals(new Palette([
                            new RGBColour(0, 0, 0),
                            new RGBColour(70, 0, 0),
                            new RGBColour(140, 0, 0),
                            new RGBColour(210, 0, 0),
                            new RGBColour(0, 0, 0),
                            new RGBColour(0, 70, 0),
                            new RGBColour(0, 140, 0),
                            new RGBColour(0, 210, 0),
                            new RGBColour(0, 0, 0),
                            new RGBColour(0, 0, 70),
                            new RGBColour(0, 0, 140),
                            new RGBColour(0, 0, 210),
                        ]))
                ).toBe(true);
            }
        );
    }
);