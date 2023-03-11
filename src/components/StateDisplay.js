import React from 'react';
import PropTypes from "prop-types";

const StateDisplay = ({displayText}) => <span>{displayText}</span>;

StateDisplay.propTypes = {
    displayText: PropTypes.string.isRequired
};

export default StateDisplay;