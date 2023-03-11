import React from 'react';
import PropTypes from 'prop-types';
import Point from "../math/Point";

/**
 * If supplied, displays the coordinates of a <code>Point</code>in an HTML span element in parentheses and separated by
 * a comma, else renders nothing.
 */
const CoordinateDisplay = ({location}) => location && <span>({location.x},{location.y})</span>;

CoordinateDisplay.propTypes = {
    location: PropTypes.instanceOf(Point)
};

export default CoordinateDisplay;