"use strict";

const assert = require("assert");
const ReRollLowerThan = require("./ReRollLowerThan.js");

describe("ReRollLowerThan", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let reRollLowerThan;

      beforeEach(() => {
        reRollLowerThan = new ReRollLowerThan();
      });

      it("defaults times to 1", () => {
        assert.equal(reRollLowerThan.times, 1);
      });

      it("defaults value to >101", () => {
        assert.equal(reRollLowerThan.value, "<101");
      });
    });

    describe("with arguments", () => {
      let reRollLowerThan;

      beforeEach(() => {
        reRollLowerThan = new ReRollLowerThan(2, 3);
      });

      it("sets times to the passed in times", () => {
        assert.equal(reRollLowerThan.times, 2);
      });

      it("sets value to > the passed in lowerThanValue", () => {
        assert.equal(reRollLowerThan.value, "<3");
      });
    });
  });

  describe("method:applyTo(result)", () => {
    let reRollLowerThan;
    let rolls = [1, 2, 3, 4, 5];
    rolls.some = fn => true;
    let result = {
      rolls: rolls,
      removed: [],
      rerolls: [],
      rollSingle: () => 6
    };

    beforeEach(() => {
      reRollLowerThan = new ReRollLowerThan(1, 3);
      reRollLowerThan.applyTo(result);
    });

    it("re-rolls rolls lower than lowerThanValue", () => {
      delete result.rolls.some;
      assert.deepEqual(result.rolls, [6, 6, 3, 4, 5]);
      assert.deepEqual(result.rerolls, [1, 2]);
    });

    it("totals the re-rolled rolls", () => {
      assert.equal(result.total, 24);
    });
  });
});
