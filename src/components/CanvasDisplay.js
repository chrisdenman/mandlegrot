import React from 'react';
import PropTypes from 'prop-types';

/**
 * Displays an HTML canvas for rendering into.
 * <P>
 * Binds (enter, leave, up, down) mouse events if provided.
 * <P>
 * Expects a 'theRef' prop for binding the canvas reference into as it is expected the user will be manipulating the
 * canvas directly (outside of React).
 */
const CanvasDisplay = ({theRef, width, height, onMouseMove, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp}) =>
    <canvas
        ref={theRef}
        width={width}
        height={height}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
    >
    </canvas>;

CanvasDisplay.propTypes = {
    theRef: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onMouseMove: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
}; 
    
export default CanvasDisplay;