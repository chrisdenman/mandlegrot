const BOX_SCALE_TASK_EVENT_TYPE__INITIALISE = "initialise";
const BOX_SCALE_TASK_EVENT_TYPE__EXECUTE = "execute";
const BOX_SCALE_TASK_EVENT_TYPE__INITIALISED = "initialised";
const BOX_SCALE_TASK_EVENT_TYPE__COMPLETED = "completed";

/**
 * @type {WebAssembly.Instance}
 */
self.wasmModule = undefined;

/**
 * @type {string}
 */
self.baseUri = undefined;

/**
 * @type {RawBoxScaleTaskEvent}
 */
self.initialisedEvent = {type: BOX_SCALE_TASK_EVENT_TYPE__INITIALISED};

/**
 * @type {RawBoxScaleTaskEvent}
 */
self.completedEvent = {type: BOX_SCALE_TASK_EVENT_TYPE__COMPLETED};

self.wasmResponse = undefined;

/**
 * @param {BoxScaleInitEvent} event
 */
self.init = ({baseUri}) => {
    fetch(new URL("BoxScale.wasm", baseUri)).then(response => {
        self.wasmResponse = response;
        postMessage(self.initialisedEvent);
    });
};

/**
 * @param {BoxScaleExecuteEvent} event
 */
self.execute = ({
                    imageAndThumbnailMemory,
                    sourceWidthPixels,
                    sourceHeightPixels,
                    targetWidthPixels,
                    targetHeightPixels
                }) => {
    WebAssembly
        .instantiateStreaming(
            self.wasmResponse,
            {env: {imageAndThumbnail: imageAndThumbnailMemory}}
        )
        .then(
            (webAssemblyInstantiatedSource) => {
                self.wasmModule = webAssemblyInstantiatedSource.instance;
                self.wasmModule.exports.boxScale(sourceWidthPixels, sourceHeightPixels, targetWidthPixels, targetHeightPixels);
                postMessage(self.completedEvent);
            })
};

self.addEventListener('message', event => {
    /**
     * @type {RawBoxScaleTaskEvent}
     */
    const eventData = event.data;
    const eventType = eventData.type;
    if (eventType === BOX_SCALE_TASK_EVENT_TYPE__INITIALISE) {
        init(eventData);
    } else if (eventType === BOX_SCALE_TASK_EVENT_TYPE__EXECUTE) {
        execute(eventData)
    }
});

/**
 * @typedef ImageScalingExports
 * @property {BoxScaleFunction} boxScale
 */

/**
 * @callback BoxScaleFunction
 * @param {number} sourceWidthPixels
 * @param {number} sourceHeightPixels
 * @param {number} targetWidthPixels
 * @param {number} targetHeightPixels
 */

/**
 * @typedef RawBoxScaleTaskEvent
 * @property {"initialise"|"initialised"|"execute"|"completed"} type
 */

/**
 * @typedef BoxScaleInitEvent
 * @property {"initialise"} type -
 * @property {string} baseUri -
 */

/**
 * @typedef BoxScaleExecuteEvent
 * @property {"execute"} type -
 * @property {WebAssembly.Memory} imageAndThumbnailMemory -
 * @property {number} sourceWidthPixels - the source image width in pixels
 * @property {number} sourceHeightPixels - the source image height in pixels
 * @property {number} targetWidthPixels - the target image width in pixels
 * @property {number} targetHeightPixels - the target image width in pixels
 */