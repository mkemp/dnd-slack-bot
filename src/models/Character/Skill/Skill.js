"use strict";

const { Enum } = require("enumify");
const { Stats } = require("../Stat");

class Skills extends Enum {
  aliases() {
    return [];
  }

  matches(value) {
    return new RegExp(
      `^(?:${this.name}${
        this.aliases().length ? "|" + this.aliases().join("|") : ""
      })$`,
      "i"
    ).test(value);
  }
}

Skills.initEnum({
  Athletics: {
    stat() {
      return Stats.Strength;
    }
  },
  Acrobatics: {
    stat() {
      return Stats.Dexterity;
    }
  },
  SleightOfHand: {
    aliases() {
      return ["Sleight of Hand", "Sleight-of-Hand"];
    },
    stat() {
      return Stats.Dexterity;
    }
  },
  Stealth: {
    stat() {
      return Stats.Dexterity;
    }
  },
  Arcana: {
    stat() {
      return Stats.Intelligence;
    }
  },
  History: {
    stat() {
      return Stats.Intelligence;
    }
  },
  Investigation: {
    stat() {
      return Stats.Intelligence;
    }
  },
  Nature: {
    stat() {
      return Stats.Intelligence;
    }
  },
  Religion: {
    stat() {
      return Stats.Intelligence;
    }
  },
  AnimalHandling: {
    aliases() {
      return ["Animal Handling", "Animal-Handling"];
    },
    stat() {
      return Stats.Wisdom;
    }
  },
  Insight: {
    stat() {
      return Stats.Wisdom;
    }
  },
  Medicine: {
    stat() {
      return Stats.Wisdom;
    }
  },
  Perception: {
    stat() {
      return Stats.Wisdom;
    }
  },
  Survival: {
    stat() {
      return Stats.Wisdom;
    }
  },
  Deception: {
    stat() {
      return Stats.Charisma;
    }
  },
  Intimidation: {
    stat() {
      return Stats.Charisma;
    }
  },
  Performance: {
    stat() {
      return Stats.Charisma;
    }
  },
  Persuasion: {
    stat() {
      return Stats.Charisma;
    }
  }
});

/**
 * Represent one of the skills for a single character.
 */
class Skill {
  /**
   * @param ref ref the reference skill
   * @param modifier the final modifier (includes proficiency, expertise, and Jack of all Trades if applicable)
   */
  constructor(ref, modifier = 0) {
    this.ref = ref;
    this.modifier = modifier;
  }

  get name() {
    return this.ref.name;
  }

  matches(value) {
    return this.ref.matches(value);
  }

  toString() {
    return `${this.name}(${this.modifier})`;
  }
}

module.exports = {
  Skill,
  Skills
};
