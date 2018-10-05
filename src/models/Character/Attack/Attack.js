'use strict';

/**
 * Represent one attack for a single character.
 */
module.exports = class Attack {
  constructor(name, toHit=0, damage='1') {
    this.name = name;
    this.toHit = toHit;
    this.damage = damage;
  }

  matches(value) {
    return value.toLowerCase() === this.name.toLowerCase();
  }

  toString() {
    return `[${this.name}] To Hit: ${this.toHit} Damage: ${this.damage}`;
  }
};
