'use strict';

const {Parser, RollDecorator, Roller} = require('./dice');
const Preconditions = require('./preconditions');
const {Classes, Proficiency, Skills, Stats} = require('./reference');
const Validation = require('./validation');

/**
 * Represent one of the six stats for a single character.
 */
class Stat {
    /**
     * @param ref the reference stat
     * @param value the actual value (1-20)
     * @param modifier the straight modifier (used by skills and saves)
     */
    constructor(ref, value, modifier) {
        this.ref = ref;
        this.value = value;
        this.modifier = modifier;
        this.save = modifier;
    }

    get name() {
        return this.ref.name;
    }

    matches(value) {
        return this.ref.matches(value);
    }

    toString() {
        return `${this.name}[${this.value}](${this.modifier}|${this.save})`;
    }
}

/**
 * Represent one of the skills for a single character.
 */
class Skill {
    /**
     * @param ref ref the reference skill
     * @param modifier the final modifier (includes proficiency, expertise, and Jack of all Trades if applicable)
     */
    constructor(ref, modifier) {
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

/**
 * Represent one attack for a single character.
 */
class Attack {
    constructor(name, toHit, damage) {
        this.name = name;
        this.toHit = toHit;
        this.damage = damage;
    }

    matches(value) {
        return new RegExp(`^${this.name}$`, 'i').test(value);
    }

    toString() {
        return `[${this.name}] To Hit: ${this.toHit} Damage: ${this.damage}`;
    }
}

/**
 * Represent a characters race.
 */
class Race {
    constructor(name, sub) {
        this.name = name;
        this.sub = sub;
    }

    toString() {
        return `${this.sub ? this.sub + ' ' : ''}${this.name}`;
    }

    static from(obj) {
        return new Race(obj.name, obj.sub);
    }
}

/**
 * Represent a characters class.
 */
class Class {
    constructor(ref, sub, levels) {
        this.ref = ref;
        this.sub = sub;
        this.levels = levels;
    }

    get name() {
        return `${this.sub ? this.sub + ' ' : ''}${this.ref.name}`
    }

    toString() {
        return `${this.name} ${this.levels}`;
    }

    static from(obj) {
        return new Class(Classes[obj.name], obj.sub, obj.levels);
    }
}

/**
 * Represents a single character.
 */
class Character {
    /**
     * @param id the slack user id (if present)
     * @param name the character name (and hopefully slack display name)
     * @param race the character's race (just for flavor)
     * @param classes the character's class(es)
     * @param level the character's level
     * @param defense the character's defense numbers
     * @param initiative the computed initiative
     * @param stats map of ref stat to {Stat}
     * @param skills map of ref skill to {Skill}
     * @param attacks map of name to {Attack}
     */
    constructor(id, name, race, classes, level, defense, initiative, stats, skills, attacks) {
        this.id = id;
        this.name = name;
        this.race = race;
        this.classes = classes;
        this.level = level;
        this.defense = defense;
        this.initiative = initiative;
        this.stats = stats;
        this.skills = skills;
        this.attacks = attacks;
    }

    get proficiencyModifier() {
        return Proficiency.levelToModifier(this.level);
    }

    /**
     * Returns a string valid for a single initiative roll.
     * @param description the description of the roll
     * @param decorator any required decoration of the roll
     * @returns {string}
     */
    rollInitiative(description='Initiative', decorator=RollDecorator.None) {
        return Roller.roll(Parser.parse(decorator.decorate(`1d20 + ${this.initiative} for ${description}`)));
    }

    /**
     * Returns a string valid for a single ability check roll.
     * @param abilityName the name of the skill or stat
     * @param description the description of the roll
     * @param decorator any required decoration of the roll
     * @returns {string}
     */
    rollAbilityCheck(abilityName, description='', decorator=RollDecorator.None) {
        let ability = Object.values(this.skills).find(skill => skill.matches(abilityName));
        if (!Validation.isDefined(ability)) {
            ability = Object.values(this.stats).find(stat => stat.matches(abilityName));
        }
        Preconditions.checkNotNull(ability, abilityName);
        return Roller.roll(Parser.parse(decorator.decorate(`1d20 + ${ability.modifier} for ${ability.name} ${description}`)));
    }

    /**
     * Returns a string valid for a single saving throw roll.
     * @param statName the name of the stat (full or short)
     * @param description the description of the roll
     * @param decorator any required decoration of the roll
     * @returns {string}
     */
    rollSavingThrow(statName, description='', decorator=RollDecorator.None) {
        const stat = Object.values(this.stats).find(stat => stat.matches(statName));
        Preconditions.checkNotNull(stat, statName);
        return Roller.roll(Parser.parse(decorator.decorate(`1d20 + ${stat.save} for ${stat.name} save ${description}`)));
    }

    /**
     * Returns a string valid for a single attack roll.
     * @param attackName the name of the attack
     * @param description the description of the roll
     * @param decorator any required decoration of the roll
     * @returns {string}
     */
    rollAttackToHit(attackName, description='', decorator=RollDecorator.None) {
        const attack = Object.values(this.attacks).find(attack => attack.matches(attackName));
        Preconditions.checkNotNull(attack, attackName);
        return Roller.roll(Parser.parse(decorator.decorate(`${attack.toHit} for ${attack.name} ${description}`)));
    }

    /**
     * Returns a string valid for a single damage roll.
     * @param attackName the name of the attack
     * @param description the description of the roll
     * @returns {string}
     */
    rollAttackDamage(attackName, description='') {
        const attack = Object.values(this.attacks).find(attack => attack.matches(attackName));
        Preconditions.checkNotNull(attack, attackName);
        return Roller.roll(Parser.parse(`${attack.damage} for ${attack.name} ${description}`));
    }

    /**
     * Construct a character from its JSON representation.
     * @param obj the deserialized JSON object
     * @returns {Character}
     */
    static from(obj) {
        const classes = obj.classes.map(Class.from);
        const level = classes.map(c => c.levels).reduce((a, b) => a + b, 0);
        const proficiencyModifier = Proficiency.levelToModifier(level);
        const stats = {};
        Object.entries(obj.stats).forEach(entry => {
            const [ name, value ] = entry;
            const ref = Stats.enumValueOf(name);
            stats[ref] = new Stat(ref, value, Stats.statToModifier(value));
        });
        let minProficiencyMultiplier = 0;
        classes.forEach((c, index) => {
            if (index === 0) {
                c.ref.saves.forEach(stat => stats[stat].save += proficiencyModifier);
            }
            switch (c.ref) {
                case Classes.Barbarian:
                    // Primal Champion
                    // TODO: make automatic?
                    // if (20 <= c.levels) {
                    //     stats[Stats.Strength] += 4;
                    //     stats[Stats.Constitution] += 4;
                    // }
                    break;
                case Classes.Bard:
                    // Jack of all Trades
                    if (2 <= c.levels) {
                        minProficiencyMultiplier = 0.5;
                    }
                    break;
                case Classes.Paladin:
                    // Aura of Protection
                    if (6 <= c.levels) {
                        const aura = Math.max(stats[Stats.Charisma].modifier, 1);
                        Object.values(stats).forEach(stat => stat.save += aura);
                    }
                    break;
                case Classes.Rogue:
                    // Reliable Talent
                    // TODO: make automatic?
                    // if (11 <= c.levels) {
                    //
                    // }
                    // Slippery Mind
                    if (15 <= c.levels) {
                        stats[Stats.Wisdom].save += proficiencyModifier;
                    }
                    break;
                default:
                    break;
            }
        });
        const skills = {};
        Object.entries(obj.skills).forEach(entry => {
            const [ name, proficiencyMultiplier ] = entry;
            const ref = Skills.enumValueOf(name);
            const finalProficiencyMultiplier = Math.max(proficiencyMultiplier, minProficiencyMultiplier);
            const stat = stats[ref.stat()];
            skills[ref] = new Skill(ref, stat.modifier + Math.floor(finalProficiencyMultiplier * proficiencyModifier));
        });
        const initiative = stats[Stats.Dexterity].modifier + (minProficiencyMultiplier * proficiencyModifier);
        const attacks = {};
        obj.attacks.forEach(attack => {
            const {name, to_hit, damage} = attack;
            attacks[name] = new Attack(name, to_hit, damage);
        });
        return new Character(obj.id, obj.name, Race.from(obj.race), classes, level, obj.defense, initiative, stats, skills, attacks);
    }

    /**
     * Validate that a character can be build from this JSON representation.
     * @param obj the deserialized JSON object
     * @returns boolean
     */
    static isValid(obj) {
        try {
            Preconditions.checkNotNull(obj.name, 'name');
            Preconditions.checkNotNull(obj.race, 'race');
            Preconditions.checkNotNull(obj.defense, 'defense');
            Preconditions.checkNotNull(obj.classes, 'classes');
            Preconditions.checkState(Array.isArray(obj.classes), 'classes must be an Array');
            Preconditions.checkInRange(obj.classes.length, 1, 20);
            Preconditions.checkNotNull(obj.stats, 'stats');
            Stats.enumValues.forEach(stat => {
                Preconditions.checkState(obj.stats.hasOwnProperty(stat.name), 'stats must have ' + stat.name)
            });
            Preconditions.checkNotNull(obj.skills, 'skills');
            Skills.enumValues.forEach(skill => {
                Preconditions.checkState(obj.stats.hasOwnProperty(skill.name), 'stats must have ' + skill.name)
            });
            Preconditions.checkNotNull(obj.attacks, 'attacks');
            Preconditions.checkState(Array.isArray(obj.attacks), 'attacks must be an Array');
            return true;
        } catch (err) {
            return false;
        }
    }
}

module.exports = {
    Character
};
