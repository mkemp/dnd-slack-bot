'use strict';

const assert = require('assert');
const {Proficiency, Skills, Stats} = require('./Reference');

describe('Proficiency.levelToModifier()', function() {
    const tests = [
        {arg:  1, expected: 2},
        {arg:  2, expected: 2},
        {arg:  3, expected: 2},
        {arg:  4, expected: 2},
        {arg:  5, expected: 3},
        {arg:  6, expected: 3},
        {arg:  7, expected: 3},
        {arg:  8, expected: 3},
        {arg:  9, expected: 4},
        {arg: 10, expected: 4},
        {arg: 11, expected: 4},
        {arg: 12, expected: 4},
        {arg: 13, expected: 5},
        {arg: 14, expected: 5},
        {arg: 15, expected: 5},
        {arg: 16, expected: 5},
        {arg: 17, expected: 6},
        {arg: 18, expected: 6},
        {arg: 19, expected: 6},
        {arg: 20, expected: 6}
    ];

    tests.forEach(function(test) {
        it('correctly calculates proficiency modifier for level ' + test.arg, function() {
            assert.equal(Proficiency.levelToModifier(test.arg), test.expected);
        });
    });
});

describe('Stats', function() {
    describe('hasOwnProperty', function () {
        const tests = [
            {arg: 'Strength'},
            {arg: 'Dexterity'},
            {arg: 'Constitution'},
            {arg: 'Intelligence'},
            {arg: 'Wisdom'},
            {arg: 'Charisma'}
        ];

        tests.forEach(function(test) {
            it('is true for "' + test.arg + '"', function () {
                assert.equal(Stats.hasOwnProperty(test.arg), true);
            });
        });
    });

    describe('statToModifier()', function() {
        const tests = [
            {arg:  1, expected: -5},
            {arg:  2, expected: -4},
            {arg:  3, expected: -4},
            {arg:  4, expected: -3},
            {arg:  5, expected: -3},
            {arg:  6, expected: -2},
            {arg:  7, expected: -2},
            {arg:  8, expected: -1},
            {arg:  9, expected: -1},
            {arg: 10, expected:  0},
            {arg: 11, expected:  0},
            {arg: 12, expected:  1},
            {arg: 13, expected:  1},
            {arg: 14, expected:  2},
            {arg: 15, expected:  2},
            {arg: 16, expected:  3},
            {arg: 17, expected:  3},
            {arg: 18, expected:  4},
            {arg: 19, expected:  4},
            {arg: 20, expected:  5},
            {arg: 21, expected:  5},
            {arg: 22, expected:  6},
            {arg: 23, expected:  6},
            {arg: 24, expected:  7},
            {arg: 25, expected:  7},
            {arg: 26, expected:  8},
            {arg: 27, expected:  8},
            {arg: 28, expected:  9},
            {arg: 29, expected:  9},
            {arg: 30, expected: 10},
        ];

        tests.forEach(function(test) {
            it('correctly calculates the modifier for ' + test.arg, function() {
                assert.equal(Stats.statToModifier(test.arg), test.expected);
            });
        });
    });

    describe('matches()', function() {
        const tests = [
            {args: ['strength', 'STRENGTH', 'str', 'STR'],         to: Stats.Strength},
            {args: ['dexterity', 'DEXTERITY', 'dex', 'DEX'],       to: Stats.Dexterity},
            {args: ['constitution', 'CONSTITUTION', 'con', 'CON'], to: Stats.Constitution},
            {args: ['intelligence', 'INTELLIGENCE', 'int', 'INT'], to: Stats.Intelligence},
            {args: ['wisdom', 'WISDOM', 'wis', 'WIS'],             to: Stats.Wisdom},
            {args: ['charisma', 'CHARISMA', 'cha', 'CHA'],         to: Stats.Charisma}
        ];

        tests.forEach(function(test) {
            test.args.forEach(function(arg) {
                it('correctly matches "' + arg + '" to ' + test.to, function () {
                    assert.equal(test.to.matches(arg), true);
                });
            });
        });
    });
});

describe('Skills', function() {
    describe('hasOwnProperty', function () {
        const tests = [
            {arg: 'Athletics'},
            {arg: 'Acrobatics'},
            {arg: 'SleightOfHand'},
            {arg: 'Stealth'},
            {arg: 'Arcana'},
            {arg: 'History'},
            {arg: 'Investigation'},
            {arg: 'Nature'},
            {arg: 'Religion'},
            {arg: 'AnimalHandling'},
            {arg: 'Insight'},
            {arg: 'Medicine'},
            {arg: 'Perception'},
            {arg: 'Survival'},
            {arg: 'Deception'},
            {arg: 'Intimidation'},
            {arg: 'Performance'},
            {arg: 'Persuasion'}
        ];

        tests.forEach(function (test) {
            it('is true for "' + test.arg + '"', function () {
                assert.equal(Skills.hasOwnProperty(test.arg), true);
            });
        });
    });
});
