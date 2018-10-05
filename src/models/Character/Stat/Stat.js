"use strict";

const { Enum } = require("enumify");
const Preconditions = require("../../../helpers/preconditions");

class Stats extends Enum {
  aliases() {
    return [this.name.slice(0, 3).toUpperCase()];
  }

  matches(value) {
    return new RegExp(
      `^(?:${this.name}|${this.aliases().join("|")})$`,
      "i"
    ).test(value);
  }
}

Stats.initEnum([
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma"
]);

/**
 * Represent one of the six stats for a single character.
 */
class Stat {
  /**
   * @param ref the reference stat
   * @param value the actual value (1-20)
   * @param modifier the straight modifier (used by skills and saves)
   */
  constructor(ref, value = 10, modifier = 0) {
    this.ref = ref;
    this.value = value;
    this.modifier = modifier;
    this.save = modifier;
  }

  get name() {
    return this.ref.name;
  }

  matches(value) {
    return this.ref.matches(value);
  }

  toString() {
    return `${this.name}[${this.value}](${this.modifier}|${this.save})`;
  }

  static modifierFromValue(value) {
    Preconditions.checkInRange(value, 1, 30);
    return Math.floor((value - 10) / 2);
  }
}

module.exports = {
  Stat,
  Stats
};
