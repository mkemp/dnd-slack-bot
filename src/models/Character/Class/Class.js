"use strict";

const { Enum } = require("enumify");
const { Stats } = require("../Stat");

class Classes extends Enum {}

Classes.initEnum({
  Barbarian: {
    hitDie: "d12",
    saves: [Stats.Strength, Stats.Constitution]
  },
  Bard: {
    hitDie: "d8",
    saves: [Stats.Dexterity, Stats.Charisma]
  },
  Cleric: {
    hitDie: "d8",
    saves: [Stats.Wisdom, Stats.Charisma]
  },
  Druid: {
    hitDie: "d8",
    saves: [Stats.Intelligence, Stats.Wisdom]
  },
  Fighter: {
    hitDie: "d10",
    saves: [Stats.Strength, Stats.Constitution]
  },
  Monk: {
    hitDie: "d8",
    saves: [Stats.Strength, Stats.Dexterity]
  },
  Paladin: {
    hitDie: "d10",
    saves: [Stats.Wisdom, Stats.Charisma]
  },
  Ranger: {
    hitDie: "d10",
    saves: [Stats.Strength, Stats.Dexterity]
  },
  Rogue: {
    hitDie: "d8",
    saves: [Stats.Dexterity, Stats.Intelligence]
  },
  Sorcerer: {
    hitDie: "d6",
    saves: [Stats.Constitution, Stats.Charisma]
  },
  Warlock: {
    hitDie: "d8",
    saves: [Stats.Wisdom, Stats.Charisma]
  },
  Wizard: {
    hitDie: "d6",
    saves: [Stats.Intelligence, Stats.Wisdom]
  }
});

/**
 * Represent a characters class.
 */
class Class {
  constructor(ref, sub, levels = 1) {
    this.ref = ref;
    this.sub = sub;
    this.levels = levels;
  }

  get name() {
    return `${this.sub ? this.sub + " " : ""}${this.ref.name}`;
  }

  toString() {
    return `${this.name} ${this.levels}`;
  }

  static from(obj) {
    return new Class(Classes[obj.name], obj.sub, obj.levels);
  }
}

module.exports = {
  Class,
  Classes
};
