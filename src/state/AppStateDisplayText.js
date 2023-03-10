import AppStates from "./AppStates";

export default class AppStateDisplayText {

    /**
     * @param {string} appState
     * @return {string}
     */
    static from(appState) {
        return STATE__TO__DISPLAY_TEXT.get(appState);
    }
}

const STATE__TO__DISPLAY_TEXT = new Map([
    [AppStates.CREATED, "Initialising..."],
    [AppStates.INPUTS_VALID, "Ready to start"],
    [AppStates.INPUTS_INVALID, "Invalid inputs"],
    [AppStates.RENDERING__INIT, "Initialising rendering..."],
    [AppStates.RENDERING, "Rendering..."],
    [AppStates.RENDERING_FINISHED, "Finished"],
    [AppStates.STOPPED, "Stopped"],
]);