export default class MandlebrotEngineEvents {

    /**
     * @return {string}
     */
    static get initialiseCalculations() {
        return MANDLEBROT_ENGINE_EVENT__INITIALISE_CALCULATIONS;
    }

    /**
     * @return {string}
     */
    static get calculationInitialised() {
        return MANDLEBROT_ENGINE_EVENT__CALCULATION_INITIALISED;
    }

    /**
     * @return {string}
     */
    static get calculationFinished() {
        return MANDLEBROT_ENGINE_EVENT__CALCULATION_FINISHED;
    }

    /**
     * @return {string}
     */
    static get colouringInitialised() {
        return MANDLEBROT_ENGINE_EVENT__COLOURING_INITIALISED;
    }

    /**
     * @return {string}
     */
    static get paletteChange() {
        return MANDLEBROT_ENGINE_EVENT__PALETTE_CHANGED;
    }

    /**
     * @return {string}
     */
    static get colouringFinished() {
        return MANDLEBROT_ENGINE_EVENT__COLOURING_FINISHED;
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

const MANDLEBROT_ENGINE_EVENT__INITIALISE_CALCULATIONS = "MANDLEBROT_ENGINE_EVENT__INITIALISE_CALCULATIONS";
const MANDLEBROT_ENGINE_EVENT__CALCULATION_INITIALISED = "MANDLEBROT_ENGINE_EVENT__CALCULATION_INITIALISED";
const MANDLEBROT_ENGINE_EVENT__CALCULATION_FINISHED = "MANDLEBROT_ENGINE_EVENT__CALCULATION_FINISHED";
const MANDLEBROT_ENGINE_EVENT__PALETTE_CHANGED = "MANDLEBROT_ENGINE_EVENT__CALCULATION_FINISHED";
const MANDLEBROT_ENGINE_EVENT__COLOURING_INITIALISED = "MANDLEBROT_ENGINE_EVENT__COLOURING_INITIALISED";
const MANDLEBROT_ENGINE_EVENT__COLOURING_FINISHED = "MANDLEBROT_ENGINE_EVENT__COLOURING_FINISHED";

const ALL = new Set([
    MANDLEBROT_ENGINE_EVENT__INITIALISE_CALCULATIONS,
    MANDLEBROT_ENGINE_EVENT__CALCULATION_INITIALISED,
    MANDLEBROT_ENGINE_EVENT__CALCULATION_FINISHED,
    MANDLEBROT_ENGINE_EVENT__PALETTE_CHANGED,
    MANDLEBROT_ENGINE_EVENT__COLOURING_INITIALISED,
    MANDLEBROT_ENGINE_EVENT__COLOURING_FINISHED
]);

