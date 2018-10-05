'use strict';

/**
 * Represent one of the six stats for a single character.
 */
module.exports = class Stat {
  /**
   * @param ref the reference stat
   * @param value the actual value (1-20)
   * @param modifier the straight modifier (used by skills and saves)
   */
  constructor(ref, value=10, modifier=0) {
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
};
