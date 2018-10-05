'use strict';

/**
 * Represent one of the skills for a single character.
 */
module.exports = class Skill {
  /**
   * @param ref ref the reference skill
   * @param modifier the final modifier (includes proficiency, expertise, and Jack of all Trades if applicable)
   */
  constructor(ref, modifier=0) {
    this.ref = ref;
    this.modifier = modifier;
  }

  get name() {
    return this.ref.name;
  }

  matches(value) {
    return this.ref.matches(value);
  }

  toString() {
    return `${this.name}(${this.modifier})`;
  }
};
