import React from 'react';
import ValidatedInput from "./ValidatedInput.js";
import PropTypes from "prop-types";

/**
 * Renders a <code>div</code> containing <code>ValidatedInput</code> components followed by an unordered list of errors.
 */
export default class ValidatedInputs extends React.Component {

    static propTypes = {
        properties: PropTypes.array.isRequired,
        errors: PropTypes.array,
        onChange: PropTypes.func
    };

    /**
     * @return {PropertyData[]}
     */
    get #properties() {
        return this.props.properties;
    }

    render = () => (
        <div>
            {
                this.#properties.map(
                    (property) =>
                        <ValidatedInput
                            key={property.identifier}
                            type={property.htmlType}
                            identifier={property.identifier}
                            label={property.label}
                            value={property.value}
                            disabled={this.props.disabled}
                            errors={property.errors}
                            invalid={
                                property.errors.length > 0 ||
                                this.props.errors.reduce(
                                    (acc, {propertyIdentifiers, _}) => acc || propertyIdentifiers.includes(property.identifier),
                                    false
                                )
                            }
                            onChange={this.props.onChange.bind(this, property.identifier)}
                        />)
            }
            <ul>
                {this.props.errors?.map(({propertyIdentifiers, error}, index) => <li key={index}>{error}</li>)}
            </ul>
        </div>
    );
}
