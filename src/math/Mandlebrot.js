import ComplexNumber from "@ceilingcat/complex-number";

export default class Mandlebrot {

    /**
     * Calculates the number of iterations it takes for Mandlebrot's equation to be considered divergent for a given
     * <code>z0 = x+iy<code>.
     *
     * @param {ComplexNumber} z0
     * @param {number} maxModulus
     * @param {number} maxIterationCount
     *
     * @return {number}
     */
    static execute(z0, maxModulus, maxIterationCount) {
        let iterationCount = 0;
        let zn = ComplexNumber.ZERO

        while (zn.mod < maxModulus && iterationCount < maxIterationCount) {
            zn = zn.power(2).add(z0);
            iterationCount += 1;
        }

        return iterationCount === maxIterationCount ?
            Number.POSITIVE_INFINITY :
            iterationCount;
    }
}
