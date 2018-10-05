'use strict';

const assert = require('assert');
const Stat = require('./Stat.js');

describe('Stat', function () {
  describe('constructor', function () {
    describe('with no arguments', function () {
      let stat;

      beforeEach(function () {
        stat = new Stat();
      });

      it('defaults ref to undefined', function () {
        assert.equal(stat.ref, undefined);
      });

      it('defaults value to 10', function () {
        assert.equal(stat.value, 10);
      });

      it('defaults modifier to 0', function () {
        assert.equal(stat.modifier, 0);
      });

      it('defaults save to 0', function () {
        assert.equal(stat.save, 0);
      });
    });

    describe('with arguments', function () {
      let stat;
      const ref = { name: 'Redundancy', matches: (value) => value === 12 };

      beforeEach(function () {
        stat = new Stat(ref, 12, 1);
      });

      it('set ref to the passed in ref', function () {
        assert.deepEqual(stat.ref, ref);
      });

      it('sets value to passed in value', function () {
        assert.equal(stat.value, 12);
      });

      it('sets modifier to passed in modifier', function () {
        assert.equal(stat.modifier, 1);
      });

      it('sets save to passed in modifier', function () {
        assert.equal(stat.save, 1);
      });
    });
  });

  describe('getter:name', function () {
    let stat;

    beforeEach(function () {
      stat = new Stat({ name: 'Persistance' });
    });

    it('returns the name of the ref', function () {
      assert.equal(stat.name, 'Persistance');
    });
  });

  describe('method:matches(value)', function () {
    let stat;

    beforeEach(function () {
      stat = new Stat({ matches: (value) => value === 15 });
    });

    it('calls the matches function of the ref with the value', function () {
      assert.equal(stat.matches(15), true);
      assert.equal(stat.matches(14), false);
    });
  });

  describe('method:toString()', function () {
    let stat;

    beforeEach(function () {
      stat = new Stat({ name: 'Resilience' }, 8, -1);
    });

    it('returns the name, value, modifier, and save in an expected format', function () {
      assert.equal(stat.toString(), 'Resilience[8](-1|-1)');
    });
  });
});
