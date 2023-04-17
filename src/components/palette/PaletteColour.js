import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import RGBColour from "../../graphics/RGBColour";
import "./PaletteColour.css";

/**
 * Displays an <code>RGBColour</code> colour object as a <code>span</code> element with: its background colour equal to
 * the colour's current value and, its text as the colour's current value represented in standard hexadecimal format.
 */
/**
 *
 * @param {RGBColour} colour
 * @return {false|JSX.Element}
 * @constructor
 */
const PaletteColour = ({
                           colour: initialColour,
                           index,
                           onColourChanged,
                           onColourRemovalRequested,
                           onDragStarted,
                           onDragEntered,
                           onDragEnded,
                           disableDeletingColours = false
                       }) => {

    const [colour, setColour] = useState(initialColour);
    const [editingColour, setEditingColour] = useState(undefined);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        onColourChanged(index, colour);
    }, [index, colour, onColourChanged]);

    /**
     *
     * @param {number} component
     * @param {FormEvent<HTMLInputElement>} event
     */
    const slid = (component, event) => {
        const components = editingColour.components.map((value, index) =>
            index === component ? parseInt(event.target.value) : value
        );
        setEditingColour(new RGBColour(...components));
        handleEvent(event);
    };

    const handleEvent = (event, stopPropagation = true, preventDefault = true) => {
        stopPropagation && event.stopPropagation();
        preventDefault && event.preventDefault();
    };

    const colourRemovalRequested = () => onColourRemovalRequested(index);

    const editRequested = event => {
        setIsEditing(true);
        setEditingColour(colour);
        handleEvent(event);
    };

    const newColourAccepted = event => {
        setIsEditing(false);
        setColour(editingColour);
        handleEvent(event);
    };

    const newColourRejected = event => {
        setIsEditing(false);
        handleEvent(event);
    };

    const colourDraggedIntoColour = event => {
        onDragEntered(index);
        handleEvent(event);
    };

    const colourDragStarted = event => {
        onDragStarted(index);
        handleEvent(event, true, false);
    };

    const colourDragEnded = event => {
        onDragEnded(index);
        handleEvent(event);
    };

    const ifString = (truth, ifSo = "", ifNot = "") => truth ? ifSo : ifNot;

    const className = () => [
        "colour",
        ifString(isEditing, "editing"),
    ].join(" ").trim();

    return (
        isEditing ? (
                <div
                    className={className()}
                    style={{"background": editingColour.htmlColour}}>
                    <input
                        className="red"
                        type="range"
                        min="0"
                        max="255"
                        value={editingColour.red}
                        onClick={handleEvent}
                        onInput={slid.bind(undefined, 0)}
                    />

                    <input
                        className="green"
                        type="range"
                        min="0"
                        max="255"
                        value={editingColour.green}
                        onClick={handleEvent}
                        onInput={slid.bind(undefined, 1)}
                    />

                    <input
                        className="blue"
                        type="range"
                        min="0"
                        max="255"
                        value={editingColour.blue}
                        onClick={handleEvent}
                        onInput={slid.bind(undefined, 2)}
                    />
                    {
                        !disableDeletingColours &&
                        <button className={"colourControl removeColourControl"}
                                onClick={colourRemovalRequested}></button>
                    }

                    <button className={"colourControl rejectColourControl"}
                            onClick={newColourRejected}></button>
                    <button disabled={editingColour.equals(colour)}
                            className={"colourControl acceptColourControl"}
                            onClick={newColourAccepted}></button>
                </div>
            ) :
            (
                <div
                    draggable={true}
                    className={className()}
                    onDragEnter={colourDraggedIntoColour}
                    onDragStart={colourDragStarted}
                    onDragEnd={colourDragEnded}
                    onClick={editRequested}
                    style={{"background": colour.htmlColour}}>&nbsp;</div>)
    );
};

PaletteColour.propTypes = {
    colour: PropTypes.instanceOf(RGBColour).isRequired
};

export default PaletteColour;