import React from 'react';
import PropTypes from 'prop-types';
import Point from "../math/Point";

/**
 * If supplied, displays the coordinates of a <code>Point</code>in an HTML span element in parentheses and separated by
 * a comma, else renders nothing.
 */
export default class CoordinateDisplay extends React.Component {

    static propTypes = {
        location: PropTypes.instanceOf(Point)
    };

    render = () => (this.props.location && <span>({this.props.location.x},{this.props.location.y})</span>);
}
