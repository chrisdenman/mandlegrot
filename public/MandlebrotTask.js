const WASM_WORKER_STATUS_MESSAGE__INITIALISED = "initialised";
const WASM_WORKER_STATUS_MESSAGE__COMPLETED = "completed";

const WASM_WORKER_EVENT_TYPE__INIT = "init";
const WASM_WORKER_EVENT_TYPE__EXECUTE = "execute";

/**
 * @type {Instance}
 */
self.wasmModule = undefined;

/**
 * @param {WasmWorkerMessageData} data
 */
self.init = (data) => {
    WebAssembly.instantiateStreaming(
        fetch(new URL("Mandlebrot.wasm", data.baseUri)),
        {env: {iterationData: data.memory}}
    ).then((webAssemblyInstantiatedSource) => {
        self.wasmModule = webAssemblyInstantiatedSource.instance;
        postMessage({type: WASM_WORKER_STATUS_MESSAGE__INITIALISED});
    })
};


/**
 * @param {WasmWorkerMessageData} data
 */
self.execute = (data) => {
    // noinspection JSValidateTypes
    /**
     * @type {MandlebrotExports}
     */
    const mandlebrotExports = self.wasmModule.exports;
    mandlebrotExports.mandlebrotLine(
        data.offset,
        data.count,
        data.x0,
        data.y0,
        data.xInc,
        data.maxModulusSquared,
        data.maxIterationCount
    );
    postMessage({type: WASM_WORKER_STATUS_MESSAGE__COMPLETED});
};

self.addEventListener('message', event => {
    /**
     * @type {WasmWorkerMessageData} data
     */
    const MESSAGE_DATA = event.data;
    if (MESSAGE_DATA.type === WASM_WORKER_EVENT_TYPE__INIT) {
        init(MESSAGE_DATA);
    } else if (MESSAGE_DATA.type === WASM_WORKER_EVENT_TYPE__EXECUTE) {
        execute(MESSAGE_DATA)
    }
});

/**
 * @typedef MandlebrotExports
 * @property {MandlebrotLineFunction} mandlebrotLine
 */

/**
 * @callback MandlebrotLineFunction
 * @param {number} offset
 * @param {number} count
 * @param {number} x0
 * @param {number} y0
 * @param {number} xInc
 * @param {number} maxModulus
 * @param {number} maxIterationCount
 */

/**
 * @typedef WasmWorkerMessageData
 * @property {string} type
 * @property {string} [baseUri]
 * @property {WebAssembly.Memory} [memory]
 * @property {number} [offset]
 * @property {number} [count]
 * @property {number} [x0]
 * @property {number} [y0]
 * @property {number} [xInc]
 * @property {number} [maxModulusSquared]
 * @property {number} [maxIterationCount]
 */

/**
 * @typedef WasmWorkerStatusMessage
 * @property {string} type
 */