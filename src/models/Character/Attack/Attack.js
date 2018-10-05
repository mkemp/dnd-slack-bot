"use strict";

const Preconditions = require('../../../helpers/preconditions');
const XRegExp = require('xregexp');

/**
 * Represent one attack for a single character.
 */
module.exports = class Attack {
  constructor(name, aliases, toHit='0', damage='1') {
    this.name = Preconditions.checkNotNull(name);
    this.toHit = Preconditions.checkNotNull(toHit);
    this.damage = Preconditions.checkNotNull(damage);
    this.regex = XRegExp.union([name].concat(aliases || []), 'i');
    this._matchesRegex = XRegExp.cache(`^(?:${this.regex.source})$`, this.regex.flags);
  }

  matches(value) {
    return this._matchesRegex.test(value);
  }

  toString() {
    return `[${this.name}] To Hit: ${this.toHit} Damage: ${this.damage}`;
  }

  static from(obj) {
    return new Attack(obj.name, obj.aliases, obj.to_hit, obj.damage)
  }
};
