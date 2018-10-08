"use strict";

const assert = require("assert");
const ReRollHigherThan = require("./ReRollHigherThan.js");

describe("ReRollHigherThan", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let reRollHigherThan;

      beforeEach(() => {
        reRollHigherThan = new ReRollHigherThan();
      });

      it("defaults times to 1", () => {
        assert.equal(reRollHigherThan.times, 1);
      });

      it("defaults value to >0", () => {
        assert.equal(reRollHigherThan.value, ">0");
      });
    });

    describe("with arguments", () => {
      let reRollHigherThan;

      beforeEach(() => {
        reRollHigherThan = new ReRollHigherThan(2, 3);
      });

      it("sets times to the passed in times", () => {
        assert.equal(reRollHigherThan.times, 2);
      });

      it("sets value to > the passed in greaterThanValue", () => {
        assert.equal(reRollHigherThan.value, ">3");
      });
    });
  });

  describe("method:applyTo(result)", () => {
    let reRollHigherThan;
    let rolls = [1, 2, 3, 4, 5];
    rolls.some = fn => true;
    let result = {
      rolls: rolls,
      removed: [],
      rerolls: [],
      rollSingle: () => 6
    };

    beforeEach(() => {
      reRollHigherThan = new ReRollHigherThan(1, 3);
      reRollHigherThan.applyTo(result);
    });

    it("re-rolls rolls greater than greaterThanValue", () => {
      delete result.rolls.some;
      assert.deepEqual(result.rolls, [1, 2, 3, 6, 6]);
      assert.deepEqual(result.rerolls, [4, 5]);
    });

    it("totals the re-rolled rolls", () => {
      assert.equal(result.total, 18);
    });
  });
});
