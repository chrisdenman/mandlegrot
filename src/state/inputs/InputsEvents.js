export default class InputsEvents {

    /**
     * The identifier used for the event when the inputs have been validated.
     *
     * @return {string}
     */
    static get validated() {
        return INPUTS_EVENT__VALIDATED;
    }

    /**
     * The identifier used for the event when the inputs have been invalidated.
     *
     * @return {string}
     */
    static get invalidated() {
        return INPUTS_EVENT__INVALIDATED;
    }

    /**
     * A set containing all events.
     *
     * @return {Set<string>} a <code>Set</code> containing all events.
     */
    static get all() {
        return ALL;
    }
}

const INPUTS_EVENT__VALIDATED = "INPUTS_EVENT__VALIDATED";
const INPUTS_EVENT__INVALIDATED = "INPUTS_EVENT__INVALIDATED";

const ALL = new Set([
    InputsEvents.validated,
    InputsEvents.invalidated,
]);