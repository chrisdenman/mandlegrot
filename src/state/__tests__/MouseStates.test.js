import MouseStates from "../mouse/MouseStates";

describe(
    "MouseStates tests",
    () => {
        it(
            "That the all() collection contains all known states",
            () => {
                const SUBJECT = MouseStates.all;
                const KNOWN_MOUSE_STATES = [MouseStates.created, MouseStates.inactive, MouseStates.active, MouseStates.dragging];

                KNOWN_MOUSE_STATES.forEach((appState) => expect(SUBJECT).toContain(appState));
                expect(SUBJECT.size).toBe(KNOWN_MOUSE_STATES.length);
            }
        );
    }
);
