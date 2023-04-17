export default class AppCacheKeyNames {

    /**
     * The cache key used to store a reference to the shared memory used to store mandlebrot iteration data.
     *
     * @return {string}
     */
    static get iterationDataMemory() {
        return CACHE_KEY__ITERATION_DATA_MEMORY;
    }

    /**
     * The cache key used to store the image box-scaling image.
     *
     * @return {string}
     */
    static get boxScaleWorker() {
        return CACHE_KEY__BOX_SCALE_WORKER;
    }

    /**
     * The cache key used to store a reference to the iteration data and palette WebAssembly memory.
     *
     * @return {string}
     */
    static get iterationDataAndPaletteMemory() {
        return CACHE_KEY__ITERATION_DATA_AND_PALETTE_MEMORY;
    }

    /**
     * The cache key used to store a reference to the iteration data and thumbnail WebAssembly memory.
     *
     * @return {string}
     */
    static get imageDataAndThumbnailMemory() {
        return CACHE_KEY__IMAGE_DATA_AND_THUMBNAIL_MEMORY;
    }

    /**
     * The cache key used to store a reference to the thumbnail WebAssembly memory.
     *
     * @return {string}
     */
    static get thumbnailMemory() {
        return CACHE_KEY__THUMBNAIL_MEMORY;
    }

    /**
     * The cache key used to store a reference to the image data WebAssembly memory.
     *
     * @return {string}
     */
    static get imageData() {
        return CACHE_KEY__IMAGE_DATA;
    }

    /**
     * The cache key used to store the mandlebrot workers array.
     *
     * @return {string}
     */
    static get mandlebrotWorkers() {
        return CACHE_KEY__MANDLEBROT_WORKERS;
    }

    /**
     * The cache key used to store the mandlebrot colouring module.
     *
     * @return {string}
     */
    static get mandlebrotColouringModule() {
        return CACHE_KEY__MANDLEBROT_COLOURING_MODULE;
    }

    /**
     * The cache key used to store a collection of remaining line number to calculate.
     *
     * @return {string}
     */
    static get pendingLineNumberPool() {
        return CACHE_KEY__PENDING_LINE_NUMBER_POOL;
    }

    /**
     * The cache key used to store a collection containing the line numbers that have been rendered.
     *
     * @return {string}
     */
    static get completedLineNumberPool() {
        return CACHE_KEY__COMPLETED_LINE_NUMBER_POOL;
    }

    /**
     * The cache key used to store the main canvas's Reach ref.
     *
     * @return {string}
     */
    static get canvasRef() {
        return CACHE_KEY__CANVAS_REF;
    }

    /**
     * The cache key used to store the collection of thumbnail canvas Reach refs.
     *
     * @return {string}
     */
    static get thumbnailCanvasRefs() {
        return CACHE_KEY__THUMBNAIL_CANVAS_REFS;
    }

    /**
     * The cache key used to store the palette.
     *
     * @returns {string}
     */
    static get palette() {
        return CACHE_KEY__PALETTE;
    }

    /**
     * The cache key used to store the mandlebrot palette.
     *
     * @returns {string}
     */
    static get mandlebrotPalette() {
        return CACHE_KEY__MANDLEBROT_PALETTE;
    }
}

const CACHE_KEY__PALETTE = 'CACHE_KEY__PALETTE';
const CACHE_KEY__MANDLEBROT_PALETTE = 'CACHE_KEY__MANDLEBROT_PALETTE';
const CACHE_KEY__ITERATION_DATA_MEMORY = 'CACHE_KEY__ITERATION_DATA_MEMORY';
const CACHE_KEY__ITERATION_DATA_AND_PALETTE_MEMORY = 'CACHE_KEY__ITERATION_DATA_AND_PALETTE_MEMORY';
const CACHE_KEY__IMAGE_DATA = 'CACHE_KEY__IMAGE_DATA';
const CACHE_KEY__MANDLEBROT_WORKERS = 'CACHE_KEY__MANDLEBROT_WORKERS';
const CACHE_KEY__MANDLEBROT_COLOURING_MODULE = 'CACHE_KEY__MANDLEBROT_COLOURING_MODULE';
const CACHE_KEY__PENDING_LINE_NUMBER_POOL = 'CACHE_KEY__PENDING_LINE_NUMBER_POOL';
const CACHE_KEY__COMPLETED_LINE_NUMBER_POOL = 'CACHE_KEY__COMPLETED_LINE_NUMBER_POOL';
const CACHE_KEY__IMAGE_DATA_AND_THUMBNAIL_MEMORY = 'CACHE_KEY__IMAGE_DATA_AND_THUMBNAIL_MEMORY';
const CACHE_KEY__THUMBNAIL_MEMORY = 'CACHE_KEY__THUMBNAIL_MEMORY';
const CACHE_KEY__BOX_SCALE_WORKER = 'CACHE_KEY__BOX_SCALE_WORKER';
const CACHE_KEY__CANVAS_REF = 'CACHE_KEY__CANVAS_REF';
const CACHE_KEY__THUMBNAIL_CANVAS_REFS = 'CACHE_KEY__THUMBNAIL_CANVAS_REFS';
