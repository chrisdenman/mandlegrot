import {StateMachine} from "@ceilingcat/state-machine";
import WindowMouseEvents from "./WindowMouseEvents";
import MouseStates from "./MouseStates";
import {IMMUTABLE_EMPTY_SET} from "@ceilingcat/collections";
import StringStateHelper from "../StringStateHelper";

/**
 * @param {function} startTransitionHandler
 * @param {function} [endTransitionHandler=undefined]
 * @return {StateMachine}
 */
const MOUSE_STATE_MACHINE_CONSTRUCTOR = (startTransitionHandler, endTransitionHandler) => new StateMachine(
    WindowMouseEvents.all,
    MouseStates.all,
    MouseStates.created,
    new Map(
        [
            StringStateHelper.createTransition(MouseStates.created, WindowMouseEvents.initialised, MouseStates.inactive),

            StringStateHelper.createTransition(MouseStates.inactive, WindowMouseEvents.cursorEntered, MouseStates.active),

            StringStateHelper.createTransition(MouseStates.active, WindowMouseEvents.cursorMoved, MouseStates.active),
            StringStateHelper.createTransition(MouseStates.active, WindowMouseEvents.buttonDown, MouseStates.dragging),
            StringStateHelper.createTransition(MouseStates.active, WindowMouseEvents.cursorLeft, MouseStates.inactive),

            StringStateHelper.createTransition(MouseStates.dragging, WindowMouseEvents.cursorMoved, MouseStates.dragging),
            StringStateHelper.createTransition(MouseStates.dragging, WindowMouseEvents.buttonUp, MouseStates.active),
            StringStateHelper.createTransition(MouseStates.dragging, WindowMouseEvents.cursorLeft, MouseStates.inactive),


        ]
    ),
    IMMUTABLE_EMPTY_SET,
    startTransitionHandler,
    endTransitionHandler
);

export default MOUSE_STATE_MACHINE_CONSTRUCTOR;

