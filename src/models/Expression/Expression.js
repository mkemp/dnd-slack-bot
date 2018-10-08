"use strict";

const Evaluation = require("../Evaluation");
const Operators = require("./Term/Operators");

/**
 * Represents a single term in an {Expression}. Either a NdX or constant.
 */
module.exports = class Expression {
  constructor(terms, purpose) {
    this.terms = terms;
    this.purpose = purpose;
  }

  toEvaluation(random = Math.random) {
    return new Evaluation(this, random);
  }

  toString() {
    let rendered = this.terms.join(" ");
    if (this.terms[0].operator !== Operators.Subtract) {
      rendered = rendered.slice(2);
    }
    return `${rendered}${this.purpose ? " for " + this.purpose : ""}`;
  }
};
