"use strict";

/**
 * Represents the result of a single {Term}.
 */
module.exports = class Result {
  constructor(term, random = Math.random) {
    this.term = term;
    this.random = random;
    this.rolls = [];
    this.rerolls = [];
    this.removed = [];
    if (this.term.constant) {
      this.total = this.rollSingle();
    } else {
      this.total = 0;
      let number = this.term.number;
      for (let i = 0; i < number; i++) {
        const value = this.rollSingle();
        this.total += value;
        this.rolls.push(value);
        if (this.term.explode && value === this.term.sides) {
          number++;
        }
      }
      if (this.term.reroll) {
        this.term.reroll.applyTo(this);
      }
      if (this.term.keep) {
        this.term.keep.applyTo(this);
      }
    }
  }

  rollSingle() {
    return this.term.constant
      ? this.term.number
      : Math.floor(this.random() * this.term.sides) + 1;
  }
};
