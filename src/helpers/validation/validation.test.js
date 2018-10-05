"use strict";

const assert = require('assert');
const validation = require('./validation');

describe("validation.isDefined()", function() {
  const tests = [
    { name: "undefined", arg: undefined, expected: false },
    { name: "null", arg: null, expected: false },
    { name: "object", arg: {}, expected: true },
    { name: "array", arg: [], expected: true },
    { name: "string", arg: "", expected: true }
  ];

  tests.forEach(function(test) {
    it("correctly checks " + test.name, function() {
      assert.equal(validation.isDefined(test.arg), test.expected);
    });
  });
});

describe("validation.isPresent()", function() {
  const tests = [
    { name: "undefined", arg: undefined, expected: false },
    { name: "null", arg: null, expected: false },
    { name: "object", arg: {}, expected: true },
    { name: "array", arg: [], expected: true },
    { name: "string", arg: "", expected: false }
  ];

  tests.forEach(function(test) {
    it("correctly checks " + test.name, function() {
      assert.equal(validation.isPresent(test.arg), test.expected);
    });
  });
});
