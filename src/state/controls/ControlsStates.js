export default class ControlsStates {
    static get created() {
        return CONTROLS_STATE__CREATED;
    }

    static get disabled() {
        return CONTROLS_STATE__DISABLED;
    }

    static get enabled() {
        return CONTROLS_STATE__ENABLED;
    }

    static get all() {
        return ALL_STATES;
    }
}

const CONTROLS_STATE__CREATED = "CONTROLS_STATE__CREATED";
const CONTROLS_STATE__DISABLED = "CONTROLS_STATE__DISABLED";
const CONTROLS_STATE__ENABLED = "CONTROLS_STATE__ENABLED";

const ALL_STATES = new Set([
    CONTROLS_STATE__CREATED,
    CONTROLS_STATE__DISABLED,
    CONTROLS_STATE__ENABLED,
]);