import ComplexNumber from "@ceilingcat/complex-number";

export default class Mandlebrot {

    /**
     * Calculates the number of iterations it takes for Mandlebrot's equation to be considered non-divergent for a given
     * complex number: <code>z0=x+iy<code>.
     * <p>
     * A complex number is considered not divergent if it takes less than 'maxIterations' iterations of Mandlebrot's
     * equation before its modulus exceeds or is equal to 'maxModulus'.
     *
     * @param {ComplexNumber} z0 - the complex number to iterate
     * @param {number} maxModulus - the maximum modulus
     * @param {number} maxIterationCount - the maximum number of iterations
     * divergent
     *
     * @return {number} <code>Number.POSITIVE_INFINITY</code> if the given complex number diverges else,
     * the number of iterations
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
