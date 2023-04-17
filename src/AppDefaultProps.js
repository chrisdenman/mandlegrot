import PropertyGroupIdentifiers from "./data/PropertyGroupIdentifiers";
import {
    IS_NUMBER,
    IS_POSITIVE_INTEGER,
    IS_POSITIVE_NUMBER,
    IS_STRICTLY_LESS,
    NOT_BLANK
} from "./data/validators/PropertyValidators";
import PropertyIdentifiers from "./data/PropertyIdentifiers";
import PropertyInputLabelText from "./data/PropertyInputLabelText";
import {BINDER_IDENTIFIER_NUMBER} from "./data/Binders";
import {buildPropertyProp} from "./data/StateHelper";
import RGBColour from "./graphics/RGBColour";
import Palette from "./graphics/Palette";
import ChannelSeparatedLinearPalette from "./graphics/ChannelSeparatedLinearPalette";

const DEFAULT_PROPS = {
    canvas: {
        crosshairs: {
            lineWidth: 1,
            strokeStyle: RGBColour.WHITE.htmlColour
        },
        drag: {
            fillStyle: "#22331133",
            font: "12pt serif",
            lineWidth: 1,
            edgeColour: RGBColour.WHITE.htmlColour,
            dimensionsBackground: RGBColour.BLACK.htmlColour,
            dimensionsForeground: RGBColour.WHITE.htmlColour,
        }
    },
    thumbnails: {
        widthPixels: 100,
        heightPixels: 100,
    },
    mandlebrotPalette: new Palette([RGBColour.BLACK]),
    palette: ChannelSeparatedLinearPalette.create(
        50, 255, 15
    ),
    propertyCollectionsGroup: {
        [PropertyGroupIdentifiers.viewport]: {
            properties: {
                [PropertyIdentifiers.windowWidth]: buildPropertyProp(0, PropertyInputLabelText.from(PropertyIdentifiers.windowWidth), "1200", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_POSITIVE_INTEGER]),
                [PropertyIdentifiers.windowHeight]: buildPropertyProp(1, PropertyInputLabelText.from(PropertyIdentifiers.windowHeight), "1200", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_POSITIVE_INTEGER]),
            }
        },
        [PropertyGroupIdentifiers.world]: {
            properties: {
                [PropertyIdentifiers.worldMinX]: buildPropertyProp(0, PropertyInputLabelText.from(PropertyIdentifiers.worldMinX), "-2", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_NUMBER]),
                [PropertyIdentifiers.worldMinY]: buildPropertyProp(1, PropertyInputLabelText.from(PropertyIdentifiers.worldMinY), "-1.12", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_NUMBER]),
                [PropertyIdentifiers.worldMaxX]: buildPropertyProp(2, PropertyInputLabelText.from(PropertyIdentifiers.worldMaxX), "0.47", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_NUMBER]),
                [PropertyIdentifiers.worldMaxY]: buildPropertyProp(3, PropertyInputLabelText.from(PropertyIdentifiers.worldMaxY), "1.12", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_NUMBER])
            },
            constraints: [
                {
                    propertyIdentifiers: [PropertyIdentifiers.worldMinX, PropertyIdentifiers.worldMaxX],
                    validatorIdentifiers: [IS_STRICTLY_LESS]
                },
                {
                    propertyIdentifiers: [PropertyIdentifiers.worldMinY, PropertyIdentifiers.worldMaxY],
                    validatorIdentifiers: [IS_STRICTLY_LESS]
                }
            ]
        },
        [PropertyGroupIdentifiers.engine]: {
            properties: {
                [PropertyIdentifiers.maxIterations]: buildPropertyProp(0, PropertyInputLabelText.from(PropertyIdentifiers.maxIterations), "1000", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_POSITIVE_INTEGER]),
                [PropertyIdentifiers.maxModulus]: buildPropertyProp(1, PropertyInputLabelText.from(PropertyIdentifiers.maxModulus), "2", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_POSITIVE_NUMBER]),
                [PropertyIdentifiers.numWorkers]: buildPropertyProp(2, PropertyInputLabelText.from(PropertyIdentifiers.numWorkers), "32", BINDER_IDENTIFIER_NUMBER, [NOT_BLANK, IS_POSITIVE_INTEGER]),
            }
        }
    }
};

export {DEFAULT_PROPS};