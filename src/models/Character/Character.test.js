'use strict';

const assert = require('assert');
const Character = require('./Character');
const { RollDecorator } = require('../Dice');
const { Skills } = require('../../helpers/Reference');

const bardObj = {
    "name": "Balven",
    "race": {
        "name": "Half-Elf"
    },
    "classes": [
        {
            "name": "Bard",
            "sub": "Lore",
            "levels": 9
        }
    ],
    "stats": {
        "Strength": 9,
        "Dexterity": 16,
        "Constitution": 12,
        "Intelligence": 10,
        "Wisdom": 12,
        "Charisma": 20
    },
    "skills": {
        "Athletics": 0,
        "Acrobatics": 1,
        "SleightOfHand": 0,
        "Stealth": 1,
        "Arcana": 0,
        "History": 0,
        "Investigation": 0,
        "Nature": 0,
        "Religion": 0,
        "AnimalHandling": 0,
        "Insight": 0,
        "Medicine": 0,
        "Perception": 1,
        "Survival": 0,
        "Deception": 0,
        "Intimidation": 0,
        "Performance": 2,
        "Persuasion": 1
    },
    "defense": {
        "hp": 70,
        "ac": 15
    },
    "attacks": [
        {
            "name": "Rapier",
            "to_hit": "1d20 + 3",
            "damage": "1d8 + 3"
        }
    ]
};

const paladinObj = {
    "name": "Valaris",
    "race": {
        "name": "Aasimar",
        "sub": "Fallen"
    },
    "classes": [
        {
            "name": "Paladin",
            "sub": "Vengeance",
            "levels": 9
        }
    ],
    "stats": {
        "Strength": 20,
        "Dexterity": 10,
        "Constitution": 14,
        "Intelligence": 8,
        "Wisdom": 10,
        "Charisma": 16
    },
    "skills": {
        "Athletics": 1,
        "Acrobatics": 0,
        "SleightOfHand": 0,
        "Stealth": 0,
        "Arcana": 0,
        "History": 0,
        "Investigation": 0,
        "Nature": 0,
        "Religion": 0,
        "AnimalHandling": 0,
        "Insight": 1,
        "Medicine": 0,
        "Perception": 0,
        "Survival": 1,
        "Deception": 0,
        "Intimidation": 0,
        "Performance": 0,
        "Persuasion": 1
    },
    "defense": {
        "hp": 104,
        "ac": 19
    },
    "attacks": [
        {
            "name": "Greatsword",
            "to_hit": "1d20 + 10",
            "damage": "2d6 + 6"
        },
        {
            "name": "Greatsword with Smite",
            "to_hit": "1d20 + 10",
            "damage": "2d6r<3 + 2d8r<3 + 6"
        }
    ]
};

function toExpressionString(evaluations) {
    return evaluations.map(evaluation => evaluation.expression.toString()).toString();
}

describe('Character', function () {
    describe('from()', function () {
        it('handles bard', function () {
            const character = Character.from(bardObj);
            assert.equal(character.name, 'Balven');
            assert.equal(character.race.toString(), 'Half-Elf');
            assert.equal(character.level, 9);
            assert.equal(character.classes.length, 1);
            assert.equal(character.classes[0].toString(), 'Lore Bard 9');
            assert.equal(character.initiative, 5);
            assert.equal(character.proficiencyModifier, 4);
            assert.equal(character.skills[Skills.Athletics].modifier, 1);
            assert.equal(character.skills[Skills.Acrobatics].modifier, 7);
            assert.equal(character.skills[Skills.Performance].modifier, 13);
        });

        it('handles paladin', function () {
            const character = Character.from(paladinObj);
            assert.equal(character.name, 'Valaris');
            assert.equal(character.race.toString(), 'Fallen Aasimar');
            assert.equal(character.level, 9);
            assert.equal(character.classes.length, 1);
            assert.equal(character.classes[0].toString(), 'Vengeance Paladin 9');
            assert.equal(character.initiative, 0);
            assert.equal(character.proficiencyModifier, 4);
            assert.equal(character.skills[Skills.Athletics].modifier, 9);
            assert.equal(character.skills[Skills.Acrobatics].modifier, 0);
            assert.equal(character.skills[Skills.Performance].modifier, 3);
        });
    });

    describe('rollAbilityCheck()', function () {
        const character = Character.from(paladinObj);

        it('handles check', function () {
            assert.equal(toExpressionString(character.rollAbilityCheck('Athletics')), '1d20 + 9 for Athletics');
            assert.equal(toExpressionString(character.rollAbilityCheck('INT')), '1d20 - 1 for Intelligence');
        });

        it('handles check with advantage', function () {
            assert.equal(
                toExpressionString(character.rollAbilityCheck('Athletics', '', RollDecorator.Advantage)),
                '2d20K1 + 9 for Athletics'
            );
            assert.equal(
                toExpressionString(character.rollAbilityCheck('INT', '', RollDecorator.Advantage)),
                '2d20K1 - 1 for Intelligence'
            );
        });

        it('handles check with disadvantage', function () {
            assert.equal(
                toExpressionString(character.rollAbilityCheck('Athletics', '', RollDecorator.Disadvantage)),
                '2d20k1 + 9 for Athletics'
            );
            assert.equal(
                toExpressionString(character.rollAbilityCheck('INT', '', RollDecorator.Disadvantage)),
                '2d20k1 - 1 for Intelligence'
            );
        });

        it('handles check with purpose', function () {
            assert.equal(
                toExpressionString(character.rollAbilityCheck('Athletics', 'to be heroic')),
                '1d20 + 9 for Athletics to be heroic'
            );
            assert.equal(
                toExpressionString(character.rollAbilityCheck('INT', 'to be heroic')),
                '1d20 - 1 for Intelligence to be heroic'
            );
        });
    });

    describe('rollAttackToHit()', function () {
        const character = Character.from(paladinObj);

        it('handles check', function () {
            assert.equal(
                toExpressionString(character.rollAttackToHit('Greatsword with Smite')),
                '1d20 + 10 for Greatsword with Smite'
            );
        });

        it('handles check with advantage', function () {
            assert.equal(
                toExpressionString(character.rollAttackToHit('Greatsword with Smite', '', RollDecorator.Advantage)),
                '2d20K1 + 10 for Greatsword with Smite'
            );
        });

        it('handles check with disadvantage', function () {
            assert.equal(
                toExpressionString(character.rollAttackToHit('Greatsword with Smite', '', RollDecorator.Disadvantage)),
                '2d20k1 + 10 for Greatsword with Smite'
            );
        });

        it('handles check with purpose', function () {
            assert.equal(
                toExpressionString(character.rollAttackToHit('Greatsword with Smite', 'against foes')),
                '1d20 + 10 for Greatsword with Smite against foes'
            );
        });
    });

    describe('rollAttackDamage()', function () {
        const character = Character.from(paladinObj);

        it('handles check', function () {
            assert.equal(
                toExpressionString(character.rollAttackDamage('Greatsword with Smite')),
                '2d6r1<3 + 2d8r1<3 + 6 for Greatsword with Smite'
            );
        });

        it('handles check with purpose', function () {
            assert.equal(
                toExpressionString(character.rollAttackDamage('Greatsword with Smite', 'against foes')),
                '2d6r1<3 + 2d8r1<3 + 6 for Greatsword with Smite against foes'
            );
        });
    });

    describe('rollInitiative()', function () {
        const character = Character.from(paladinObj);

        it('handles check', function () {
            assert.equal(toExpressionString(character.rollInitiative()), '1d20 + 0 for Initiative');
        });

        it('handles check with advantage', function () {
            assert.equal(
                toExpressionString(character.rollInitiative('Initiative', RollDecorator.Advantage)),
                '2d20K1 + 0 for Initiative'
            );
        });

        it('handles check with disadvantage', function () {
            assert.equal(
                toExpressionString(character.rollInitiative('Initiative', RollDecorator.Disadvantage)),
                '2d20k1 + 0 for Initiative'
            );
        });

        it('handles check with purpose', function () {
            assert.equal(toExpressionString(character.rollInitiative('mortal combat')), '1d20 + 0 for mortal combat');
        });
    });

    describe('rollSavingThrow()', function () {
        const character = Character.from(paladinObj);

        it('handles check', function () {
            assert.equal(toExpressionString(character.rollSavingThrow('CON')), '1d20 + 5 for Constitution save');
        });

        it('handles check with advantage', function () {
            assert.equal(
                toExpressionString(character.rollSavingThrow('CON', '', RollDecorator.Advantage)),
                '2d20K1 + 5 for Constitution save'
            );
        });

        it('handles check with disadvantage', function () {
            assert.equal(
                toExpressionString(character.rollSavingThrow('CON', '', RollDecorator.Disadvantage)),
                '2d20k1 + 5 for Constitution save'
            );
        });

        it('handles check with purpose', function () {
            assert.equal(
                toExpressionString(character.rollSavingThrow('CON', 'death avoidance')),
                '1d20 + 5 for Constitution save death avoidance'
            );
        });
    });
});
