import {StateMachine} from "@ceilingcat/state-machine";
import {IMMUTABLE_EMPTY_SET} from "@ceilingcat/collections";
import StringStateHelper from "../../state/StringStateHelper";

/**
 * @param {function} startTransitionHandler
 * @param {function} endTransitionHandler
 * @return {StateMachine}
 */
const BoxScaleStateMachineConstructor = (startTransitionHandler, endTransitionHandler) => new StateMachine(
    BoxScaleInputs.all,
    BoxScaleStates.all,
    BoxScaleStates.created,
    new Map([
        StringStateHelper.createTransition(BoxScaleStates.created, BoxScaleInputs.initialise, BoxScaleStates.initialising),
        StringStateHelper.createTransition(BoxScaleStates.initialising, BoxScaleInputs.workerTaskInitialised, BoxScaleStates.initialised),
        StringStateHelper.createTransition(BoxScaleStates.initialised, BoxScaleInputs.execute, BoxScaleStates.activated),
        StringStateHelper.createTransition(BoxScaleStates.activated, BoxScaleInputs.workerTaskCompleted, BoxScaleStates.completed),
        StringStateHelper.createTransition(BoxScaleStates.completed, BoxScaleInputs.initialise, BoxScaleStates.initialising),
    ]),
    IMMUTABLE_EMPTY_SET,
    startTransitionHandler,
    endTransitionHandler
);

class BoxScaleStates {

    /**
     *
     * @return {string}
     */
    static get created() {
        return BOX_SCALE_STATE__CREATED;
    }

    static get initialising() {
        return BOX_SCALE_STATE__INITIALISING;
    }

    static get initialised() {
        return BOX_SCALE_STATE__INITIALISED;
    }

    static get activated() {
        return BOX_SCALE_STATE__ACTIVATED;
    }

    static get completed() {
        return BOX_SCALE_STATE__COMPLETED;
    }

    static get all() {
        return ALL_STATES;
    }
}

const BOX_SCALE_STATE__CREATED = "BOX_SCALE_STATE__CREATED";
const BOX_SCALE_STATE__INITIALISING = "BOX_SCALE_STATE__INITIALISING";
const BOX_SCALE_STATE__INITIALISED = "BOX_SCALE_STATE__INITIALISED";
const BOX_SCALE_STATE__ACTIVATED = "BOX_SCALE_STATE__ACTIVATED";
const BOX_SCALE_STATE__COMPLETED = "BOX_SCALE_STATE__COMPLETED";

const ALL_STATES = new Set([
    BoxScaleStates.created,
    BoxScaleStates.initialising,
    BoxScaleStates.initialised,
    BoxScaleStates.activated,
    BoxScaleStates.completed,
]);

class BoxScaleInputs {

    /**
     * Sent by the app to initialise the WASM module.
     *
     * @return {string}
     */
    static get initialise() {
        return BOX_SCALE_INPUT__INITIALISE;
    }

    static get workerTaskInitialised() {
        return BOX_SCALE_INPUT__WORKER_TASK_INITIALISED;
    }

    /**
     * Sent by the app to start the scaling operation.
     *
     * @return {string}
     */
    static get execute() {
        return BOX_SCALE_INPUT__EXECUTE;
    }

    /**
     * Sent by the Worker task to signal the completion of the scaling operation.
     *
     * @return {string}
     */
    static get workerTaskCompleted() {
        return BOX_SCALE_INPUT__WORKER_TASK_COMPLETED;
    }

    static get all() {
        return ALL_INPUTS;
    }
}

const BOX_SCALE_INPUT__INITIALISE = "BOX_SCALE_INPUT__INITIALISE";
const BOX_SCALE_INPUT__WORKER_TASK_INITIALISED = "BOX_SCALE_INPUT__WORKER_TASK_INITIALISED";
const BOX_SCALE_INPUT__EXECUTE = "BOX_SCALE_INPUT__EXECUTE";
const BOX_SCALE_INPUT__WORKER_TASK_COMPLETED = "BOX_SCALE_INPUT__WORKER_TASK_COMPLETED";

const ALL_INPUTS = new Set([
    BoxScaleInputs.initialise,
    BoxScaleInputs.workerTaskInitialised,
    BoxScaleInputs.execute,
    BoxScaleInputs.workerTaskCompleted,
]);

export {BoxScaleStateMachineConstructor, BoxScaleStates, BoxScaleInputs};