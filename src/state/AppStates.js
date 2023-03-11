export default class AppStates {

    /**
     * Determine if two states are equal.
     *
     * @param state0
     * @param state1
     *
     * @return {boolean}
     */
    static equals = (state0, state1) => state0 === state1;

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
     * The initial (constructed) state's identifier.
     *
     * @return {string} the identifier representing the given state
     */
    static get CREATED() {
        return APP_STATE__CREATED;
    }

    /**
     * The state identifier representing that all user inputs are valid.
     *
     * @return {string} the identifier representing the given state
     */
    static get INPUTS_VALID() {
        return APP_STATE__INPUTS_VALID;
    }

    /**
     * The state identifier representing that at least one user input is invalid.
     *
     * @return {string} the identifier representing the given state
     */
    static get INPUTS_INVALID() {
        return APP_STATE__INPUTS_INVALID;
    }

    /**
     * The state identifier for a short-lived state used for initialising the rendering structures and state.
     *
     * @return {string} the identifier representing the given state
     */
    static get RENDERING__INIT() {
        return APP_STATE__RENDERING__INIT;
    }

    /**
     * The state identifier used when rendering a Mandlebrot set proper.
     *
     * @return {string} the identifier representing the given state
     */
    static get RENDERING() {
        return APP_STATE__RENDERING;
    }

    /**
     * The state identifier used when rendering has finished.
     *
     * @return {string} the identifier representing the given state
     */
    static get RENDERING_FINISHED() {
        return APP_STATE__RENDERING_FINISHED;
    }

    /**
     * A set containing all events.
     *
     * @return {Set<string>} a <code>Set</code> containing all events.
     */
    static get all() {
        return ALL_STATES;
    }

}

const APP_STATE__CREATED = "APP_STATE__CREATED";
const APP_STATE__INPUTS_VALID = "APP_STATE__INPUTS_VALID";
const APP_STATE__INPUTS_INVALID = "APP_STATE__INPUTS_INVALID";
const APP_STATE__RENDERING__INIT = "APP_STATE__RENDERING__INIT";
const APP_STATE__RENDERING = "APP_STATE__RENDERING";
const APP_STATE__RENDERING_FINISHED = "APP_STATE__RENDERING_FINISHED";

const ALL_STATES = new Set([
    APP_STATE__CREATED,
    APP_STATE__INPUTS_VALID,
    APP_STATE__INPUTS_INVALID,
    APP_STATE__RENDERING__INIT,
    APP_STATE__RENDERING,
    APP_STATE__RENDERING_FINISHED,
]);