import AppStates from "./AppStates";

/**
 * Mappings from application state identifiers to the text to display for them.
 */
export default class AppStateDisplayText {

    /**
     * Retrieve the display text for a given application state identifier.
     *
     * @param {string} appStateIdentifier - the app state identifier
     *
     * @return {string} the display text for a given application state
     */
    static from(appStateIdentifier) {
        return STATE__TO__DISPLAY_TEXT.get(appStateIdentifier);
    }
}

const STATE__TO__DISPLAY_TEXT = new Map([
    [AppStates.CREATED, "Initialising..."],
    [AppStates.INPUTS_VALID, "Ready to start"],
    [AppStates.INPUTS_INVALID, "Invalid inputs"],
    [AppStates.RENDERING__INIT, "Initialising rendering..."],
    [AppStates.RENDERING, "Rendering..."],
    [AppStates.RENDERING_FINISHED, "Finished"],
]);