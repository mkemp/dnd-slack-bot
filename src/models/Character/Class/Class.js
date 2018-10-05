'use strict';

const { Classes } = require('../../../helpers/Reference');

/**
 * Represent a characters class.
 */
module.exports = class Class {
  constructor(ref, sub, levels=1) {
    this.ref = ref;
    this.sub = sub;
    this.levels = levels;
  }

  get name() {
    return `${this.sub ? this.sub + ' ' : ''}${this.ref.name}`
  }

  toString() {
    return `${this.name} ${this.levels}`;
  }

  static from(obj) {
    return new Class(Classes[obj.name], obj.sub, obj.levels);
  }
};
