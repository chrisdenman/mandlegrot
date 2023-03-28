export default class InputsStates {

    /**
     * The initial state identifier, before the inputs have been validated
     *
     * @return {string} the identifier representing the given state
     */
    static get created() {
        return INPUTS_STATE__CREATED;
    }

    /**
     * The state identifier representing that all user inputs are valid.
     *
     * @return {string} the identifier representing the given state
     */
    static get valid() {
        return INPUTS_STATE__VALID;
    }

    /**
     * The state identifier representing that at least one user input is invalid.
     *
     * @return {string} the identifier representing the given state
     */
    static get invalid() {
        return INPUTS_STATE__INVALID;
    }

    /**
     * A set containing all events.
     *
     * @return {Set<string>} a <code>Set</code> containing all states.
     */
    static get all() {
        return ALL_STATES;
    }
}

const INPUTS_STATE__CREATED = "INPUTS_STATE__CREATED";
const INPUTS_STATE__VALID = "INPUTS_STATE__VALID";
const INPUTS_STATE__INVALID = "INPUTS_STATE__INVALID";

const ALL_STATES = new Set([
    INPUTS_STATE__CREATED,
    INPUTS_STATE__VALID,
    INPUTS_STATE__INVALID,
]);