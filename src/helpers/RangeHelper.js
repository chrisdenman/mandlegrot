/**
 * Miscellaneous range helper functions.
 */
export default class RangeHelper {

    /**
     * Constrains (clamps) a value between two values inclusively.
     *
     * @param {number} lowerBound - the lower number to clamp the value at
     * @param {number} upperBound - the upper number to clamp the value at
     * @param {number} value - the value to constrain
     *
     * @returns {number} if <code>value &lt; lowerBound</code>, then <code>lowerBound</code>, else,
     * if <code>value &gt; upperBound</code>, then <code>upperBound</code>, else, <code>value</code>.
     *
     * @throws {Error} if 'lowerBound' is greater than 'upperBound'
     */
    static closedConstrain(lowerBound, upperBound, value) {
        let constrainedValue = lowerBound;

        if (lowerBound < upperBound) {
            constrainedValue = value < lowerBound ?
                lowerBound :
                (value > upperBound ?
                        upperBound :
                        value
                );
        } else if (lowerBound > upperBound) {
            throw new Error(`The lower bound (${lowerBound}) must not exceed the upper bound (${upperBound}).`);
        }

        return constrainedValue;
    }
}