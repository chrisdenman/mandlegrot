import React from 'react';
import PropTypes from "prop-types";

/**
 * Renders a labelled <code>input</code> and, follows it with an unordered list of errors if supplied.
 * <p>
 * Binds the 'onChange' handler if supplied.
 * <p>
 * The CSS class 'invalid' is added to the input element if the 'errors' prop is not empty, else the CSS class 'valid'
 * is added.
 */
const ValidatedInput = ({identifier, label, type, invalid, value, disabled, onChange, errors}) => (
    <div>
        <label htmlFor={identifier}>{label}</label>
        <input
            className={ifInErrorCssClassName(invalid || errors.length !== 0)}
            type={type}
            value={value}
            disabled={disabled}
            onChange={(event) => {
                onChange(event.target.value);
                event.preventDefault();
            }}/>
        <ul>
            {errors?.map((error, index) => <li key={index}><span>{error}</span></li>)}
        </ul>
    </div>
);

ValidatedInput.propTypes = {
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    invalid: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    errors: PropTypes.array,
    onChange: PropTypes.func
};

const CSS_CLASS__INVALID = "invalid";
const CSS_CLASS__VALID = "valid";

const ifInErrorCssClassName = (invalid) => invalid === true ? CSS_CLASS__INVALID : CSS_CLASS__VALID;

export default ValidatedInput;