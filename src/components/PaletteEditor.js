import React from 'react';
import { Draggable } from "react-drag-reorder";
import PropTypes from "prop-types";
import PaletteEntry from "./PaletteEntry";
import Palette from "../graphics/Palette";

/**
 * Renders a collection of draggable <code>PaletteEntry</code> components.
 */
export default class PaletteEditor extends React.Component {

    static propTypes = {
        palette: PropTypes.instanceOf(Palette).isRequired,
        onPaletteEntryPositionChange: PropTypes.func.isRequired
    };

    render = () => (
        <Draggable onPosChange={this.props.onPaletteEntryPositionChange}>
            {this.props.palette.getArray.map((rgbColour, index) =>
                <PaletteEntry key={index} index={index} colour={rgbColour} />)}
        </Draggable>
    );
}