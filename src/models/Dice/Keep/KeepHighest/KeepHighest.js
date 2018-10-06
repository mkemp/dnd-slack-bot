"use strict";

const Keep = require("../../Keep");

module.exports = class KeepHighest extends Keep {
  constructor(limit = 1) {
    super(limit, a => a.sort((a, b) => b - a));
  }

  toString() {
    return `K${this.limit}`;
  }
};
