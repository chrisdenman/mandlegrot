import MemoryHelper from "../MemoryHelper";
describe(
    "Memory Helper Tests",
    () => {
        it(
            "That memory descriptors contain the specified initial and maximum values",
            () => {
                const initial = 2;
                const maximum = 3;
                const descriptor = MemoryHelper.memoryDescriptor(initial, maximum)
                expect(descriptor.initial).toBe(initial);
                expect(descriptor.maximum).toBe(maximum);
            }
        );

        it(
            "That memory descriptors default to non-shared by default",
            () => {
                expect(MemoryHelper.memoryDescriptor(1, 1).shared).toBe(false);
            }
        );

        it(
            "That memory descriptors preserve the shared property",
            () => {
                expect(MemoryHelper.memoryDescriptor(1, 1, true).shared).toBe(true);
            }
        );

        it(
            "That the pages required returns at least 1",
            () => {
                expect(MemoryHelper.pagesRequired(0)).toBe(1);
            }
        );

        it.each`
        bytesRequired       | expectedPages                 
        ${-1}               | ${1}
        ${0}                | ${1}
        ${1}                | ${1}
        ${1.1}              | ${1}
        ${64 * 1024}        | ${1}
        ${64 * 1024 + 1}    | ${2}
        `(
            `Testing the calculation of pages required`,
            ({bytesRequired, expectedPages}) =>
                expect(MemoryHelper.pagesRequired(bytesRequired)).toBe(expectedPages)
        )
    }
);
