"use strict";

const assert = require("assert");
const ReRoll = require("./ReRoll.js");

describe("ReRoll", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let reRoll;

      beforeEach(() => {
        reRoll = new ReRoll();
      });

      it("defaults times to 1", () => {
        assert.equal(reRoll.times, 1);
      });

      it("defaults matchesCondition to undefined", () => {
        assert.equal(reRoll.matchesCondition, undefined);
      });
    });

    describe("with arguments", () => {
      let reRoll;
      const matchesCondition = () => true;

      beforeEach(() => {
        reRoll = new ReRoll(2, matchesCondition);
      });

      it("sets times to the passed in times", () => {
        assert.equal(reRoll.times, 2);
      });

      it("sets applyOrdering to the passed in applyOrdering function", () => {
        assert.equal(reRoll.matchesCondition, matchesCondition);
      });
    });
  });

  describe("method:applyTo(result)", () => {
    describe("without matchesCondition", () => {
      let reRoll;
      let result = {
        rolls: [1, 2, 3, 4, 5],
        removed: []
      };

      beforeEach(() => {
        reRoll = new ReRoll();
        reRoll.applyTo(result);
      });

      it("doesn't change the result", () => {
        assert.deepEqual(result, {
          rolls: [1, 2, 3, 4, 5],
          removed: []
        });
      });
    });

    describe("with matchesCondition", () => {
      let reRoll;
      const matchesCondition = value => value < 3;
      let rolls = [1, 2, 3, 4, 5];
      rolls.some = fn => true;
      let result = {
        rolls: rolls,
        removed: [],
        rerolls: [],
        rollSingle: () => 6
      };

      beforeEach(() => {
        reRoll = new ReRoll(1, matchesCondition);
        reRoll.applyTo(result);
      });

      it("re-rolls matching rolls", () => {
        delete result.rolls.some;
        assert.deepEqual(result.rolls, [6, 6, 3, 4, 5]);
        assert.deepEqual(result.rerolls, [1, 2]);
      });

      it("totals the re-rolled rolls", () => {
        assert.equal(result.total, 24);
      });
    });
  });
});
