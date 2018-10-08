"use strict";

const Operators = require("./Operators");
const Result = require("../../Evaluation/Result");

/**
 * Represents a single term in an {Expression}. Either a NdX or constant.
 */
module.exports = class Term {
  constructor() {
    this.operator = Operators.Add;
    this.number = 1;
    this.sides = 1;
    this.reroll = null;
    this.keep = null;
    this.explode = false;
  }

  get constant() {
    return this.sides === 1;
  }

  toResult(random = Math.random) {
    return new Result(this, random);
  }

  toCanonicalForm() {
    return this.constant
      ? `${this.number}`
      : `${this.number}d${this.sides}${this.explode ? "!" : ""}${this.reroll ||
          ""}${this.keep || ""}`;
  }

  toString() {
    return `${this.operator.symbol} ${this.toCanonicalForm()}`;
  }
};
