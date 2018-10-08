"use strict";

const { isPresent } = require("../../helpers/validation");
const Operators = require("../Expression/Term/Operators");

/**
 * Represents the evaluation of an entire {Expression}.
 */
module.exports = class Evaluation {
  constructor(expression, random = Math.random) {
    this.expression = expression;
    this.results = [];
    this.total = 0;
    this.text = "";
    this.fallback = "";
    this.expression.terms
      .map(term => term.toResult(random))
      .forEach((result, index) => {
        this.results.push(result);
        switch (result.term.operator) {
          case Operators.Add:
            this.total += result.total;
            break;
          case Operators.Subtract:
            this.total -= result.total;
            break;
          case Operators.Multiply:
            this.total *= result.total;
            break;
          case Operators.Divide:
            // Just ignoring divide by zero.
            if (result.total !== 0) {
              this.total /= result.total;
            }
            break;
          case Operators.Max:
            if (result.total > this.total) {
              this.total = result.total;
            }
            break;
          case Operators.Min:
            if (result.total < this.total) {
              this.total = result.total;
            }
            break;
        }
        if (index > 0) {
          this.text += ` ${result.term.operator.symbol} `;
          this.fallback += ` ${result.term.operator.symbol} `;
        } else if (result.term.operator === Operators.Subtract) {
          this.text += `${result.term.operator.symbol} `;
          this.fallback += `${result.term.operator.symbol} `;
        }
        this.text += `*${result.total}*`;
        this.fallback += `${result.total}`;
      });

    if (this.results.length === 0) {
      this.text += `*0*`;
      this.text += `0`;
    }
    this.text += ` = *${this.total}*`;
    this.fallback += ` = ${this.total}`;
    if (isPresent(expression.purpose)) {
      this.text += ` for *${this.expression.purpose}*`;
      this.fallback += ` for ${this.expression.purpose}`;
    }
  }

  toString() {
    return this.fallback;
  }
};
