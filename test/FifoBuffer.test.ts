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

    describe('Test size of single pushed data', function() {
        let b: FifoBuffer = new FifoBuffer();
        b.pushback( new Uint8Array(5));

        it('length should be 5', function() {
            expect(b.length()).to.be.equal(5);
        });
    });
        
    describe('Test size of two pushed data', function() {
        let b: FifoBuffer = new FifoBuffer();
        b.pushback( new Uint8Array(5));
        b.pushback( new Uint8Array(4));
        it('length should be 9', function() {
            expect(b.length()).to.be.equal(9);
        });
    });
    
    describe('Test pushed data', function() {
        let b: FifoBuffer = new FifoBuffer();
        let l = 10000;
        for(let i=0;i<l;i++){
            let v = new Uint8Array(1);
            v[0] = i%256;
            b.pushback(v);
        }
        it('data should be equal idx%256', function() {
            let a = b.peek();
            for(let j=0;j<l;j++) {
                expect(a[j]).to.be.equal(j%256);
            }
        });
        it('length should be ' + l, function() {
            expect(b.length()).to.be.equal(l);
        });
        it('b[0] should be 0', function() {
            expect(b.peek()[0]).to.be.equal(0);
        });
        it('b[100] should be 100', function() {
            expect(b.peek()[100]).to.be.equal(100);
        });
        it('b[256] should be 0', function() {
            expect(b.peek()[256]).to.be.equal(0);
        });
    });

    describe('Test size of push and pop data', function() {
        let b: FifoBuffer = new FifoBuffer();
        b.pushback( new Uint8Array(5));
        b.pushback( new Uint8Array(4));
        b.popfront(5);
        it('length should be 4', function() {
            expect(b.length()).to.be.equal(4);
        });
    });
    
    describe('Test size of push, pop data and reduce', function() {
        let b: FifoBuffer = new FifoBuffer();
        b.pushback( new Uint8Array(5));
        b.pushback( new Uint8Array(4));
        b.popfront(5);
        b.reduce();
        it('length should be 4', function() {
            expect(b.length()).to.be.equal(4);
        });
    });
    
    describe('Test size of push and clear', function() {
        let b: FifoBuffer = new FifoBuffer();
        b.pushback( new Uint8Array(5));
        b.clear();
        it('length should be 0', function() {
            expect(b.length()).to.be.equal(0);
        });
    });
    
    describe('Test peek(idx) data', function() {
        let b: FifoBuffer = new FifoBuffer();
        let l = 1000;
        for(let i=0;i<l;i++){
            let v = new Uint8Array(1);
            v[0] = i%256;
            b.pushback(v);
        }
        it('length should be ' + l, function() {
            expect(b.length()).to.be.equal(l);
        });
        it('data should be equal idx%256', function() {
            let a = b.peek();
            for(let j=0;j<l;j++) {
                expect(a[j]).to.be.equal(j%256);
            }
        });
        it('b[0] should be 0', function() {
            expect(b.peek(0)).to.be.equal(0);
        });
        it('b[100] should be 100', function() {
            expect(b.peek(100)).to.be.equal(100);
        });
        it('b[256] should be 0', function() {
            expect(b.peek(256)).to.be.equal(0);
        });
    });

    describe('Test peek(idx,end) data', function() {
        let b: FifoBuffer = new FifoBuffer();
        let l = 1000;
        for(let i=0;i<l;i++){
            let v = new Uint8Array(1);
            v[0] = i%256;
            b.pushback(v);
        }
        
        let b2 = b.peek(5,10);
        it('length should be 5', function() {
            expect(b2.byteLength).to.be.equal(5);
        });
        
        it('b2[0] should be 5', function() {
            expect(b2[0]).to.be.equal(5);
        });
        it('b2[1] should be 6', function() {
            expect(b2[0]).to.be.equal(5);
        });
        it('b2[2] should be 7', function() {
            expect(b2[0]).to.be.equal(5);
        });
        it('b2[3] should be 8', function() {
            expect(b2[0]).to.be.equal(5);
        });
        it('b2[4] should be 9', function() {
            expect(b2[0]).to.be.equal(5);
        });
    });

});

