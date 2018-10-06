"use strict";

const assert = require("assert");
const { Race, Races } = require("./Race.js");

describe("Race", function() {
  describe("constructor", function() {
    describe("with no arguments", function() {
      let race;

      beforeEach(function() {
        race = new Race();
      });

      it("defaults name to undefined", function() {
        assert.equal(race.name, undefined);
      });

      it("defaults sub to undefined", function() {
        assert.equal(race.sub, undefined);
      });
    });

    describe("with arguments", function() {
      let race;

      beforeEach(function() {
        race = new Race({ name: "Dog", sub: "Chihuahua" });
      });

      it("sets name to the passed in name", function() {
        assert.equal(race.name, "Dog");
      });

      it("sets sub to the passed in sub", function() {
        assert.equal(race.sub, "Chihuahua");
      });
    });
  });

  describe("method:toString()", function() {
    describe("without a sub", function() {
      let race;

      beforeEach(function() {
        race = new Race({ name: "Cat" });
      });

      it("returns the name", function() {
        assert.equal(race.toString(), "Cat");
      });
    });

    describe("with a sub", function() {
      let race;

      beforeEach(function() {
        race = new Race({ name: "Cat", sub: "Maine Coon" });
      });

      it("returns the sub and name", function() {
        assert.equal(race.toString(), "Maine Coon Cat");
      });
    });
  });

  describe("static:from(value)", function() {
    describe("from a race with a subrace", () => {
      let race;
      let newRace;

      beforeEach(function() {
        race = new Race({ name: "Dragonborn", sub: "Red" });
        newRace = Race.from(race);
      });

      it("sets name to the original race's name", function() {
        assert.equal(newRace.name, race.name);
      });

      it("sets sub to the original race's sub", function() {
        assert.equal(newRace.sub, race.sub);
      });
    });

    describe("from a race without a subrace", () => {
      let race;
      let newRace;

      beforeEach(function() {
        race = new Race({ name: "Human" });
        newRace = Race.from(race);
      });

      it("sets name to the original race's name", function() {
        assert.equal(newRace.name, race.name);
      });

      it("sets sub to undefined", function() {
        assert.equal(newRace.sub, undefined);
      });
    });
  });
});

describe("Races (Enum)", function() {
  const tests = [
    {
      name: "Aasimar",
      subs: [{ sub: "Fallen" }, { sub: "Protector" }, { sub: "Scourge" }]
    },
    { name: "Bugbear" },
    {
      name: "Dragonborn",
      subs: [
        { sub: "Black" },
        { sub: "Blue" },
        { sub: "Brass" },
        { sub: "Bronze" },
        { sub: "Copper" },
        { sub: "Gold" },
        { sub: "Green" },
        { sub: "Red" },
        { sub: "Silver" },
        { sub: "White" }
      ]
    },
    {
      name: "Dwarf",
      subs: [{ sub: "Duergar" }, { sub: "Hill" }, { sub: "Mountain" }]
    },
    {
      name: "Elf",
      subs: [
        { sub: "Eladrin" },
        { sub: "Drow" },
        { sub: "High" },
        { sub: "Sea" },
        { sub: "Shadar-Kai" },
        { sub: "Wood" }
      ]
    },
    { name: "Firbolg" },
    {
      name: "Genasi",
      subs: [
        { sub: "Air" },
        { sub: "Earth" },
        { sub: "Fire" },
        { sub: "Water" }
      ]
    },
    {
      name: "Gith",
      subs: [{ sub: "Githyanki" }, { sub: "Githzerai" }]
    },
    {
      name: "Gnome",
      subs: [{ sub: "Deep" }, { sub: "Forest" }, { sub: "Rock" }]
    },
    { name: "Goblin" },
    { name: "Goliath" },
    { name: "Hobgoblin" },
    { name: "Half-Elf" },
    {
      name: "Halfling",
      subs: [{ sub: "Ghostwise" }, { sub: "Lightfoot" }, { sub: "Stout" }]
    },
    { name: "Half-Orc" },
    { name: "Human" },
    { name: "Kenku" },
    { name: "Kobold" },
    { name: "Lizardfolk" },
    { name: "Orc" },
    { name: "Tabaxi" },
    {
      name: "Tiefling",
      subs: [
        { sub: "Baalzebub" },
        { sub: "Dispater" },
        { sub: "Feral" },
        { sub: "Fierna" },
        { sub: "Glasya" },
        { sub: "Hellfire" },
        { sub: "Levistus" },
        { sub: "Mammon" },
        { sub: "Mephistopheles" },
        { sub: "Zariel" }
      ]
    },
    { name: "Tortle" },
    { name: "Triton" },
    { name: "Yuan-Ti Pureblood" }
  ];

  tests.forEach(test => {
    describe(test.name, () => {
      if (test.name) {
        it("is a valid race", () => {
          assert.equal(Races.hasOwnProperty(test.name), true);
        });
      } else {
        test.subs.forEach(sub => {
          describe(sub.sub, () => {
            it("is a valid subrace", () => {
              assert.equal(Races[test.name].hasOwnProperty(sub.sub), true);
            });
          });
        });
      }
    });
  });
});
