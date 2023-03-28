export default class CacheKeyNames {

    /**
     * The name of the cache key used to store a reference to the shared memory used to store mandlebrot iteration data.
     *
     * @return {string}
     */
    static get iterationDataMemory() {
        return ITERATION_DATA_MEMORY;
    }

    static get iterationDataAndPaletteMemory() {
        return ITERATION_DATA_AND_PALETTE_MEMORY;
    }

    /**
     * The name of the cache key used to store image data.
     *
     * @return {string}
     */
    static get imageData() {
        return IMAGE_DATA;
    }

    /**
     * The name of the cache key used to store the mandlebrot workers list.
     *
     * @return {string}
     */
    static get mandlebrotWorkers() {
        return MANDLEBROT_WORKERS;
    }

    /**
     * The name of the cache key used to store the mandlebrot colouring module.
     *
     * @return {string}
     */
    static get mandlebrotColouringModule() {
        return MANDLEBROT_COLOURING_MODULE;
    }

    /**
     * The name of the cache key used to store a set that contains the remaining line numbers to render.
     *
     * @return {string}
     */
    static get pendingLineNumberPool() {
        return PENDING_LINE_NUMBER_POOL;
    }

    /**
     * The name of the cache key used to store a set that contains the lines numbers that have been rendered.
     *
     * @return {string}
     */
    static get completedLineNumberPool() {
        return COMPLETED_LINE_NUMBER_POOL;
    }
}

const ITERATION_DATA_MEMORY = 'ITERATION_DATA_MEMORY';
const ITERATION_DATA_AND_PALETTE_MEMORY = 'ITERATION_DATA_AND_PALETTE_MEMORY';
const IMAGE_DATA = 'IMAGE_DATA';
const MANDLEBROT_WORKERS = 'MANDLEBROT_WORKERS';
const MANDLEBROT_COLOURING_MODULE = 'MANDLEBROT_COLOURING_MODULE';
const PENDING_LINE_NUMBER_POOL = 'PENDING_LINE_NUMBER_POOL';
const COMPLETED_LINE_NUMBER_POOL = 'COMPLETED_LINE_NUMBER_POOL';
