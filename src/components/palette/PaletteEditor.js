import React, {useEffect, useState} from "react";
import Palette from "../../graphics/Palette";
import PropTypes from "prop-types";
import PaletteColour from "./PaletteColour";
import RGBColour from "../../graphics/RGBColour";
import "./PaletteEditor.css";

// noinspection JSValidateTypes
/**
 * Renders a collection of draggable <code>PaletteEntry</code> components.
 */
function PaletteEditor({
                           initial,
                           disableNewColours = false,
                           disableDeletingColours = false,
                           onChanged
                       }) {

    const [palette, setPalette] = useState(initial);
    const [draggedIndex, setDraggedIndex] = useState(undefined);
    const [draggedOverIndex, setDraggedOverIndex] = useState(undefined);

    const colourChanged = (index, colour) => {
        if (!palette.getColour(index).equals(colour)) {
            const newPalette = palette.setColour(index, colour);
            setPalette(newPalette);
        }
    };

    useEffect(() => setPalette(initial), [initial, setPalette]);

    useEffect(() => {
        if (onChanged !== undefined) {
            onChanged(palette);
        }
    }, [onChanged, palette]);

    const colourDragStarted = index => {
        setDraggedIndex(index);
    };

    const colourDragEntered = draggedOverIndex => {
        if (draggedOverIndex !== draggedIndex) {
            setDraggedOverIndex(draggedOverIndex);
        }
    };

    const colourDragEnded = () => {
        if (draggedOverIndex !== draggedIndex) {
            setPalette(palette.moveColour(draggedIndex, draggedOverIndex));
            setDraggedIndex(undefined);
            setDraggedOverIndex(undefined);
        }
    };

    const colourRemoved = index => setPalette(palette.removeColour(index));

    const addColour = () => setPalette(new Palette([...palette.colours, RGBColour.random]));

    return (
        <div className="paletteEditor">
            {!disableNewColours &&
                <div>
                    <button className={"addColourControl"}
                            onClick={addColour}></button>
                </div>}

            <div className="palette"
                 onDragOver={e => {
                     e.preventDefault();
                     e.stopPropagation();
                 }}>
                {palette.colours.map((rgbColour, index) =>
                    <PaletteColour
                        key={index + rgbColour.htmlColour}
                        index={index}
                        colour={rgbColour}
                        disableDeletingColours={disableDeletingColours}
                        onColourChanged={colourChanged}
                        onColourRemovalRequested={colourRemoved}
                        onDragStarted={colourDragStarted}
                        onDragEntered={colourDragEntered}
                        onDragEnded={colourDragEnded}
                    />)}
            </div>
        </div>
    );
}

PaletteEditor.propTypes = {
    initial: PropTypes.instanceOf(Palette).isRequired,
    disableNewColours: PropTypes.bool,
    disableDeletingColours: PropTypes.bool,
    onChanged: PropTypes.func
};

export default PaletteEditor;