"use strict";

const { Enum } = require("enumify");
const Validation = require("../../helpers/validation");

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

/**
 * Represents operators between {Term}s.
 */
class Operator extends Enum {
  static for(symbol) {
    switch (symbol) {
      case "-":
        return Operator.Subtract;
      case "*":
      case "x":
        return Operator.Multiply;
      case "/":
        return Operator.Divide;
      case "^":
        return Operator.Max;
      case "v":
        return Operator.Min;
      default:
        return Operator.Add;
    }
  }
}
Operator.initEnum({
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

/**
 * Encapsulates the logic for handling re-rolls.
 */
class ReRoll {
  constructor(times, matchesCondition) {
    this.times = times;
    this.matchesCondition = matchesCondition;
  }

  applyTo(result) {
    if (result.rolls.some(this.matchesCondition)) {
      result.rolls.forEach((value, index) => {
        let newValue = value;
        for (
          let i = 0;
          i < this.times && this.matchesCondition(newValue);
          i++
        ) {
          result.rerolls.push(value);
          newValue = result.rollSingle();
        }
        result.rolls[index] = newValue;
      });
      result.total = 0;
      result.rolls.forEach(value => (result.total += value));
    }
  }
}

class ReRollHigherThan extends ReRoll {
  constructor(times, greaterThanValue) {
    super(times, value => value > greaterThanValue);
    this.value = `>${greaterThanValue}`;
  }

  toString() {
    return `r${this.times}${this.value}`;
  }
}

class ReRollLowerThan extends ReRoll {
  constructor(times, lessThanValue) {
    super(times, value => value < lessThanValue);
    this.value = `<${lessThanValue}`;
  }

  toString() {
    return `r${this.times}${this.value}`;
  }
}

/**
 * Encapsulates the logic for keeping a subset of results.
 */
class Keep {
  constructor(limit, applyOrdering) {
    this.limit = limit;
    this.applyOrdering = applyOrdering;
  }

  applyTo(result) {
    this.applyOrdering(result.rolls);
    result.rolls
      .splice(this.limit)
      .forEach(value => result.removed.push(value));
    result.total = 0;
    result.rolls.forEach(value => (result.total += value));
  }
}

class KeepHighest extends Keep {
  constructor(limit) {
    super(limit, a => a.sort((a, b) => b - a));
  }

  toString() {
    return `K${this.limit}`;
  }
}

class KeepLowest extends Keep {
  constructor(limit) {
    super(limit, a => a.sort((a, b) => a - b));
  }

  toString() {
    return `k${this.limit}`;
  }
}

/**
 * Represents a single term in an {Expression}. Either a NdX or constant.
 */
class Term {
  constructor() {
    this.operator = Operator.Add;
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
}

/**
 * Represents a single term in an {Expression}. Either a NdX or constant.
 */
class Expression {
  constructor(terms, purpose) {
    this.terms = terms;
    this.purpose = purpose;
  }

  toEvaluation(random = Math.random) {
    return new Evaluation(this, random);
  }

  toString() {
    let rendered = this.terms.join(" ");
    if (this.terms[0].operator !== Operator.Subtract) {
      rendered = rendered.slice(2);
    }
    return `${rendered}${this.purpose ? " for " + this.purpose : ""}`;
  }
}

/**
 * Represents the result of a single {Term}.
 */
class Result {
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
}

/**
 * Represents the evaluation of an entire {Expression}.
 */
class Evaluation {
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
          case Operator.Add:
            this.total += result.total;
            break;
          case Operator.Subtract:
            this.total -= result.total;
            break;
          case Operator.Multiply:
            this.total *= result.total;
            break;
          case Operator.Divide:
            // Just ignoring divide by zero.
            if (result.total !== 0) {
              this.total /= result.total;
            }
            break;
          case Operator.Max:
            if (result.total > this.total) {
              this.total = result.total;
            }
            break;
          case Operator.Min:
            if (result.total < this.total) {
              this.total = result.total;
            }
            break;
        }
        if (index > 0) {
          this.text += ` ${result.term.operator.symbol} `;
          this.fallback += ` ${result.term.operator.symbol} `;
        } else if (result.term.operator === Operator.Subtract) {
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
    if (Validation.isPresent(expression.purpose)) {
      this.text += ` for *${this.expression.purpose}*`;
      this.fallback += ` for ${this.expression.purpose}`;
    }
  }

  toString() {
    return this.fallback;
  }
}

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
        term.operator = Operator.for(operator);
        if (Validation.isPresent(number)) {
          term.number = Math.max(1, parseInt(number, 10));
        }
        if (Validation.isPresent(sides)) {
          term.sides = sides === "%" ? 100 : Math.max(1, parseInt(sides, 10));
        }
        if (Validation.isPresent(explode)) {
          term.explode = true;
        }
        if (Validation.isPresent(reroll)) {
          splitReRoll.lastIndex = 0; // forces reset
          const match = splitReRoll.exec(reroll);
          /*
           * 0: full term matched
           * 1: T in rT<V/rT>V or '' if missing
           * 2: < or >
           * 3: V in rT<V/rT>V
           */
          const [_, timesString, ltOrGt, valueString] = match;
          const times = Validation.isPresent(timesString)
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
        if (Validation.isPresent(keep)) {
          const limit = Math.min(
            Math.max(1, parseInt(keep.slice(1), 10)),
            term.number
          );
          term.keep =
            keep.slice(0, 1) === "K"
              ? new KeepHighest(limit)
              : new KeepLowest(limit);
        }
        if (Validation.isPresent(constant)) {
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
