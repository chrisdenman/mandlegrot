import Palette from "./graphics/Palette";
import PropertyCollectionIdentifiers from "./data/PropertyCollectionIdentifiers";
import PropertyIdentifiers from "./data/PropertyIdentifiers";
import PropertyInputLabelText from "./data/PropertyInputLabelText";
import {BINDER_IDENTIFIER_NUMBER} from "./data/Binders";
import {
    IS_NUMBER,
    IS_POSITIVE_INTEGER,
    IS_POSITIVE_NUMBER,
    IS_STRICTLY_LESS,
    NOT_BLANK
} from "./data/validators/PropertyValidators";

const INPUT__TYPE__TEXT = "text";

const DEFAULT_PROPS = {
    palette: Palette.create(90, 255, 5),
    propertyCollectionsGroup: [
        {
            identifier: PropertyCollectionIdentifiers.viewport,
            properties: [
                {
                    index: 0,
                    identifier: PropertyIdentifiers.windowWidth,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.windowWidth),
                    value: "100",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_POSITIVE_INTEGER],
                    errors: []
                },
                {
                    index: 1,
                    identifier: PropertyIdentifiers.windowHeight,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.windowHeight),
                    value: "100",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_POSITIVE_INTEGER],
                    errors: []
                }
            ],
            errors: []
        },

        {
            identifier: PropertyCollectionIdentifiers.world,
            properties: [
                {
                    index: 0,
                    identifier: PropertyIdentifiers.worldMinX,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.worldMinX),
                    value: "-2",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_NUMBER],
                    errors: []
                },
                {
                    index: 1,
                    identifier: PropertyIdentifiers.worldMinY,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.worldMinY),
                    value: "-1.12",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_NUMBER],
                    errors: []
                },
                {
                    index: 2,
                    identifier: PropertyIdentifiers.worldMaxX,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.worldMaxX),
                    value: "0.47",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_NUMBER],
                    errors: []
                },
                {
                    index: 3,
                    identifier: PropertyIdentifiers.worldMaxY,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.worldMaxY),
                    value: "1.12",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_NUMBER],
                    errors: []
                },
            ],
            propertiesValidators: [
                {
                    propertyIdentifiers: [PropertyIdentifiers.worldMinX, PropertyIdentifiers.worldMaxX],
                    validatorIdentifier: IS_STRICTLY_LESS
                },
                {
                    propertyIdentifiers: [PropertyIdentifiers.worldMinY, PropertyIdentifiers.worldMaxY],
                    validatorIdentifier: IS_STRICTLY_LESS
                }
            ],
            errors: []
        },

        {
            identifier: PropertyCollectionIdentifiers.engine,
            properties: [
                {
                    index: 0,
                    identifier: PropertyIdentifiers.maxIterations,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.maxIterations),
                    value: "1000",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_POSITIVE_INTEGER],
                    errors: []
                },
                {
                    index: 1,
                    identifier: PropertyIdentifiers.maxModulus,
                    htmlType: INPUT__TYPE__TEXT,
                    label: PropertyInputLabelText.from(PropertyIdentifiers.maxModulus),
                    value: "2",
                    binderIdentifier: BINDER_IDENTIFIER_NUMBER,
                    validatorIdentifiers: [NOT_BLANK, IS_POSITIVE_NUMBER],
                    errors: []
                },
            ],
            errors: []
        },
    ]
};

export {DEFAULT_PROPS};