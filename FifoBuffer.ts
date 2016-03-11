/**
 * Implementation of FIFO based on Uint8Array.
 * 
 * @export
 * @class FifoBuffer
 */
export class FifoBuffer {
    /**
     * (description)
     * 
     * @private
     * @type {Uint8Array}
     */
    private buffer: Uint8Array;
    
    /**
     * (description)
     * 
     * @private
     * @type {number}
     */
    private bufferLowIndex: number;
    
    /**
     * (description)
     * 
     * @private
     * @type {number}
     */
    private bufferHighIndex: number;

    /**
     * Creates an instance of FifoBuffer.
     * 
     * @constructor
     */
    public constructor() {
        this.buffer = new Uint8Array(1024);
        this.bufferLowIndex = 0;
        this.bufferHighIndex = 0;
    }

    /**
     * (description)
     * 
     * @param {Uint8Array} data (description)
     * @returns {void} (description)
     */
    public pushback(data: Uint8Array): void {
        if ((this.bufferHighIndex + data.byteLength) > this.buffer.byteLength) {
            var oldBuffer = this.buffer;
            var newSize = this.bufferHighIndex + ((data.byteLength + 1023) / 1024) * 1024;
            this.buffer = new Uint8Array(newSize);
            this.buffer.set(oldBuffer.slice(this.bufferLowIndex, this.bufferHighIndex));
            this.bufferHighIndex = this.bufferHighIndex - this.bufferLowIndex;
            this.bufferLowIndex = 0;
            this.pushback(data);
            return;
        }

        this.buffer.set(data, this.bufferHighIndex);
        this.bufferHighIndex = this.bufferHighIndex + data.byteLength;
    }

    /**
     * (description)
     * 
     * @param {number} num (description)
     * @returns {void} (description)
     */
    public popfront(num: number): void {
        this.bufferLowIndex = this.bufferLowIndex + num;
        if (this.bufferLowIndex >= this.bufferHighIndex) {
            this.bufferHighIndex = 0;
            this.bufferLowIndex = 0;
            return;
        }

        if (this.bufferLowIndex >= 1024)
            this.reduce();
    }

    /**
     * Clear/reinitialize the FifoBuffer
     */
    public clear(): void {
        if (this.buffer.byteLength > 1024)
            this.buffer = new Uint8Array(1024);
        this.bufferLowIndex = 0;
        this.bufferHighIndex = 0;
    }

    /**
     * Reduce the size of FifoBuffer memory usage by moving data to the front of 
     * inner buffer and freeing unused space, if possible and greater than 
     * configured threshold. 
     * 
     * @private
     */
    private reduce(): void {
        this.buffer.copyWithin(0, this.bufferLowIndex, this.bufferHighIndex);
        this.bufferHighIndex = this.bufferHighIndex - this.bufferLowIndex;
        this.bufferLowIndex = 0;
    }

    /**
     * Get FifoBuffer data
     * 
     * @returns {Uint8Array} data
     */
    public get(): Uint8Array {
        return this.buffer.subarray(this.bufferLowIndex, this.bufferHighIndex);
    }

    /**
     * Get length of data in FifoBuffer
     * 
     * @returns {number} length
     */
    public length(): number {
        return this.bufferHighIndex - this.bufferLowIndex;
    }
}
