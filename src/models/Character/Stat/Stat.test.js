"use strict";

const assert = require("assert");
const { Stat, Stats } = require("./Stat.js");

describe("Stat", function() {
  describe("constructor", function() {
    describe("with no arguments", function() {
      let stat;

      beforeEach(function() {
        stat = new Stat();
      });

      it("defaults ref to undefined", function() {
        assert.equal(stat.ref, undefined);
      });

      it("defaults value to 10", function() {
        assert.equal(stat.value, 10);
      });

      it("defaults modifier to 0", function() {
        assert.equal(stat.modifier, 0);
      });

      it("defaults save to 0", function() {
        assert.equal(stat.save, 0);
      });
    });

    describe("with arguments", function() {
      let stat;
      const ref = { name: "Redundancy", matches: value => value === 12 };

      beforeEach(function() {
        stat = new Stat(ref, 12, 1);
      });

      it("set ref to the passed in ref", function() {
        assert.deepEqual(stat.ref, ref);
      });

      it("sets value to passed in value", function() {
        assert.equal(stat.value, 12);
      });

      it("sets modifier to passed in modifier", function() {
        assert.equal(stat.modifier, 1);
      });

      it("sets save to passed in modifier", function() {
        assert.equal(stat.save, 1);
      });
    });
  });

  describe("getter:name", function() {
    let stat;

    beforeEach(function() {
      stat = new Stat({ name: "Persistance" });
    });

    it("returns the name of the ref", function() {
      assert.equal(stat.name, "Persistance");
    });
  });

  describe("method:matches(value)", function() {
    let stat;

    beforeEach(function() {
      stat = new Stat({ matches: value => value === 15 });
    });

    it("calls the matches function of the ref with the value", function() {
      assert.equal(stat.matches(15), true);
      assert.equal(stat.matches(14), false);
    });
  });

  describe("method:toString()", function() {
    let stat;

    beforeEach(function() {
      stat = new Stat({ name: "Resilience" }, 8, -1);
    });

    it("returns the name, value, modifier, and save in an expected format", function() {
      assert.equal(stat.toString(), "Resilience[8](-1|-1)");
    });
  });

  describe("static:modifierFromValue(value)", function() {
    it("throws an error if a value is below 1", done => {
      try {
        Stat.modifierFromValue(0);
      } catch (err) {
        done();
      }
    });

    it("throws an error if a value is above 30", done => {
      try {
        Stat.modifierFromValue(31);
      } catch (err) {
        done();
      }
    });

    [
      [1, -5],
      [2, -4],
      [3, -4],
      [4, -3],
      [5, -3],
      [6, -2],
      [7, -2],
      [8, -1],
      [9, -1],
      [10, 0],
      [11, 0],
      [12, 1],
      [13, 1],
      [14, 2],
      [15, 2],
      [16, 3],
      [17, 3],
      [18, 4],
      [19, 4],
      [20, 5],
      [21, 5],
      [22, 6],
      [23, 6],
      [24, 7],
      [25, 7],
      [26, 8],
      [27, 8],
      [28, 9],
      [29, 9],
      [30, 10]
    ].forEach(test => {
      describe(`a value of ${test[0]}`, () => {
        it(`generates a modifier of ${test[1]}`, () => {
          assert.equal(Stat.modifierFromValue(test[0]), test[1]);
        });
      });
    });
  });
});

describe("Stats (Enum)", function() {
  const tests = [
    {
      name: "Strength",
      aliases: ["STR"],
      matches: ["Strength", "Str"]
    },
    {
      name: "Dexterity",
      aliases: ["DEX"],
      matches: ["Dexterity", "Dex"]
    },
    {
      name: "Constitution",
      aliases: ["CON"],
      matches: ["Constitution", "Con"]
    },
    {
      name: "Intelligence",
      aliases: ["INT"],
      matches: ["Intelligence", "Int"]
    },
    {
      name: "Wisdom",
      aliases: ["WIS"],
      matches: ["Wisdom", "Wis"]
    },
    {
      name: "Charisma",
      aliases: ["CHA"],
      matches: ["Charisma", "CHA"]
    }
  ];

  tests.forEach(test => {
    describe(test.name, () => {
      it("is a valid Stat", () => {
        assert.equal(Stats.hasOwnProperty(test.name), true);
      });

      it("has the expected aliases", () => {
        assert.deepEqual(Stats[test.name].aliases(), test.aliases);
      });

      test.matches.forEach(match => {
        it(`matches "${match}"`, () => {
          assert.equal(Stats[test.name].matches(match), true);
        });

        it(`matches "${match.toLowerCase()}"`, () => {
          assert.equal(
            Stats[test.name].matches(match.toLowerCase()),
            true
          );
        });

        it(`matches "${match.toUpperCase()}"`, () => {
          assert.equal(
            Stats[test.name].matches(match.toUpperCase()),
            true
          );
        });
      });
    });
  });
});
