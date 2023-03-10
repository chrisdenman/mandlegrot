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
export default class ValidatedInput extends React.Component {

    static #CSS_CLASS__INVALID = "invalid";
    static #CSS_CLASS__VALID = "valid";

    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        invalid: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired,
        errors: PropTypes.array,
        onChange: PropTypes.func
    };

    #onChange = (event) => {
        this.props.onChange(event.target.value);
        event.preventDefault();
    }

    get ifInErrorCssClassName() {
        return this.props.invalid === true ?
            ValidatedInput.#CSS_CLASS__INVALID :
            ValidatedInput.#CSS_CLASS__VALID;
    }

    render = () => (
        <div>
            <label htmlFor={this.props.identifier}>{this.props.label}</label>
            <input
                className={this.ifInErrorCssClassName}
                type={this.props.type}
                value={this.props.value}
                disabled={this.props.disabled}
                onChange={this.#onChange}/>
            <ul>
                {this.props.errors?.map((error, index) => <li key={index}><span>{error}</span></li>)}
            </ul>
        </div>
    );
}