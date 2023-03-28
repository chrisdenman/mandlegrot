export default class ControlsEvents {

    /**
     * @return {string}
     */
    static get renderRequested() {
        return CONTROLS_EVENT__RENDER_REQUESTED;
    }

    static get all() {
        return ALL;
    }
}

const CONTROLS_EVENT__RENDER_REQUESTED = "CONTROLS_EVENT__RENDER_REQUESTED";

const ALL = new Set([
    CONTROLS_EVENT__RENDER_REQUESTED
]);