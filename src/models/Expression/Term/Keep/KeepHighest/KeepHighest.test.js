"use strict";

const assert = require("assert");
const KeepHighest = require("./KeepHighest.js");

describe("KeepHighest", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let keepHighest;

      beforeEach(() => {
        keepHighest = new KeepHighest();
      });

      it("defaults limit to 1", () => {
        assert.equal(keepHighest.limit, 1);
      });
    });

    describe("with arguments", () => {
      let keepHighest;
      const applyOrdering = rolls => rolls;

      beforeEach(() => {
        keepHighest = new KeepHighest(2);
      });

      it("sets limit to the passed in limit", () => {
        assert.equal(keepHighest.limit, 2);
      });
    });
  });

  describe("method:applyTo(result)", () => {
    let keepHighest;
    let result = {
      rolls: [1, 3, 2, 5, 4],
      removed: []
    };

    beforeEach(() => {
      keepHighest = new KeepHighest(2);
      keepHighest.applyTo(result);
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
