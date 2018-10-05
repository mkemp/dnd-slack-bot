"use strict";

/**
 * Represent a characters race.
 */
module.exports = class Race {
  constructor(name, sub) {
    this.name = name;
    this.sub = sub;
  }

  toString() {
    return `${this.sub ? this.sub + " " : ""}${this.name}`;
  }

  static from(obj) {
    return new Race(obj.name, obj.sub);
  }
};
