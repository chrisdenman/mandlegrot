export default class BoxScaleImage {

    /**
     *
     * @param {Uint8ClampedArray} sourceData
     * @param {number} sourceWidth
     * @param {number} sourceHeight
     * @param {number} targetWidth
     * @param {number} targetHeight
     * @return {ImageData}
     */
    static scale = (
        sourceData,
        sourceWidth,
        sourceHeight,
        targetWidth,
        targetHeight
    ) => {
        const scaleX = sourceWidth / targetWidth;
        const scaleY = sourceHeight / targetHeight;
        const numPixels = targetWidth * targetHeight;
        const data = new Uint8ClampedArray(numPixels << 2);
        for (let i = 0; i < numPixels; i++) {
            const destCoordinates = {x: i % targetWidth, y: Math.floor(i / targetWidth)}
            const average = BoxScaleImage.#average(
                sourceData,
                sourceWidth,
                Math.floor(destCoordinates.x * scaleX),
                Math.floor(destCoordinates.y * scaleY),
                Math.floor(scaleX),
                Math.floor(scaleY)
            );
            const byteOffset = i << 2;
            data[byteOffset] = (average >> 24) & 255;
            data[byteOffset + 1] = (average >> 16) & 255;
            data[byteOffset + 2] = (average >> 8) & 255;
            data[byteOffset + 3] = 255;
        }

        return new ImageData(data, targetWidth);
    }

    /**
     *
     * @param {Uint8ClampedArray} imageData
     * @param {number} imageWidth
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    static #average = (imageData, imageWidth, x, y, w, h) => {
        let averageR = 0;
        let averageG = 0;
        let averageB = 0;
        let averageA = 0;
        const numSamples = w * h;
        for (let xO = x; xO <= x + w - 1; xO++) {
            for (let yO = y; yO <= y + h - 1; yO++) {
                const byteOffset = (yO * imageWidth + xO) << 2;
                averageR = averageR + imageData[byteOffset] / numSamples;
                averageG = averageG + imageData[byteOffset + 1] / numSamples;
                averageB = averageB + imageData[byteOffset + 2] / numSamples;
                averageA = averageA + imageData[byteOffset + 3] / numSamples;
            }
        }

        return (averageR << 24) + (averageG << 16) + (averageB << 8) + averageA
    }
}


