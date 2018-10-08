"use strict";

const Keep = require("../../Keep");

module.exports = class KeepLowest extends Keep {
  constructor(limit = 1) {
    super(limit, a => a.sort((a, b) => a - b));
  }

  toString() {
    return `k${this.limit}`;
  }
};
