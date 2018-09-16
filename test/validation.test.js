'use strict';

const assert = require('assert');
const Validation = require('../src/validation');

describe('Validation.isDefined()', function() {
    const tests = [
        {name: 'undefined', arg: undefined, expected: false},
        {name: 'null',      arg: null,      expected: false},
        {name: 'object',    arg: {},        expected: true},
        {name: 'array',     arg: [],        expected: true},
        {name: 'string',    arg: '',        expected: true}
    ];

    tests.forEach(function(test) {
        it('correctly checks ' + test.name, function() {
            assert.equal(Validation.isDefined(test.arg), test.expected);
        });
    });
});


describe('Validation.isPresent()', function() {
    const tests = [
        {name: 'undefined', arg: undefined, expected: false},
        {name: 'null',      arg: null,      expected: false},
        {name: 'object',    arg: {},        expected: true},
        {name: 'array',     arg: [],        expected: true},
        {name: 'string',    arg: '',        expected: false}
    ];

    tests.forEach(function(test) {
        it('correctly checks ' + test.name, function() {
            assert.equal(Validation.isPresent(test.arg), test.expected);
        });
    });
});
