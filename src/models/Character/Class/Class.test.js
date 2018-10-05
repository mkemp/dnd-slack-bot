'use strict';

const assert = require('assert');
const Class = require('./Class.js');
const { Classes } = require('../../../helpers/Reference');

describe('Class', function () {
  describe('constructor', function () {
    describe('with no arguments', function () {
      let charClass;

      beforeEach(function () {
        charClass = new Class();
      });

      it('defaults ref to undefined', function () {
        assert.equal(charClass.ref, undefined);
      });

      it('defaults sub to undefined', function () {
        assert.equal(charClass.sub, undefined);
      });

      it('defaults levels to 1', function () {
        assert.equal(charClass.levels, 1);
      });
    });

    describe('with arguments', function () {
      let charClass;
      const ref = { name: 'Collector' };

      beforeEach(function () {
        charClass = new Class(ref, 'Tax', 5);
      });

      it('sets ref to the passed in ref', function () {
        assert.equal(charClass.ref, ref);
      });

      it('sets sub to the passed in sub', function () {
        assert.equal(charClass.sub, 'Tax');
      });

      it('sets levels to the passed in levels', function () {
        assert.equal(charClass.levels, 5);
      });
    });
  });

  describe('getter:name', function () {
    describe('without a sub', function () {
      let charClass;

      beforeEach(function () {
        charClass = new Class({ name: 'Collector' });
      });

      it('returns the name of the ref', function () {
        assert.equal(charClass.name, 'Collector');
      });
    });

    describe('with a sub', function () {
      let charClass;

      beforeEach(function () {
        charClass = new Class({ name: 'Collector' }, 'Stamp');
      });

      it('returns the sub and name of the ref', function () {
        assert.equal(charClass.name, 'Stamp Collector');
      });
    });
  });

  describe('method:toString()', function () {
    describe('without a sub', function () {
      let charClass;

      beforeEach(function () {
        charClass = new Class({ name: 'Hunter' }, undefined, 8);
      });

      it('returns the name and leves', function () {
        assert.equal(charClass.toString(), 'Hunter 8');
      });
    });

    describe('with a sub', function () {
      let charClass;

      beforeEach(function () {
        charClass = new Class({ name: 'Hunter' }, 'Shark', 17);
      });

      it('returns the sub and name', function () {
        assert.equal(charClass.toString(), 'Shark Hunter 17');
      });
    });
  });

  describe('static:from(value)', function () {
    let newClass;

    beforeEach(function () {
      newClass = Class.from({ name: 'Wizard', sub: 'Pinball', levels: 2 });
    });

    it('sets ref to the enum Class from original ref name', function () {
      assert.equal(newClass.ref, Classes['Wizard']);
    });

    it('sets sub to the original sub', function () {
      assert.equal(newClass.sub, 'Pinball');
    });

    it('sets levels to the original levels', function () {
      assert.equal(newClass.levels, 2);
    });
  });
});
