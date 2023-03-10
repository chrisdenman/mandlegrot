export default class MouseStates {

    /**
     * The state identifier that indicates that the cursor is outside the window.
     *
     * @return {string}
     */
    static get INACTIVE() {
        return MOUSE_STATE__INACTIVE;
    }

    /**
     * The state identifier that indicates when the cursor is inside the window but no buttons are pressed.
     *
     * @return {string}
     */
    static get MOVING() {
        return MOUSE_STATE__MOVING;
    }

    /**
     * The state identifier that indicates the user is dragging a rectangle.
     *
     * @return {string} the identifier representing the given state
     */
    static get DRAGGING() {
        return MOUSE_STATE__DRAGGING;
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

const MOUSE_STATE__INACTIVE = "MOUSE_STATE__INACTIVE";
const MOUSE_STATE__MOVING = "MOUSE_STATE__MOVING";
const MOUSE_STATE__DRAGGING = "MOUSE_STATE__DRAGGING";

const ALL_STATES = new Set([
    MOUSE_STATE__INACTIVE,
    MOUSE_STATE__MOVING,
    MOUSE_STATE__DRAGGING
]);