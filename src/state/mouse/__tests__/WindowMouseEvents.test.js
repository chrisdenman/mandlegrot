import WindowMouseEvents from "../WindowMouseEvents"

describe(
    "Window Mouse Events Tests",
    () => {
        it(
            "That the all() collection contains all known events",
            () => expect(WindowMouseEvents.all.size).toBe(6)
        );
    }
);
