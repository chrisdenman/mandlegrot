export default class WindowMouseEvents {

    /**
     * The identifier used for the event when the mouse enters the window (canvas).
     *
     * @return {string}
     */
    static get initialised() {
        return WINDOW_MOUSE_EVENT__INITIALISED;
    }

    /**
     * The identifier used for the event when the mouse enters the window (canvas).
     *
     * @return {string}
     */
    static get cursorEntered() {
        return WINDOW_MOUSE_EVENT__CURSOR_ENTERED;
    }


    /**
     * @return {string}
     */
    static get cursorMoved() {
        return WINDOW_MOUSE_EVENT__CURSOR_MOVED;
    }

    /**
     * The identifier used for the event when the mouse leaves the window (canvas).
     *
     * @return {string}
     */
    static get cursorLeft() {
        return WINDOW_MOUSE_EVENT__CURSOR_LEFT;
    }

    /**
     * The identifier used for the event when the mouse button is pressed.
     *
     * @return {string}
     */
    static get buttonDown() {
        return WINDOW_MOUSE_EVENT__BUTTON_DOWN;
    }

    /**
     * The identifier used for the event when the mouse button is released.
     *
     * @return {string}
     */
    static get buttonUp() {
        return WINDOW_MOUSE_EVENT__BUTTON_UP;
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

const WINDOW_MOUSE_EVENT__INITIALISED = "WINDOW_MOUSE_EVENT__INITIALISED";
const WINDOW_MOUSE_EVENT__CURSOR_ENTERED = "WINDOW_MOUSE_EVENT__CURSOR_ENTERED";
const WINDOW_MOUSE_EVENT__CURSOR_MOVED = "WINDOW_MOUSE_EVENT__CURSOR_MOVED";
const WINDOW_MOUSE_EVENT__CURSOR_LEFT = "WINDOW_MOUSE_EVENT__CURSOR_LEFT";
const WINDOW_MOUSE_EVENT__BUTTON_DOWN = "WINDOW_MOUSE_EVENT__BUTTON_DOWN";
const WINDOW_MOUSE_EVENT__BUTTON_UP = "WINDOW_MOUSE_EVENT__BUTTON_UP";

const ALL = new Set([
    WINDOW_MOUSE_EVENT__INITIALISED,
    WINDOW_MOUSE_EVENT__CURSOR_ENTERED,
    WINDOW_MOUSE_EVENT__CURSOR_MOVED,
    WINDOW_MOUSE_EVENT__CURSOR_LEFT,
    WINDOW_MOUSE_EVENT__BUTTON_DOWN,
    WINDOW_MOUSE_EVENT__BUTTON_UP,
]);