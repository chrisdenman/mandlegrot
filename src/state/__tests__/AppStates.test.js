import AppStates from "../AppStates";

describe(
    "AppStates tests",
    () => {
        it(
            "That the all() collection contains all known states",
            () => {
                const SUBJECT = AppStates.all;
                const KNOWN_APP_STATES = [
                    AppStates.CREATED, AppStates.INPUTS_VALID, AppStates.INPUTS_INVALID, AppStates.RENDERING__INIT,
                    AppStates.RENDERING, AppStates.RENDERING_FINISHED
                ];

                KNOWN_APP_STATES.forEach((appState) => expect(SUBJECT).toContain(appState));

                expect(SUBJECT.size).toBe(KNOWN_APP_STATES.length);
            }
        );
    }
);
