"use strict";

const assert = require("assert");
const Keep = require("./Keep.js");

describe("Keep", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let keep;

      beforeEach(() => {
        keep = new Keep();
      });

      it("defaults limit to undefined", () => {
        assert.equal(keep.limit, undefined);
      });

      it("defaults applyOrdering to undefined", () => {
        assert.equal(keep.applyOrdering, undefined);
      });
    });

    describe("with arguments", () => {
      let keep;
      const applyOrdering = rolls => rolls;

      beforeEach(() => {
        keep = new Keep(1, applyOrdering);
      });

      it("sets limit to the passed in limit", () => {
        assert.equal(keep.limit, 1);
      });

      it("sets applyOrdering to the passed in applyOrdering function", () => {
        assert.equal(keep.applyOrdering, applyOrdering);
      });
    });
  });

  describe("method:applyTo(result)", () => {
    describe("without applyOrdering", () => {
      let keep;
      let result = {
        rolls: [1, 2, 3, 4, 5],
        removed: []
      };

      beforeEach(() => {
        keep = new Keep(2);
        keep.applyTo(result);
      });

      it("keeps limit rolls", () => {
        assert.deepEqual(result.rolls, [1, 2]);
        assert.deepEqual(result.removed, [3, 4, 5]);
      });

      it("totals the remaining rolls", () => {
        assert.equal(result.total, 3);
      });
    });

    describe("with applyOrdering", () => {
      let keep;
      const applyOrdering = rolls => rolls.sort((a, b) => b - a);
      let result = {
        rolls: [1, 2, 3, 4, 5],
        removed: []
      };

      beforeEach(() => {
        keep = new Keep(2, applyOrdering);
        keep.applyTo(result);
      });

      it("keeps limit rolls after ordering", () => {
        assert.deepEqual(result.rolls, [5, 4]);
        assert.deepEqual(result.removed, [3, 2, 1]);
      });

      it("totals the remaining rolls", () => {
        assert.equal(result.total, 9);
      });
    });
  });
});
