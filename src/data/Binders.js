import Binder from "./Binder";

const BINDER_IDENTIFIER_NUMBER = "number";

const BINDERS = {

    /**
     * @type {Binder}
     */
    [BINDER_IDENTIFIER_NUMBER]: new Binder(BINDER_IDENTIFIER_NUMBER, Number)
};

export {BINDER_IDENTIFIER_NUMBER, BINDERS};
