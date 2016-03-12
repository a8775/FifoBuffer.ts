
/**
 * FifoBuffer exception type
 * 
 * @export
 * @class FifoBufferException
 * @implements {Error}
 */
export class FifoBufferException implements Error {
    public name: string = "FifoBufferException";
    public message: string = "";

    constructor(m: string) {
        this.message = m;
    }

    public toString(): string {
        return "{" + this.name + ": " + this.message + "}";
    }
}

/**
 * Implementation of FIFO based on Uint8Array.
 * 
 * @export
 * @class FifoBuffer
 */
export class FifoBuffer {
    /**
     * Actual buffer to store data
     * 
     * @private
     * @type {Uint8Array}
     */
    private buffer: Uint8Array;

    /**
     * Low index where data starts in buffer
     * 
     * @private
     * @type {number}
     */
    private bufferLowIndex: number;

    /**
     * High index where data ends in buffer
     * 
     * @private
     * @type {number}
     */
    private bufferHighIndex: number;

    /**
     * Critical value for the bufferHighIndex that will thow FifoBufferException if reached.
     * Default bufferCriticalIndex value 100000 
     * 
     * @private
     * @type {number}
     */
    private bufferCriticalIndex: number;

    /**
     * Creates an instance of FifoBuffer.
     * 
     * @constructor
     */
    public constructor() {
        this.buffer = new Uint8Array(1024);
        this.bufferLowIndex = 0;
        this.bufferHighIndex = 0;
        this.bufferCriticalIndex = 100000;
    }

    /**
     * Check index n is in data range of FifoBuffer.
     * 
     * @param  {number} n
     */
    private assertIDX(n: number): void {
        if (n < 0)
            throw new FifoBufferException("Index out of range: index has to be greater than 0!");
        if ((this.bufferLowIndex + n) > this.bufferHighIndex)
            throw new FifoBufferException("Index out of range: index has to be lower than length!");
    }

    private assertOVERFLOW(): void {
        if (this.bufferHighIndex > this.buffer.byteLength)
            throw new FifoBufferException("FifoBuffer overflow error!");
    }

    /**
     * Check if critical bufferHighIndex value has been reached.
     * 
     * @private
     */
    private assertCRITICAL(): void {
        if (this.bufferHighIndex > this.bufferCriticalIndex)
            throw new FifoBufferException("Critical size of FifoBuffer has been reached!");
    }

    /**
     * Push data to the end of FifoBuffer
     * 
     * @param {Uint8Array} data data to be pushed
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
        }
        else {
            this.buffer.set(data, this.bufferHighIndex);
            this.bufferHighIndex = this.bufferHighIndex + data.byteLength;
        }

        this.assertCRITICAL();
        this.assertOVERFLOW();
    }

    /**
     * Pop from front of FifoBuffer
     * 
     * @param {number} num number of bytes to pop from front of FifoBuffer
     * @returns {Uint8Array} resulting buffer
     */
    public popfront(num: number): Uint8Array {
        this.assertIDX(num);
        let ret = this.buffer.subarray(this.bufferLowIndex, this.bufferLowIndex + num);
        this.bufferLowIndex = this.bufferLowIndex + num;
        if (this.bufferLowIndex >= this.bufferHighIndex) {
            this.bufferHighIndex = 0;
            this.bufferLowIndex = 0;
        }

        if (this.bufferLowIndex >= 1024)
            this.reduce();

        return ret;
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
     * 
     * TODO: shoud reduse the size od FifoBuffer, need to add sepecial parameter 
     * for threshold when freeing memory. 
     */
    public reduce(): void {
        this.buffer.copyWithin(0, this.bufferLowIndex, this.bufferHighIndex);
        this.bufferHighIndex = this.bufferHighIndex - this.bufferLowIndex;
        this.bufferLowIndex = 0;
    }

    /**
     * Peek reange of data from FifoBuffer
     * 
     * @param {number} start start position of peeked range of data
     * @param {number} end end position od peeked range of data
     * @returns {Uint8Array} resulting buffer
     */
    public peek(start: number, end: number): Uint8Array;
    /**
     * Peek a byte from FifoBuffer 
     * 
     * @param {number} idx index position of requested  byte
     * @returns {number} resulting data (byte)
     */
    public peek(idx: number): number;
    /**
     * Peek all data from FifoBuffer
     * 
     * @returns {Uint8Array} resulting buffer
     */
    public peek(): Uint8Array;
    public peek(idx?: any, end?: any): number | Uint8Array {
        if (idx === undefined)
            return this.buffer.subarray(this.bufferLowIndex, this.bufferHighIndex);
        if (typeof idx !== "number")
            throw new FifoBufferException("Unsupportet type in method peek for idx!");

        this.assertIDX(idx);
        if (end === undefined)
            return this.buffer[this.bufferLowIndex + idx];
        if (typeof end !== "number")
            throw new FifoBufferException("Unsupportet type in method peek for idx!");

        this.assertIDX(end);
        return this.buffer.subarray(this.bufferLowIndex + idx, this.bufferLowIndex + end);
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
