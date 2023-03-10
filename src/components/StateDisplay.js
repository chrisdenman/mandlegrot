import React from 'react';
import PropTypes from "prop-types";

/**
 * Simply renders a <code>span</code> containing the 'displayText' prop value.
 */
export default class StateDisplay extends React.Component {

    static propTypes = {
        displayText: PropTypes.string.isRequired
    };

    render = () => (
        <span>{this.props.displayText}</span>
    );
}
