import React from "react";
import PropTypes from "prop-types";
import RGBColour from "../graphics/RGBColour";

/**
 * Displays an <code>RGBColour</code> colour object as a <code>span</code> element with: its background colour equal to
 * the colour's current value and, its text as the colour's current value represented in standard hexadecimal format.
 */
export default class PaletteEntry extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        colour: PropTypes.instanceOf(RGBColour).isRequired
    };

    render = () => (
        <span
            style={{"background": `rgb(${this.props.colour.red}, ${this.props.colour.green}, ${this.props.colour.blue})`}}>{this.props.colour.hexString}</span>
    );
}