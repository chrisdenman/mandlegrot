import {StateMachine} from "@ceilingcat/state-machine";
import {IMMUTABLE_EMPTY_SET} from "@ceilingcat/collections";
import MandlebrotEngineEvents from "./MandlebrotEngineEvents";
import MandlebrotEngineStates from "./MandlebrotEngineStates";
import StringStateHelper from "../StringStateHelper";

/**
 * @param {function} startTransitionHandler
 * @param {function} [endTransitionHandler=undefined]
 * @return {StateMachine}
 */
const MANDLEBROT_ENGINE_STATE_MACHINE_CONSTRUCTOR = (startTransitionHandler, endTransitionHandler) => new StateMachine(
    MandlebrotEngineEvents.all,
    MandlebrotEngineStates.all,
    MandlebrotEngineStates.created,
    new Map(
        [
            StringStateHelper.createTransition(MandlebrotEngineStates.created, MandlebrotEngineEvents.initialiseCalculations, MandlebrotEngineStates.initialisingCalculations),
            StringStateHelper.createTransition(MandlebrotEngineStates.initialisingCalculations, MandlebrotEngineEvents.calculationInitialised, MandlebrotEngineStates.calculating),
            StringStateHelper.createTransition(MandlebrotEngineStates.calculating, MandlebrotEngineEvents.calculationFinished, MandlebrotEngineStates.initialisingColourMapping),
            StringStateHelper.createTransition(MandlebrotEngineStates.initialisingColourMapping, MandlebrotEngineEvents.colouringInitialised, MandlebrotEngineStates.colourMapping),
            StringStateHelper.createTransition(MandlebrotEngineStates.colourMapping, MandlebrotEngineEvents.colouringFinished, MandlebrotEngineStates.initialisingThumbnailGeneration),
            StringStateHelper.createTransition(MandlebrotEngineStates.initialisingThumbnailGeneration, MandlebrotEngineEvents.thumbnailGenerationInitialised, MandlebrotEngineStates.thumbnailGeneration),
            StringStateHelper.createTransition(MandlebrotEngineStates.thumbnailGeneration, MandlebrotEngineEvents.thumbnailGenerationFinished, MandlebrotEngineStates.copyingThumbnail),
            StringStateHelper.createTransition(MandlebrotEngineStates.copyingThumbnail, MandlebrotEngineEvents.thumbnailCopied, MandlebrotEngineStates.finished),

            StringStateHelper.createTransition(MandlebrotEngineStates.finished, MandlebrotEngineEvents.initialiseCalculations, MandlebrotEngineStates.initialisingCalculations),
            StringStateHelper.createTransition(MandlebrotEngineStates.finished, MandlebrotEngineEvents.paletteChange, MandlebrotEngineStates.recolouring),
            StringStateHelper.createTransition(MandlebrotEngineStates.recolouring, MandlebrotEngineEvents.colouringFinished, MandlebrotEngineStates.finished),
        ]
    ),
    IMMUTABLE_EMPTY_SET,
    startTransitionHandler,
    endTransitionHandler
);

export default MANDLEBROT_ENGINE_STATE_MACHINE_CONSTRUCTOR;
