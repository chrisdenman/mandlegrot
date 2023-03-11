export default class MouseEvents {

    /**
     * The identifier used for the event when the mouse enters the window (canvas).
     *
     * @return {string}
     */
    static get ENTERED_WINDOW() {
        return ENTERED_WINDOW;
    }

    /**
     * The identifier used for the event when the mouse leaves the window (canvas).
     *
     * @return {string}
     */
    static get LEFT_WINDOW() {
        return LEFT_WINDOW;
    }

    /**
     * The identifier used for the event when the mouse button is pressed.
     *
     * @return {string}
     */
    static get MOUSE_DOWN() {
        return MOUSE_DOWN;
    }

    /**
     * The identifier used for the event when the mouse button is released.
     *
     * @return {string}
     */
    static get MOUSE_UP() {
        return MOUSE_UP;
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

const ENTERED_WINDOW = "MOUSE_EVENT__ENTERED_WINDOW";
const LEFT_WINDOW = "MOUSE_EVENT__LEFT_WINDOW";
const MOUSE_DOWN = "MOUSE_EVENT__MOUSE_DOWN";
const MOUSE_UP = "MOUSE_EVENT__MOUSE_UP";

const ALL = new Set([
    ENTERED_WINDOW,
    LEFT_WINDOW,
    MOUSE_DOWN,
    MOUSE_UP,
]);