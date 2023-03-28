export default class MouseStates {

    /**
     * @return {string} the identifier representing the given state
     */
    static get created() {
        return MOUSE_STATE__CREATED;
    }

    /**
     * The state identifier that indicates that the cursor is outside the window (canvas).
     *
     * @return {string} the identifier representing the given state
     */
    static get inactive() {
        return MOUSE_STATE__INACTIVE;
    }

    /**
     * The state identifier that indicates when the cursor is inside the window (canvas) but no buttons are pressed.
     *
     * @return {string} the identifier representing the given state
     */
    static get active() {
        return MOUSE_STATE__ACTIVE;
    }

    /**
     * The state identifier that indicates the user is dragging a rectangle.
     *
     * @return {string} the identifier representing the given state
     */
    static get dragging() {
        return MOUSE_STATE__DRAGGING;
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

const MOUSE_STATE__CREATED = "MOUSE_STATE__CREATED";
const MOUSE_STATE__INACTIVE = "MOUSE_STATE__INACTIVE";
const MOUSE_STATE__ACTIVE = "MOUSE_STATE__ACTIVE";
const MOUSE_STATE__DRAGGING = "MOUSE_STATE__DRAGGING";

const ALL_STATES = new Set([
    MOUSE_STATE__CREATED,
    MOUSE_STATE__INACTIVE,
    MOUSE_STATE__ACTIVE,
    MOUSE_STATE__DRAGGING
]);