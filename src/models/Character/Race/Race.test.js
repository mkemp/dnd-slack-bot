"use strict";

const assert = require("assert");
const Race = require("./Race.js");

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
        race = new Race("Dog", "Chihuahua");
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
        race = new Race("Cat");
      });

      it("returns the name", function() {
        assert.equal(race.toString(), "Cat");
      });
    });

    describe("with a sub", function() {
      let race;

      beforeEach(function() {
        race = new Race("Cat", "Maine Coon");
      });

      it("returns the sub and name", function() {
        assert.equal(race.toString(), "Maine Coon Cat");
      });
    });
  });

  describe("static:from(value)", function() {
    let race;
    let newRace;

    beforeEach(function() {
      race = new Race("Bird", "Robin");
      newRace = Race.from(race);
    });

    it("sets name to the original race's name", function() {
      assert.equal(newRace.name, race.name);
    });

    it("sets sub to the original race's sub", function() {
      assert.equal(newRace.sub, race.sub);
    });
  });
});
