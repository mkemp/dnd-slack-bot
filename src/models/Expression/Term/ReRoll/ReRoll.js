"use strict";

/**
 * Encapsulates the logic for handling re-rolls.
 */
module.exports = class ReRoll {
  constructor(times = 1, matchesCondition) {
    this.times = times;
    this.matchesCondition = matchesCondition;
  }

  applyTo(result) {
    if (this.matchesCondition) {
      if (result.rolls.some(this.matchesCondition)) {
        result.rolls.forEach((value, index) => {
          let newValue = value;
          for (
            let i = 0;
            i < this.times && this.matchesCondition(newValue);
            i++
          ) {
            result.rerolls.push(value);
            newValue = result.rollSingle();
          }
          result.rolls[index] = newValue;
        });
        result.total = 0;
        result.rolls.forEach(value => (result.total += value));
      }
    }
  }
};
