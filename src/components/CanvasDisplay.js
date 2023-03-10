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
export default class CanvasDisplay extends React.Component {

    static propTypes = {
        theRef: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        onMouseMove: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onMouseDown: PropTypes.func,
        onMouseUp: PropTypes.func,
    };

    render = () => (
        <canvas
            onMouseMove={this.props.onMouseMove}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            onMouseDown={this.props.onMouseDown}
            onMouseUp={this.props.onMouseUp}
            ref={this.props.theRef}
            width={this.props.width}
            height={this.props.height}>
        </canvas>
    );
}
