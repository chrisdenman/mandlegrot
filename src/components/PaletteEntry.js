import React from "react";
import PropTypes from "prop-types";
import RGBColour from "../graphics/RGBColour";

/**
 * Displays an <code>RGBColour</code> colour object as a <code>span</code> element with: its background colour equal to
 * the colour's current value and, its text as the colour's current value represented in standard hexadecimal format.
 */
const PaletteEntry = ({colour}) =>
    <span style={{"background": `rgb(${colour.red}, ${colour.green}, ${colour.blue})`}}>{colour.hexString}</span>;

PaletteEntry.propTypes = {
    colour: PropTypes.instanceOf(RGBColour).isRequired
};

export default PaletteEntry;