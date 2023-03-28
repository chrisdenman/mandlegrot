import {StateMachine} from "@ceilingcat/state-machine";
import StringStateHelper from "../StringStateHelper";
import {IMMUTABLE_EMPTY_SET} from "@ceilingcat/collections";
import InputsEvents from "../inputs/InputsEvents";
import ControlsStates from "./ControlsStates";
import ControlsEvents from "./ControlsEvents";

/**
 * @param {function} [startTransitionHandler]
 * @param {function} [endTransitionHandler=undefined]
 * @return {StateMachine}
 */
const CONTROLS_STATE_MACHINE_CONSTRUCTOR = (startTransitionHandler, endTransitionHandler) => new StateMachine(
    new Set([...ControlsEvents.all, ...InputsEvents.all]),
    ControlsStates.all,
    ControlsStates.created,
    new Map(
        [
            StringStateHelper.createTransition(ControlsStates.created, InputsEvents.validated, ControlsStates.enabled),
            StringStateHelper.createTransition(ControlsStates.created, InputsEvents.invalidated, ControlsStates.disabled),

            StringStateHelper.createTransition(ControlsStates.disabled, InputsEvents.validated, ControlsStates.enabled),

            StringStateHelper.createTransition(ControlsStates.enabled, InputsEvents.invalidated, ControlsStates.disabled),
        ]
    ),
    IMMUTABLE_EMPTY_SET,
    startTransitionHandler,
    endTransitionHandler
);

export default CONTROLS_STATE_MACHINE_CONSTRUCTOR;
