"use strict";

const ReRoll = require("../../ReRoll");

module.exports = class ReRollLowerThan extends ReRoll {
  constructor(times = 1, lessThanValue = 101) {
    super(times, value => value < lessThanValue);
    this.value = `<${lessThanValue}`;
  }

  toString() {
    return `r${this.times}${this.value}`;
  }
};
