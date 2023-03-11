import React from 'react';
import { Draggable } from "react-drag-reorder";
import PropTypes from "prop-types";
import PaletteEntry from "./PaletteEntry";
import Palette from "../graphics/Palette";

// noinspection JSValidateTypes
/**
 * Renders a collection of draggable <code>PaletteEntry</code> components.
 */
const PaletteEditor = ({palette, onPaletteEntryPositionChange}) =>
    <Draggable onPosChange={onPaletteEntryPositionChange}>
        {
            palette.getArray.map(
                (rgbColour, index) => <PaletteEntry key={index} colour={rgbColour} />
            )
        }
    </Draggable>;

PaletteEditor.propTypes = {
    palette: PropTypes.instanceOf(Palette).isRequired,
    onPaletteEntryPositionChange: PropTypes.func.isRequired
};

export default PaletteEditor;