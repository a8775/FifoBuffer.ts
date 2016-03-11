import assert = require('assert');
import chai = require('chai');
var expect = chai.expect;

import {FifoBuffer} from '../FifoBuffer';

describe('FifoBuffer.ts tests...', function() {

    describe('Test constructor', function() {
        let b: FifoBuffer = new FifoBuffer();

        it('should be empty', function() {
            expect(b.length()).to.be.equal(0);
        });
    });
});

