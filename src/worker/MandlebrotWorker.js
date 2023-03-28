const STATE_INITIALISING = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_READY_ERROR = 3;

// noinspection SpellCheckingInspection
export default class MandlebrotWorker extends Worker {

    /**
     * @type {number}
     */
    #state = STATE_INITIALISING;

    /**
     * @type {number}
     */
    #windowY;

    /**
     * @type {number}
     */
    #worldXInc;

    /**
     * @type {number}
     */
    #worldY;

    /**
     * @type {function}
     */
    #onsuccess;

    /**
     * @type {function}
     */
    #oninitialisation;

    /**
     * @type {function}
     */
    #onfailure;

    /**
     * @type {WebAssembly.Memory}
     */
    #memory;

    /**
     * @param {WebAssembly.Memory} memory
     * @param {function} oninitialisation
     * @param {function} onsuccess
     * @param {function} onfailure
     * @return {Worker}
     */
    constructor(memory, oninitialisation, onsuccess, onfailure) {
        super(new URL("MandlebrotTask.js", document.baseURI));
        this.#memory = memory;
        this.#oninitialisation = oninitialisation;
        this.#onsuccess = onsuccess;
        this.#onfailure = onfailure;
    }

    init = () => {
        this.postMessage({type: "init", baseUri: document.baseURI, memory: this.#memory});
    }

    execute(offset, count, worldXStart, worldY, windowY, worldXInc, maxModulus, maxIterationCount) {
        if (this.#state === STATE_READY || this.#state === STATE_READY_ERROR) {
            this.#state = STATE_RUNNING;
            this.#worldY = worldY;
            this.#windowY = windowY;
            this.#worldXInc = worldXInc;
            /**
             * @type {WasmWorkerMessageData}
             */
            this.postMessage({
                type: "execute",
                offset,
                count,
                x0: worldXStart,
                y0: worldY,
                xInc: worldXInc,
                maxModulus,
                maxIterationCount
            });
        }
    }

    onmessage = (message) => {
        /**
         * @type {WasmWorkerStatusMessage}
         */
        const MANDLEBROT_WORKER_STATUS_MESSAGE = message.data;
        if (MANDLEBROT_WORKER_STATUS_MESSAGE.type === "initialised") {
            this.#state = STATE_READY;
            this.#oninitialisation(this);
        } if (MANDLEBROT_WORKER_STATUS_MESSAGE.type === "completed") {
            this.#state = STATE_READY;
            this.#onsuccess(this);
        }
    };

    /**
     * @return {boolean}
     */
    get isReady() {
        return this.#state === STATE_READY || this.#state === STATE_READY_ERROR;
    }

    /**
     * @return {number}
     */
    get windowY() {
        return this.#windowY;
    }
}