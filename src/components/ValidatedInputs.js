import React from 'react';
import ValidatedInput from "./ValidatedInput.js";
import PropTypes from "prop-types";

/**
 * Renders a <code>div</code> containing <code>ValidatedInput</code> components followed by an unordered list of errors.
 */
const ValidatedInputs = ({disabled, errors, properties, onChange}) => (
    <div>
        {
            properties.map(
                (property) =>
                    <ValidatedInput
                        key={property.identifier}
                        type={property.htmlType}
                        identifier={property.identifier}
                        label={property.label}
                        value={property.value}
                        disabled={disabled}
                        errors={property.errors}
                        invalid={
                            property.errors.length > 0 ||
                            errors.reduce(
                                (acc, {propertyIdentifiers, _}) =>
                                    acc || propertyIdentifiers.includes(property.identifier),
                                false
                            )
                        }
                        onChange={onChange.bind(undefined, property.identifier)}
                    />)
        }
        <ul>
            {errors?.map(({propertyIdentifiers, error}, index) => <li key={index}>{error}</li>)}
        </ul>
    </div>
);

ValidatedInputs.propTypes = {
    properties: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    errors: PropTypes.array,
    onChange: PropTypes.func
};

export default ValidatedInputs;