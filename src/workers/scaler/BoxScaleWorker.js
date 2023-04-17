import {BoxScaleStateMachineConstructor, BoxScaleStates, BoxScaleInputs} from "./BoxScaleStateMachine";
import {StateMachine} from "@ceilingcat/state-machine";
import {VOID} from "../../helpers/ScopeHelper";

const BOX_SCALE_TASK_EVENT__INITIALISE = "initialise";
const BOX_SCALE_TASK_EVENT__EXECUTE = "execute";

const BOX_SCALE_TASK_MESSAGE_TYPE__INITIALISED = "initialised";
const BOX_SCALE_TASK_MESSAGE_TYPE__COMPLETED = "completed";

/**
 * @typedef BoxScaleWorkerExecutionRequest
 * @property {WebAssembly.Memory} imageAndThumbnailMemory - the shared memory containing the image to resize and to store the thumbnail
 * @property {number} sourceWidthPixels - the source image width in pixels
 * @property {number} sourceHeightPixels - the source image height in pixels
 * @property {number} targetWidthPixels - the target image width in pixels
 * @property {number} targetHeightPixels - the target image width in pixels
 */

export default class BoxScaleWorker extends Worker {

    /**
     * @type {BoxScaleWorkerExecutionRequest}
     */
    #boxScaleWorkerExecutionRequest;

    /**
     * @type {StateMachine}
     */
    #stateMachine;

    /**
     * @type {function}
     */
    #onCompleted;

    /**
     * @type {function}
     */
    #onInitialised;

    /**
     * @param {function} onInitialised
     * @param {function} onCompleted
     * @return {Worker}
     */
    constructor(onInitialised, onCompleted) {
        super(new URL("BoxScaleTask.js", document.baseURI));
        this.#onInitialised = onInitialised;
        this.#onCompleted = onCompleted;
        this.#stateMachine = BoxScaleStateMachineConstructor(VOID, this.#endTransitionHandler);
    }

    initialise = () => {
        this.#stateMachine = this.#stateMachine.provide(BoxScaleInputs.initialise);
    }

    /**
     * @param {BoxScaleWorkerExecutionRequest} boxScaleWorkerExecutionRequest
     */
    execute(boxScaleWorkerExecutionRequest) {
        this.#boxScaleWorkerExecutionRequest = boxScaleWorkerExecutionRequest;
        this.#stateMachine = this.#stateMachine.provide(BoxScaleInputs.execute);
    }

    #endTransitionHandler = (currentState, input, lastState) => {
        if (currentState === BoxScaleStates.initialising) {
            this.postMessage({
                type: BOX_SCALE_TASK_EVENT__INITIALISE,
                baseUri: document.baseURI
            });
        } else if (currentState === BoxScaleStates.initialised) {
            this.#onInitialised();
        } else if (currentState === BoxScaleStates.activated) {
            this.postMessage({
                type: BOX_SCALE_TASK_EVENT__EXECUTE,
                ...this.#boxScaleWorkerExecutionRequest
            });
        } else if (currentState === BoxScaleStates.completed) {
            this.#onCompleted();
        }
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * A message has been received by the worker task.
     *
     * @param message
     */
    onmessage = (message) => {
        /**
         * @type {WasmWorkerStatusMessage}
         */
        const BOX_SCALE_WORKER_MESSAGE = message.data;
        if (BOX_SCALE_WORKER_MESSAGE.type === BOX_SCALE_TASK_MESSAGE_TYPE__INITIALISED) {
            this.#stateMachine = this.#stateMachine.provide(BoxScaleInputs.workerTaskInitialised);
        } if (BOX_SCALE_WORKER_MESSAGE.type === BOX_SCALE_TASK_MESSAGE_TYPE__COMPLETED) {
            this.#stateMachine = this.#stateMachine.provide(BoxScaleInputs.workerTaskCompleted);
        }
    };
}
