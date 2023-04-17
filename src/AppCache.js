// noinspection JSValidateTypes

import Cache from "./helpers/Cache";
import AppCacheKeyNames from "./AppCacheKeyNames";
import React from "react";

const cache = new Cache();

/**
 * @param {String} key - the cache entry's key
 */
const getValue = (key) => cache.get(key);

/**
 * Sets a new value in the cache.
 *
 * @param key - the identifier to bind the value to
 * @param {*} value - the value to store
 * @return {*} the value passed in
 */
const setCacheValue = (key, value) => {
    cache.set(key, value);
    return value;
}

const setCacheValueIfAbsent = (key, value) => {
    if (!cacheHasKey(key)) {
        cache.set(key, value);
    }
    return value;
}

/**
 * @param {[string, *][]} entries
 */
const setCacheValues = (entries) => entries.forEach(([key, value]) => setCacheValue(key, value));

/**
 * Does the cache contain a key with the given name?
 *
 * @param {string} key - the name of the key to check
 * @return {boolean}
 */
const cacheHasKey = (key) => cache.has(key);

/**
 * @return {BoxScaleWorker}
 */
const cachedBoxScaleWorker = () => getValue(AppCacheKeyNames.boxScaleWorker);

/**
 * @return {React.RefObject<HTMLCanvasElement>}
 */
const cachedCanvasRef = () => getValue(AppCacheKeyNames.canvasRef);

/**
 * @return {Set<number>}
 */
const cachedCompletedTaskPool = () => getValue(AppCacheKeyNames.completedLineNumberPool);

/**
 * @return {ImageData}
 */
const cachedImageData = () => getValue(AppCacheKeyNames.imageData);

/**
 * @return {WebAssembly.Memory}
 */
const cachedImageDataAndThumbnailMemory = () => getValue(AppCacheKeyNames.imageDataAndThumbnailMemory);

/**
 * @return {WebAssembly.Memory}
 */
const cachedIterationDataAndPaletteMemory = () => getValue(AppCacheKeyNames.iterationDataAndPaletteMemory);

/**
 * @return {WebAssembly.Memory}
 */
const cachedIterationDataMemory = () => getValue(AppCacheKeyNames.iterationDataMemory);

/**
 * @return {Instance}
 */
const cachedMandlebrotColouringModule = () => getValue(AppCacheKeyNames.mandlebrotColouringModule);

/**
 * @return {MandlebrotWorker[]}
 */
const cachedMandlebrotWorkers = () => getValue(AppCacheKeyNames.mandlebrotWorkers);

/**
 * @return {Set<number>}
 */
const cachedPendingLineNumberPool = () => getValue(AppCacheKeyNames.pendingLineNumberPool);

/**
 * @return {React.RefObject<HTMLCanvasElement>[]}
 */
const cachedThumbnailCanvasRefs = () => getValue(AppCacheKeyNames.thumbnailCanvasRefs);

/**
 * @return {WebAssembly.Memory}
 */
const cachedThumbnailMemory = () => getValue(AppCacheKeyNames.thumbnailMemory);

/**
 * @return {Palette}
 */
const cachedPalette = () => getValue(AppCacheKeyNames.palette);

/**
 * @return {Palette}
 */
const cachedMandlebrotPalette = () => getValue(AppCacheKeyNames.mandlebrotPalette);

export {
    cacheHasKey,
    cachedBoxScaleWorker,
    cachedCanvasRef,
    cachedCompletedTaskPool,
    cachedImageData,
    cachedImageDataAndThumbnailMemory,
    cachedIterationDataAndPaletteMemory,
    cachedIterationDataMemory,
    cachedMandlebrotColouringModule,
    cachedMandlebrotWorkers,
    cachedPalette,
    cachedMandlebrotPalette,
    cachedPendingLineNumberPool,
    cachedThumbnailCanvasRefs,
    cachedThumbnailMemory,
    setCacheValue,
    setCacheValueIfAbsent,
    setCacheValues
};