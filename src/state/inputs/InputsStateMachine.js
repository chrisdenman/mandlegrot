import {StateMachine} from "@ceilingcat/state-machine";
import StringStateHelper from "../StringStateHelper";
import {IMMUTABLE_EMPTY_SET} from "@ceilingcat/collections";
import InputsStates from "./InputsStates";
import InputsEvents from "./InputsEvents";

/**
 * @param {function} startTransitionHandler
 * @param {function} [endTransitionHandler=undefined]
 * @return {StateMachine}
 */
const INPUTS_STATE_MACHINE_CONSTRUCTOR = (startTransitionHandler, endTransitionHandler) => new StateMachine(
    InputsEvents.all,
    InputsStates.all,
    InputsStates.created,
    new Map(
        [
            StringStateHelper.createTransition(InputsStates.created, InputsEvents.validated, InputsStates.valid),
            StringStateHelper.createTransition(InputsStates.created, InputsEvents.invalidated, InputsStates.invalid),

            StringStateHelper.createTransition(InputsStates.invalid, InputsEvents.validated, InputsStates.valid),

            StringStateHelper.createTransition(InputsStates.valid, InputsEvents.invalidated, InputsStates.invalid),
        ]
    ),
    IMMUTABLE_EMPTY_SET,
    startTransitionHandler,
    endTransitionHandler
);

export default INPUTS_STATE_MACHINE_CONSTRUCTOR;
