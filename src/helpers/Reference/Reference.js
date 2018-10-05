'use strict';

const {Enum} = require('enumify');
const Preconditions = require('../preconditions');

class Proficiency {
    static levelToModifier(level) {
        Preconditions.checkInRange(level, 1, 20);
        return Math.floor((level - 1) / 4) + 2;
    }
}

class Stats extends Enum {
    aliases() {
        return [this.name.slice(0, 3).toUpperCase()];
    }

    matches(value) {
        return new RegExp(`^(?:${this.name}|${this.aliases().join('|')})$`, 'i').test(value);
    }

    static statToModifier(statValue) {
        Preconditions.checkInRange(statValue, 1, 30);
        return Math.floor((statValue - 10) / 2);
    }
}
Stats.initEnum([
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma'
]);

class Skills extends Enum {
    aliases() {
        return [];
    }

    matches(value) {
        return new RegExp(`^(?:${this.name}${this.aliases().length ? '|' + this.aliases().join('|') : ''})$`, 'i').test(value);
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
            return ['Sleight of Hand', 'Sleight-of-Hand'];
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
            return ['Animal Handling', 'Animal-Handling'];
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

class Classes extends Enum {}
Classes.initEnum({
    Barbarian: {
        hitDie: 'd12',
        saves: [Stats.Strength, Stats.Constitution]
    },
    Bard: {
        hitDie: 'd8',
        saves: [Stats.Dexterity, Stats.Charisma]
    },
    Cleric: {
        hitDie: 'd8',
        saves: [Stats.Wisdom, Stats.Charisma]
    },
    Druid: {
        hitDie: 'd8',
        saves: [Stats.Intelligence, Stats.Wisdom]
    },
    Fighter: {
        hitDie: 'd10',
        saves: [Stats.Strength, Stats.Constitution]
    },
    Monk: {
        hitDie: 'd8',
        saves: [Stats.Strength, Stats.Dexterity]
    },
    Paladin: {
        hitDie: 'd10',
        saves: [Stats.Wisdom, Stats.Charisma]
    },
    Ranger: {
        hitDie: 'd10',
        saves: [Stats.Strength, Stats.Dexterity]
    },
    Rogue: {
        hitDie: 'd8',
        saves: [Stats.Dexterity, Stats.Intelligence]
    },
    Sorcerer: {
        hitDie: 'd6',
        saves: [Stats.Constitution, Stats.Charisma]
    },
    Warlock: {
        hitDie: 'd8',
        saves: [Stats.Wisdom, Stats.Charisma]
    },
    Wizard: {
        hitDie: 'd6',
        saves: [Stats.Intelligence, Stats.Wisdom]
    }
});

module.exports = {
    Classes,
    Proficiency,
    Stats,
    Skills
};
