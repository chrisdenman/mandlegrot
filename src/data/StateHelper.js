import ArrayHelpers from "../misc/ArrayHelpers";
import {map, withIt} from "../misc/ScopeHelper";
import {VALIDATORS} from "./validators/PropertyValidators";
import {BINDERS} from "./Binders";

/**
 * @typedef PropertyState
 *
 * @property {string} htmlType
 * @property {string} label
 * @property {number} index
 * @property {string} value
 * @property {string[]} errors
 */

/**
 * @typedef PropertyProps
 *
 * @property {string} htmlType
 * @property {string} label
 * @property {number} index
 * @property {string} value
 * @property {string[]} errors
 * @property {string} binderIdentifier
 * @property {string[]} validatorIdentifiers
 */

const INPUT__TYPE__TEXT = "text";

const buildPropertyProp = (index, label, value, binderIdentifier, validatorIdentifiers = [], htmlType = INPUT__TYPE__TEXT) => ({
    index, label, value, binderIdentifier, validatorIdentifiers, htmlType
});

const createState = (propertyCollectionsGroupProps) =>
    map(
        propertyCollectionsGroupProps,
        ({properties, constraints = []}) => {
            return withIt(map(properties, crateInitialPropertyState), properties =>
                ({
                    properties,
                    errors: validatePropertyCollection({properties, constraints})
                })
            );
        }
    )

/**
 * @return {PropertyState}
 */
const crateInitialPropertyState = ({htmlType, label, index, value, validatorIdentifiers}, identifier) =>
    ({
        htmlType, label, index,
        value,
        errors: validateProperty({identifier, value, validatorIdentifiers})
    });

const validateProperty = ({identifier, value, validatorIdentifiers}) =>
    ArrayHelpers.filterUndefined(
        validatorIdentifiers.map((validatorIdentifier) =>
            withIt(VALIDATORS[validatorIdentifier], (validator) =>
                validator.predicate(value) ?
                    undefined :
                    validator.failureMessageTemplate.interpolate(new Map([['0', identifier]]))
            )
        )
    );


/**
 * @typedef SetInputValuesStatus
 * @property propertyCollectionGroupState
 * @property {boolean} isValid
 */

/**
 * @return {SetInputValuesStatus}
 */
const setInputValues = (groupsState, groupsProps, groupIdentifier, updates = {}) => {
    const propertyCollectionGroupState = structuredClone(groupsState);
    const groupProps = groupsProps[groupIdentifier];
    const groupState = propertyCollectionGroupState[groupIdentifier];
    Object.entries(updates).forEach(([identifier, value]) => {
        withIt(String(value), stringValue => {
                groupState.properties[identifier].value = stringValue;
                groupState.properties[identifier].errors = validateProperty({
                    identifier,
                    value: stringValue,
                    validatorIdentifiers: groupProps.properties[identifier].validatorIdentifiers
                });
            }
        );
    });

    const individualErrors = propertiesHaveErrors({properties: groupState.properties});
    groupState.errors = validatePropertyCollection({
        properties: groupState.properties,
        constraints: groupProps.constraints
    });
    const groupErrors = groupState.errors.length !== 0;

    return {
        propertyCollectionGroupState: propertyCollectionGroupState,
        isValid: !individualErrors && !groupErrors
    };
}


const getJsProp = (collectionIdentifier, identifier, props, state) => {
    const propertiesObj = props[collectionIdentifier].properties[identifier];
    const stateObj = state[collectionIdentifier].properties[identifier];

    return BINDERS[propertiesObj.binderIdentifier](stateObj.value);
}

const propertiesHaveErrors = ({properties}) =>
    Object.entries(properties).reduce((acc, curr) => acc.concat(curr[1].errors), []).length !== 0;

const validatePropertyCollection = ({properties, constraints = []}) =>
    propertiesHaveErrors(
        {properties}) ?
        [] :
        ArrayHelpers.filterUndefined(constraints.flatMap(({propertyIdentifiers, validatorIdentifiers}) =>
            validatorIdentifiers.map((validatorIdentifier) =>
                withIt(
                    VALIDATORS[validatorIdentifier],
                    (validator) =>
                        validator.predicate(...propertyIdentifiers.map(identifier => properties[identifier].value)) ?
                            undefined :
                            {
                                propertyIdentifiers: propertyIdentifiers,
                                error: validator.failureMessageTemplate.interpolate(
                                    new Map(
                                        propertyIdentifiers.map((identifier, i) => [i, identifier])
                                    )
                                )
                            }
                )
            )
        ));

export {
    buildPropertyProp,
    createState,
    setInputValues,
    getJsProp
}