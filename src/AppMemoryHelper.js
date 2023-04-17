import MemoryHelper from "./helpers/MemoryHelper";
import {
    cachedImageDataAndThumbnailMemory,
    cachedIterationDataAndPaletteMemory,
    cachedIterationDataMemory,
    cachedThumbnailMemory
} from "./AppCache";

const WEB_ASSEMBLY_MEMORY_MAX_PAGES = 1024;

/**
 * The number of bytes per pixel.
 *
 * @param {number} numberOfPoints - the value to convert to bytes
 *
 * @return {number} the number of bytes to store a point (pixel)
 */
const pointsToBytes = (numberOfPoints) => numberOfPoints << 2;

/**
 * How many bytes does it take to store a given number of palette entries?
 *
 * @param {number} numberOfPaletteEntries - the number of palette entries to calculate a byte overhead for
 *
 * @return {number} the number of bytes required
 */
const paletteEntriesToBytes = (numberOfPaletteEntries) => numberOfPaletteEntries << 2;

/**
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @return {number} the number of WebAssembly Memory 64KiB pages required
 */
const iterationDataPagesRequired = numberOfWindowPoints =>
    MemoryHelper.pagesRequired(pointsToBytes(numberOfWindowPoints));

/**
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @param numberOfPaletteEntries - the  number of palette entries we are using to colour the iteration data
 * @return {number} the number of WebAssembly Memory 64KiB pages required
 */
const iterationDataAndPalettePagesRequired = (numberOfWindowPoints, numberOfPaletteEntries) =>
    MemoryHelper.pagesRequired(
        pointsToBytes(numberOfWindowPoints) + paletteEntriesToBytes(numberOfPaletteEntries)
    );

/**
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @param numberOfThumbnailPoints - the number of points (pixels) in a thumbnail
 * @return {number} the number of WebAssembly Memory 64KiB pages required
 */
const imageDataAndThumbnailPagesRequired = (numberOfWindowPoints, numberOfThumbnailPoints) =>
    MemoryHelper.pagesRequired(pointsToBytes(numberOfWindowPoints) + pointsToBytes(numberOfThumbnailPoints));

/**
 *
 * @param numberOfThumbnails - the number of thumbnails to store
 * @param numberOfThumbnailPoints - the number of points (pixels) in a thumbnail
 * @return {number} the number of WebAssembly Memory 64KiB pages required
 */
const thumbnailPagesRequired = (numberOfThumbnails, numberOfThumbnailPoints) =>
    MemoryHelper.pagesRequired(numberOfThumbnails * pointsToBytes(numberOfThumbnailPoints));

/**
 * Creates or resizes the memory used to store the iteration data.
 *
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @return {WebAssembly.Memory} the possibly resized memory instance
 */
const createOrGrowIterationDataMemory = (numberOfWindowPoints) => MemoryHelper.createOrGrow(
    iterationDataPagesRequired(numberOfWindowPoints),
    cachedIterationDataMemory(),
    WEB_ASSEMBLY_MEMORY_MAX_PAGES,
    true,
);

/**
 * Creates or resizes the memory used to store the thumbnails.
 *
 * @param {number} numberOfThumbnails - the number of thumbnails to store
 * @param numberOfThumbnailPoints - the number of points (pixels) in a thumbnail
 * @return {WebAssembly.Memory} the possibly resized memory instance
 */
const createOrGrowThumbnailMemory = (numberOfThumbnails, numberOfThumbnailPoints) => MemoryHelper.createOrGrow(
    thumbnailPagesRequired(numberOfThumbnails, numberOfThumbnailPoints),
    cachedThumbnailMemory(),
    WEB_ASSEMBLY_MEMORY_MAX_PAGES
);

/**
 * Creates or resizes the memory used to store the iteration data and palette.
 *
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @param {number} numberOfPaletteEntries
 * @return {WebAssembly.Memory} the possibly resized memory instance
 */
const createOrGrowIterationDataAndPaletteMemory = (numberOfWindowPoints, numberOfPaletteEntries) =>
    MemoryHelper.createOrGrow(
        iterationDataAndPalettePagesRequired(numberOfWindowPoints, numberOfPaletteEntries),
        cachedIterationDataAndPaletteMemory(),
        WEB_ASSEMBLY_MEMORY_MAX_PAGES
    );

/**
 * Creates or resizes the memory used to store the iteration data and thumbnail memory.
 *
 * @param numberOfWindowPoints - the number of points (pixels) we are rendering
 * @param numberOfThumbnailPoints - the number of points (pixels) in a thumbnail
 * @return {WebAssembly.Memory} the possibly resized memory instance
 */
const createOrGrowImageDataAndThumbnailMemory = (numberOfWindowPoints, numberOfThumbnailPoints) =>
    MemoryHelper.createOrGrow(
        imageDataAndThumbnailPagesRequired(numberOfWindowPoints, numberOfThumbnailPoints),
        cachedImageDataAndThumbnailMemory(),
        WEB_ASSEMBLY_MEMORY_MAX_PAGES,
        true
    );

export {
    createOrGrowIterationDataMemory,
    createOrGrowThumbnailMemory,
    createOrGrowIterationDataAndPaletteMemory,
    createOrGrowImageDataAndThumbnailMemory,
    pointsToBytes
}