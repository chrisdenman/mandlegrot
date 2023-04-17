export default class MandlebrotEngineStates {

    /**
     * @return {string}
     */
    static get created() {
        return MANDLEBROT_ENGINE_STATE__CREATED;
    }

    /**
     * @return {string}
     */
    static get initialisingCalculations() {
        return MANDLEBROT_ENGINE_STATE__INITIALISING_CALCULATIONS;
    }

    /**
     * @return {string}
     */
    static get recolouring() {
        return MANDLEBROT_ENGINE_STATE__RECOLOURING;
    }

    /**
     * @return {string}
     */
    static get calculating() {
        return MANDLEBROT_ENGINE_STATE__CALCULATING;
    }


    /**
     * Copies the iteration between memories.
     * Loading the colouring wasm module that uses iterationDataAndPaletteMemory.
     *
     * @return {string}
     */
    static get initialisingColourMapping() {
        return MANDLEBROT_ENGINE_STATE__INITIALISING_COLOUR_MAPPING;
    }

    /**
     * Mutates the copy of the iteration data into a coloured buffer.
     *
     * @return {string}
     */
    static get colourMapping() {
        return MANDLEBROT_ENGINE_STATE__COLOUR_MAPPING;
    }

    static get initialisingThumbnailGeneration() {
        return MANDLEBROT_ENGINE_STATE__INITIALISING_THUMBNAIL_GENERATION;
    }

    static get thumbnailGeneration() {
        return MANDLEBROT_ENGINE_STATE__THUMBNAIL_GENERATION;
    }

    static get copyingThumbnail() {
        return MANDLEBROT_ENGINE_STATE__COPYING_THUMBNAIL;
    }

    /**
     * Calculating and colour mapping complete.
     *
     * @return {string}
     */
    static get finished() {
        return MANDLEBROT_ENGINE_STATE__FINISHED;
    }

    static get all() {
        return ALL_STATES;
    }
}

const MANDLEBROT_ENGINE_STATE__CREATED = "MANDLEBROT_ENGINE_STATE__CREATED";
const MANDLEBROT_ENGINE_STATE__INITIALISING_CALCULATIONS = "MANDLEBROT_ENGINE_STATE__INITIALISING_CALCULATIONS";
const MANDLEBROT_ENGINE_STATE__CALCULATING = "MANDLEBROT_ENGINE_STATE__CALCULATING";
const MANDLEBROT_ENGINE_STATE__INITIALISING_COLOUR_MAPPING = "MANDLEBROT_ENGINE_STATE__INITIALISING_COLOUR_MAPPING";
const MANDLEBROT_ENGINE_STATE__COLOUR_MAPPING = "MANDLEBROT_ENGINE_STATE__COLOUR_MAPPING";
const MANDLEBROT_ENGINE_STATE__RECOLOURING = "MANDLEBROT_ENGINE_STATE__RECOLOURING";
const MANDLEBROT_ENGINE_STATE__FINISHED = "MANDLEBROT_ENGINE_STATE__FINISHED";
const MANDLEBROT_ENGINE_STATE__INITIALISING_THUMBNAIL_GENERATION = "MANDLEBROT_ENGINE_STATE__INITIALISING_THUMBNAIL_GENERATION";
const MANDLEBROT_ENGINE_STATE__THUMBNAIL_GENERATION = "MANDLEBROT_ENGINE_STATE__THUMBNAIL_GENERATION";
const MANDLEBROT_ENGINE_STATE__COPYING_THUMBNAIL = "MANDLEBROT_ENGINE_STATE__COPYING_THUMBNAIL";

const ALL_STATES = new Set([
   MandlebrotEngineStates.created,
   MandlebrotEngineStates.initialisingCalculations,
   MandlebrotEngineStates.recolouring,
   MandlebrotEngineStates.calculating,
   MandlebrotEngineStates.initialisingColourMapping,
   MandlebrotEngineStates.colourMapping,
   MandlebrotEngineStates.initialisingThumbnailGeneration,
   MandlebrotEngineStates.thumbnailGeneration,
   MandlebrotEngineStates.copyingThumbnail,
   MandlebrotEngineStates.finished,
]);