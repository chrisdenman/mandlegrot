const withIt = (value, f) => f(value);

const VOID = () => {};

const map = (obj, fn) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    );

export {VOID, withIt, map}
