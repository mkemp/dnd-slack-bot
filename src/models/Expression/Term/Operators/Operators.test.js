"use strict";

const assert = require("assert");
const Operators = require("./Operators.js");

describe("Operators (Enum)", function() {
  const tests = [
    {
      key: "Add",
      for: ["+"],
      symbol: "+"
    },
    {
      key: "Divide",
      for: ["/"],
      symbol: "/"
    },
    {
      key: "Max",
      for: ["^"],
      symbol: "^"
    },
    {
      key: "Min",
      for: ["v"],
      symbol: "v"
    },
    {
      key: "Multiply",
      for: ["x", "*"],
      symbol: "x"
    },
    {
      key: "Subtract",
      for: ["-"],
      symbol: "-"
    }
  ];

  tests.forEach(test => {
    describe(test.key, () => {
      it("is a valid operator", () => {
        assert.equal(Operators.hasOwnProperty(test.key), true);
      });

      it(`resolves to ${test.symbol}`, () => {
        assert.equal(Operators[test.key].symbol, test.symbol);
      });
    });
  });

  describe("static:for(symbol)", () => {
    tests.forEach(test => {
      test.for.forEach(symbol => {
        describe(symbol, () => {
          let Operator;

          beforeEach(() => {
            Operator = Operators.for(symbol);
          });

          it(`results in a ${test.key} operator`, () => {
            assert.deepEqual(Operator, Operators[test.key]);
          });
        });
      });
    });
  });
});
