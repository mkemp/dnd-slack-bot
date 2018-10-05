'use strict';

const assert = require('assert');
const Skill = require('./Skill.js');

describe('Skill', function () {
  describe('constructor', function () {
    describe('with no arguments', function () {
      let skill;

      beforeEach(function () {
        skill = new Skill();
      });

      it('defaults ref to undefined', function () {
        assert.equal(skill.ref, undefined);
      });

      it('defaults modifier to 0', function () {
        assert.equal(skill.modifier, 0);
      });
    });

    describe('with arguments', function () {
      let skill;
      const ref = { name: 'Basket Weaving', matches: (value) => value === 12 };

      beforeEach(function () {
        skill = new Skill(ref, 2);
      });

      it('set ref to the passed in ref', function () {
        assert.deepEqual(skill.ref, ref);
      });

      it('sets modifier to passed in modifier', function () {
        assert.equal(skill.modifier, 2);
      });
    });
  });

  describe('getter:name', function () {
    let skill;

    beforeEach(function () {
      skill = new Skill({ name: 'Snorkling' });
    });

    it('returns the name of the ref', function () {
      assert.equal(skill.name, 'Snorkling');
    });
  });

  describe('method:matches(value)', function () {
    let skill;

    beforeEach(function () {
      skill = new Skill({ matches: (value) => value === 15 });
    });

    it('calls the matches function of the ref with the value', function () {
      assert.equal(skill.matches(15), true);
      assert.equal(skill.matches(14), false);
    });
  });

  describe('method:toString()', function () {
    let skill;

    beforeEach(function () {
      skill = new Skill({ name: 'Bowling' }, -1);
    });

    it('returns the name and modifier in an expected format', function () {
      assert.equal(skill.toString(), 'Bowling(-1)');
    });
  });
});
