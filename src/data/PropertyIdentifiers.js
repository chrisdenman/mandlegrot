export default class PropertyIdentifiers {
    static get windowWidth() {
        return WINDOW_WIDTH;
    }
    static get windowHeight() {
        return WINDOW_HEIGHT;
    }
    static get worldMinX() {
        return WORLD_MIN_X;
    }
    static get worldMaxX() {
        return WORLD_MAX_X;
    }
    static get worldMinY() {
        return WORLD_MIN_Y;
    }
    static get worldMaxY() {
        return WORLD_MAX_Y;
    }
    static get maxIterations() {
        return ENGINE_MAX_ITERATIONS;
    }
    static get maxModulus() {
        return ENGINE_MAX_MODULUS;
    }

    static get numWorkers() {
        return ENGINE_NUM_WORKERS;
    }
r}

const WINDOW_WIDTH = "windowWidth";
const WINDOW_HEIGHT = "windowHeight";

const WORLD_MIN_X = "worldMinX";
const WORLD_MAX_X = "worldMaxX";
const WORLD_MIN_Y = "worldMinY";
const WORLD_MAX_Y = "worldMaxY";

const ENGINE_MAX_ITERATIONS = "maxIterationCount";
const ENGINE_MAX_MODULUS = "maxModulus";
const ENGINE_NUM_WORKERS = "numWorkers";

