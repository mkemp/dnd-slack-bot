"use strict";

/**
 * Encapsulates the logic for keeping a subset of results.
 */
module.exports = class Keep {
  constructor(limit, applyOrdering) {
    this.limit = limit;
    this.applyOrdering = applyOrdering;
  }

  applyTo(result) {
    if (this.applyOrdering) {
      this.applyOrdering(result.rolls);
    }
    result.rolls
      .splice(this.limit)
      .forEach(value => result.removed.push(value));
    result.total = 0;
    result.rolls.forEach(value => (result.total += value));
  }
};
