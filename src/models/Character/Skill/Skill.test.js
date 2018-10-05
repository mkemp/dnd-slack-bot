"use strict";

const assert = require("assert");
const { Skill, Skills } = require("./Skill.js");
const { Stats } = require("../Stat");

describe("Skill", function() {
  describe("constructor", function() {
    describe("with no arguments", function() {
      let skill;

      beforeEach(function() {
        skill = new Skill();
      });

      it("defaults ref to undefined", function() {
        assert.equal(skill.ref, undefined);
      });

      it("defaults modifier to 0", function() {
        assert.equal(skill.modifier, 0);
      });
    });

    describe("with arguments", function() {
      let skill;
      const ref = { name: "Basket Weaving", matches: value => value === 12 };

      beforeEach(function() {
        skill = new Skill(ref, 2);
      });

      it("set ref to the passed in ref", function() {
        assert.deepEqual(skill.ref, ref);
      });

      it("sets modifier to passed in modifier", function() {
        assert.equal(skill.modifier, 2);
      });
    });
  });

  describe("getter:name", function() {
    let skill;

    beforeEach(function() {
      skill = new Skill({ name: "Snorkling" });
    });

    it("returns the name of the ref", function() {
      assert.equal(skill.name, "Snorkling");
    });
  });

  describe("method:matches(value)", function() {
    let skill;

    beforeEach(function() {
      skill = new Skill({ matches: value => value === 15 });
    });

    it("calls the matches function of the ref with the value", function() {
      assert.equal(skill.matches(15), true);
      assert.equal(skill.matches(14), false);
    });
  });

  describe("method:toString()", function() {
    let skill;

    beforeEach(function() {
      skill = new Skill({ name: "Bowling" }, -1);
    });

    it("returns the name and modifier in an expected format", function() {
      assert.equal(skill.toString(), "Bowling(-1)");
    });
  });
});

describe("Skills (Enum)", function() {
  const tests = [
    {
      name: "Athletics",
      aliases: [],
      matches: ["Athletics"],
      stat: Stats.Strength
    },
    {
      name: "Acrobatics",
      aliases: [],
      matches: ["Acrobatics"],
      stat: Stats.Dexterity
    },
    {
      name: "SleightOfHand",
      aliases: ["Sleight of Hand", "Sleight-of-Hand"],
      matches: ["SleightOfHand", "Sleight of Hand", "Sleight-of-Hand"],
      stat: Stats.Dexterity
    },
    {
      name: "Stealth",
      aliases: [],
      matches: ["Stealth"],
      stat: Stats.Dexterity
    },
    {
      name: "Arcana",
      aliases: [],
      matches: ["Arcana"],
      stat: Stats.Intelligence
    },
    {
      name: "History",
      aliases: [],
      matches: ["History"],
      stat: Stats.Intelligence
    },
    {
      name: "Investigation",
      aliases: [],
      matches: ["Investigation"],
      stat: Stats.Intelligence
    },
    {
      name: "Nature",
      aliases: [],
      matches: ["Nature"],
      stat: Stats.Intelligence
    },
    {
      name: "Religion",
      aliases: [],
      matches: ["Religion"],
      stat: Stats.Intelligence
    },
    {
      name: "AnimalHandling",
      aliases: ["Animal Handling", "Animal-Handling"],
      matches: ["AnimalHandling", "Animal Handling", "Animal-Handling"],
      stat: Stats.Wisdom
    },
    {
      name: "Insight",
      aliases: [],
      matches: ["Insight"],
      stat: Stats.Wisdom
    },
    {
      name: "Medicine",
      aliases: [],
      matches: ["Medicine"],
      stat: Stats.Wisdom
    },
    {
      name: "Perception",
      aliases: [],
      matches: ["Perception"],
      stat: Stats.Wisdom
    },
    {
      name: "Survival",
      aliases: [],
      matches: ["Survival"],
      stat: Stats.Wisdom
    },
    {
      name: "Deception",
      aliases: [],
      matches: ["Deception"],
      stat: Stats.Charisma
    },
    {
      name: "Intimidation",
      aliases: [],
      matches: ["Intimidation"],
      stat: Stats.Charisma
    },
    {
      name: "Persuasion",
      aliases: [],
      matches: ["Persuasion"],
      stat: Stats.Charisma
    },
    {
      name: "Performance",
      aliases: [],
      matches: ["Performance"],
      stat: Stats.Charisma
    }
  ];

  tests.forEach(test => {
    describe(test.name, () => {
      it("is a valid Skill", () => {
        assert.equal(Skills.hasOwnProperty(test.name), true);
      });

      it("has the expected aliases", () => {
        assert.deepEqual(Skills[test.name].aliases(), test.aliases);
      });

      test.matches.forEach(match => {
        it(`matches "${match}"`, () => {
          assert.equal(Skills[test.name].matches(match), true);
        });

        it(`matches "${match.toLowerCase()}"`, () => {
          assert.equal(Skills[test.name].matches(match.toLowerCase()), true);
        });

        it(`matches "${match.toUpperCase()}"`, () => {
          assert.equal(Skills[test.name].matches(match.toUpperCase()), true);
        });
      });

      it("has the expected stat", () => {
        assert.deepEqual(Skills[test.name].stat(), test.stat);
      });
    });
  });
});
