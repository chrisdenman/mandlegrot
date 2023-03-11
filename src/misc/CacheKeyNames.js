export default class CacheKeyNames {

    /**
     * The name of the cache key used to store iteration data.
     *
     * @return {string}
     */
    static get iterationData() {
        return ITERATION_DATA;
    }

    /**
     * The name of the cache key used to store image data.
     *
     * @return {string}
     */
    static get imageData() {
        return IMAGE_DATA;
    }
}

const ITERATION_DATA = 'iterationData';
const IMAGE_DATA = 'imageData';
