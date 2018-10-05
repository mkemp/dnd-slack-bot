"use strict";

const assert = require("assert");
const Attack = require("./Attack.js");

describe('Attack', function () {
  describe('constructor', function () {
    describe('with only name', function () {
      let attack;

      beforeEach(function () {
        attack = new Attack('Bellyflop');
      });

      it('sets name to the passed in name', function () {
        assert.equal(attack.name, 'Bellyflop');
      });

      it('sets regex appropriately', function () {
        assert.equal(attack.regex.source, 'Bellyflop');
        assert.equal(attack._matchesRegex.source, '^(?:Bellyflop)$');
      });

      it('defaults toHit to 0', function () {
        assert.equal(attack.toHit, '0');
      });

    });

    describe("with arguments", function() {
      let attack;

      beforeEach(function () {
        attack = new Attack('Throw Fish', ['throw', 'tf'], '1d20+5', '1d4');
      });

      it("sets name to the passed in name", function() {
        assert.equal(attack.name, "Throw Fish");
      });

      it('sets regex appropriately', function () {
        assert.equal(attack.regex.source, 'Throw\\ Fish|throw|tf');
        assert.equal(attack._matchesRegex.source, '^(?:Throw\\ Fish|throw|tf)$');
      });

      it('sets toHit to the passed in toHit', function () {
        assert.equal(attack.toHit, '1d20+5');
      });

      it("sets damage to the passed in damage", function() {
        assert.equal(attack.damage, "1d4");
      });
    });
  });

  describe("method:matches(value)", function() {
    let attack;

    beforeEach(function() {
      attack = new Attack("Salmon Slap");
    });

    it("returns true if name and value are exact matches", function() {
      assert.equal(attack.matches("Salmon Slap"), true);
    });

    it("returns true if name and value are case-insensitive matches", function() {
      assert.equal(attack.matches("salmon slap"), true);
    });
  });

  describe("method:toString()", function() {
    let attack;

    beforeEach(function () {
      attack = new Attack('Tuna Tornado', undefined, '1d20+5', '6d6+6');
    });

    it("returns the name, toHit, and damage in an expected format", function() {
      assert.equal(
        attack.toString(),
        "[Tuna Tornado] To Hit: 1d20+5 Damage: 6d6+6"
      );
    });
  });
});
