"use strict";

const assert = require("assert");
const KeepLowest = require("./KeepLowest.js");

describe("KeepLowest", () => {
  describe("constructor", () => {
    describe("with no arguments", () => {
      let keepLowest;

      beforeEach(() => {
        keepLowest = new KeepLowest();
      });

      it("defaults limit to 1", () => {
        assert.equal(keepLowest.limit, 1);
      });
    });

    describe("with arguments", () => {
      let keepLowest;
      const applyOrdering = rolls => rolls;

      beforeEach(() => {
        keepLowest = new KeepLowest(2);
      });

      it("sets limit to the passed in limit", () => {
        assert.equal(keepLowest.limit, 2);
      });
    });
  });

  describe("method:applyTo(result)", () => {
    let keepLowest;
    let result = {
      rolls: [1, 3, 2, 5, 4],
      removed: []
    };

    beforeEach(() => {
      keepLowest = new KeepLowest(2);
      keepLowest.applyTo(result);
    });

    it("keeps limit rolls after ordering", () => {
      assert.deepEqual(result.rolls, [1, 2]);
      assert.deepEqual(result.removed, [3, 4, 5]);
    });

    it("totals the remaining rolls", () => {
      assert.equal(result.total, 3);
    });
  });
});
