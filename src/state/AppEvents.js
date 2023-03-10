export default class AppEvents {

    /**
     * @return {string}
     */
    static get INPUT_VALIDATION_SUCCESS() {
        return VALIDATION_SUCCESS;
    }

    /**
     * @return {string}
     */
    static get INPUT_VALIDATION_FAILURE() {
        return VALIDATION_FAILURE;
    }

    /**
     * @return {string}
     */
    static get START_PRESSED() {
        return START_PRESSED;
    }

    /**
     * @return {string}
     */
    static get STOP_PRESSED() {
        return STOP_PRESSED;
    }

    static get RENDERING_FINISHED() {
        return RENDERING_FINISHED;
    }

    /**
     * @return {string}
     */
    static get RENDERING_INITIALISED() {
        return RENDERING_INITIALISED;
    }

    /**
     * A set containing all states.
     *
     * @return {Set<string>} a <code>Set</code> containing all states.
     */
    static get all() {
        return ALL;
    }
}

const VALIDATION_SUCCESS = "APP_EVENT__INPUT_VALIDATION_SUCCESS";
const VALIDATION_FAILURE = "APP_EVENT__INPUT_VALIDATION_FAILURE";
const START_PRESSED = "APP_EVENT__START_PRESSED";
const STOP_PRESSED = "APP_EVENT__STOP_PRESSED";
const RENDERING_FINISHED = "APP_EVENT__RENDERING_FINISHED";
const RENDERING_INITIALISED = "APP_EVENT__RENDERING_INITIALISED";

const ALL = new Set([
    VALIDATION_SUCCESS,
    VALIDATION_FAILURE,
    START_PRESSED,
    STOP_PRESSED,
    RENDERING_FINISHED,
    RENDERING_INITIALISED,
]);