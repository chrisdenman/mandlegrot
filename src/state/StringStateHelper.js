import {Pair} from "@ceilingcat/collections";
import {StateMachine} from "@ceilingcat/state-machine";

export default class StringStateHelper {

    /**
     * @param {string} currentState
     * @param {string} event
     * @param {string} nextState
     */
    static createTransition =
        (currentState, event, nextState) => [new Pair(currentState, event), nextState];

    /**
     * Is 'state' a member of 'states'?
     *
     * @param {string} state the item to test for membership
     * @param {string} states the states array to test
     *
     * @return {boolean} <code>true</true> if 'state' is in 'states', <code>false</code> otherwise.
     */
    static in = (state, ...states) => states.includes(state);

    /**
     *
     * @param {StateMachine} stateMachine
     * @param {...string} states
     * @return {boolean}
     */
    static inState = (stateMachine, ...states) => states.includes(stateMachine.state);
}
