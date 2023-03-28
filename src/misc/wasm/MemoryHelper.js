export default class MemoryHelper {

    /**
     * Produces a new memory descriptor object for constructing <code>WebAssembly.Memory</code> objects.
     *
     * @param {number} initial - the initial number of web assembly 64KiB pages
     * @param {number} [maximum=initial] - the maximum number of web assembly 64KiB pages
     * @param {boolean} [shared=false] - is the memory shared?
     *
     * @return {{shared: boolean, initial, maximum}}
     */
    static memoryDescriptor = (initial, maximum = initial, shared = false) =>
        ({initial, maximum, shared});

    /**
     * How many (whole) WebAssembly memory pages are required to store 'numberOfBytes' bytes?
     *
     * @param {number} numberOfBytes - the number of bytes to store
     *
     * @return {number} how many (whole) WebAssembly memory pages required
     */
    static pagesRequired = (numberOfBytes) => Math.ceil(numberOfBytes / WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES);

    /**
     * Grows the memory to have 'totalPagesRequired' pages.
     * <p>
     * Note, <code>memory.grow</code> is not called if the memory already has the required number of pages.
     *
     * @param {WebAssembly.Memory} memory - the memory to grow
     * @param {number} totalPagesRequired - the number of pages required
     *
     * @return {WebAssembly.Memory} the 'memory' argument
     */
    static grow = (memory, totalPagesRequired) => {
        const currentNumberOfPages = memory.buffer.byteLength / WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES;
        const numberOfNewPagesRequired = totalPagesRequired - currentNumberOfPages;
        if (numberOfNewPagesRequired > 0) {
            memory.grow(numberOfNewPagesRequired);
        }
        return memory;
    }

    /**
     * Either grows an existing <code>WebAssembly.Memory</code> or creates a new one.
     *
     * @param {number} requiredNumberOfPages - the required number of WebAssembly pages
     * @param {number} maximumNumberOfPages = 1024 - the maximum number of WebAssembly pages (that the memory can be
     * grown to)
     * @param {boolean} shared = false - if a new <code>WebAssembly.Memory</code> is created, should it be marked as
     * shared?
     * @param {WebAssembly.Memory} memory = undefined - the existing <code>WebAssembly.Memory</code> memory object to
     * grow
     *
     * @return {WebAssembly.Memory} the code>WebAssembly.Memory</code> instance passed in (newly grown) or a newly
     * constructed one
     */
    static createOrGrow = (
        requiredNumberOfPages,
        maximumNumberOfPages = 1024,
        shared = false,
        memory = undefined,
    ) =>
        memory === undefined ?
            MemoryHelper.create(requiredNumberOfPages, maximumNumberOfPages, shared) :
            MemoryHelper.grow(memory, requiredNumberOfPages);

    /**
     * Creates a new <code>WebAssembly.Memory</code> with the specified characteristics.
     *
     * @param {number} requiredNumberOfPages - the required number of WebAssembly pages
     * @param {number} maximumNumberOfPages = 1024 - the maximum number of WebAssembly pages (that the memory can be
     * grown to)
     * @param {boolean} shared = false - if a new <code>WebAssembly.Memory</code> is created, should it be marked as
     * shared?     *
     * @return {WebAssembly.Memory}
     */
    static create = (
        requiredNumberOfPages,
        maximumNumberOfPages = 1024,
        shared = false,
    ) => new WebAssembly.Memory(MemoryHelper.memoryDescriptor(requiredNumberOfPages, maximumNumberOfPages, shared));
}

const WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES = 64 * 1024;