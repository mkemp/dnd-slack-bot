"use strict";

const { Enum } = require("enumify");
const { isPresent } = require("../../helpers/validation");
const Expression = require("../Expression");
const KeepHighest = require("../Expression/Term/Keep/KeepHighest");
const KeepLowest = require("../Expression/Term/Keep/KeepLowest");
const Operators = require("../Expression/Term/Operators");
const ReRollHigherThan = require("../Expression/Term/ReRoll/ReRollHigherThan");
const ReRollLowerThan = require("../Expression/Term/ReRoll/ReRollLowerThan");
const Term = require("../Expression/Term");

/**
 * Allows decoration of rolls in their string format.
 */
class RollDecorator extends Enum {
  static for(name) {
    switch ((name || "").toLowerCase()) {
      case "adv":
      case "advantage":
        return RollDecorator.Advantage;
      case "disadv":
      case "disadvantage":
        return RollDecorator.Disadvantage;
      default:
        return RollDecorator.None;
    }
  }
}
RollDecorator.initEnum({
  Advantage: {
    decorate(roll) {
      return roll.replace("1d20", "2d20K1");
    }
  },
  None: {
    decorate(roll) {
      return roll;
    }
  },
  Disadvantage: {
    decorate(roll) {
      return roll.replace("1d20", "2d20k1");
    }
  }
});

const splitExpressions = /\s*[,;]\s*/g;
const splitPurpose = " for ";
const splitTerms = /(?:([×*/^v+-])?\s*(?:(\d{0,3})d([%]|\d{1,3})(!)?(r\d{0,3}[<>]\d{1,3})?([kK]\d{1,3})?|(\d{1,5})))/g;
const splitReRoll = /^r(\d{0,3})([<>])(\d{1,3})$/g;

/**
 * Parser for dice syntax.
 */
class Parser {
  static parse(text) {
    return text.split(splitExpressions).map(expression => {
      const indexOfPurpose = expression.indexOf(splitPurpose);
      const termsString =
        indexOfPurpose === -1
          ? expression
          : expression.slice(0, indexOfPurpose).trim();
      const purpose =
        indexOfPurpose === -1
          ? ""
          : expression.slice(indexOfPurpose + 5).trim();
      const terms = [];
      let match;
      while ((match = splitTerms.exec(termsString))) {
        /*
         * all groups with index >0 can be undefined
         * 0: full term matched
         * 1: operator
         * 2: N in NdX
         * 3: X in NdX
         * 4: explode
         * 5: re-roll
         * 6: keep
         * 7: constant
         */
        const [
          _,
          operator,
          number,
          sides,
          explode,
          reroll,
          keep,
          constant
        ] = match;
        const term = new Term();
        term.operator = Operators.for(operator);
        if (isPresent(number)) {
          term.number = Math.max(1, parseInt(number, 10));
        }
        if (isPresent(sides)) {
          term.sides = sides === "%" ? 100 : Math.max(1, parseInt(sides, 10));
        }
        if (isPresent(explode)) {
          term.explode = true;
        }
        if (isPresent(reroll)) {
          splitReRoll.lastIndex = 0; // forces reset
          const match = splitReRoll.exec(reroll);
          /*
           * 0: full term matched
           * 1: T in rT<V/rT>V or '' if missing
           * 2: < or >
           * 3: V in rT<V/rT>V
           */
          const [_, timesString, ltOrGt, valueString] = match;
          const times = isPresent(timesString)
            ? Math.max(1, parseInt(timesString))
            : 1;
          const value = Math.min(
            Math.max(1, parseInt(valueString)),
            term.sides
          );
          term.reroll =
            ltOrGt === ">"
              ? new ReRollHigherThan(times, value)
              : new ReRollLowerThan(times, value);
        }
        if (isPresent(keep)) {
          const limit = Math.min(
            Math.max(1, parseInt(keep.slice(1), 10)),
            term.number
          );
          term.keep =
            keep.slice(0, 1) === "K"
              ? new KeepHighest(limit)
              : new KeepLowest(limit);
        }
        if (isPresent(constant)) {
          term.number = parseInt(constant, 10);
        }
        terms.push(term);
      }
      return new Expression(terms, purpose);
    });
  }
}

class Roller {
  static roll(expressions, random = Math.random) {
    return expressions.map(expression => expression.toEvaluation(random));
  }
}

module.exports = {
  Parser,
  RollDecorator,
  Roller
};
