"use strict";

const { Enum } = require("enumify");

/**
 * Represents operators between {Term}s.
 */
class Operators extends Enum {
  static for(symbol) {
    switch (symbol) {
      case "-":
        return Operators.Subtract;
      case "*":
      case "x":
        return Operators.Multiply;
      case "/":
        return Operators.Divide;
      case "^":
        return Operators.Max;
      case "v":
        return Operators.Min;
      default:
        return Operators.Add;
    }
  }
}
Operators.initEnum({
  Add: {
    symbol: "+"
  },
  Subtract: {
    symbol: "-"
  },
  Multiply: {
    symbol: "x"
  },
  Divide: {
    symbol: "/"
  },
  Max: {
    symbol: "^"
  },
  Min: {
    symbol: "v"
  }
});

module.exports = Operators;
