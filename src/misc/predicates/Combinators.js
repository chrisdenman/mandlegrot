const and = (...predicates) =>
    ((...params) => predicates.reduce((acc, param) => acc && param(...params), predicates.length > 0));

const not = (predicate) => (...params) => !predicate(...params);

const compose =
    (...functions) =>
        ((reversed = functions
            .slice()
            .reverse()) =>
            (...args) =>
                reversed
                    .slice(1)
                    .reduce((acc, f) =>
                        f(acc), reversed[0](...args)))();
const bind = (f, ...v) => f.bind(undefined, ...v);

export {
    and,
    not,
    compose,
    bind
}