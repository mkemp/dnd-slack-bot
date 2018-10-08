"use strict";

const ReRoll = require("../../ReRoll");

module.exports = class ReRollHigherThan extends ReRoll {
  constructor(times = 1, greaterThanValue = 0) {
    super(times, value => value > greaterThanValue);
    this.value = `>${greaterThanValue}`;
  }

  toString() {
    return `r${this.times}${this.value}`;
  }
};
