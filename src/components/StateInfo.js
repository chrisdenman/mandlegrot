import PropTypes from "prop-types";
import React from "react";
import {StateMachine} from "@ceilingcat/state-machine";

const StateDisplay = ({inputs, controls, mandlebrotEngine, mouse}) =>
    <div>
        <div><span>{inputs.state}</span></div>
        <div><span>{controls.state}</span></div>
        <div><span>{mandlebrotEngine.state}</span></div>
        <div><span>{mouse.state}</span></div>
    </div>

StateDisplay.propTypes = {
    inputs: PropTypes.instanceOf(StateMachine).isRequired,
    controls: PropTypes.instanceOf(StateMachine).isRequired,
    mandlebrotEngine: PropTypes.instanceOf(StateMachine).isRequired,
    mouse: PropTypes.instanceOf(StateMachine).isRequired,
};
export default StateDisplay;