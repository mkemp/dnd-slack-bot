'use strict';

const assert = require('assert');
const {Parser, RollDecorator, Roller} = require('./Dice');
const random = require('random');
const seedrandom = require('seedrandom');
const convertRollToFloat = (roll, max) => (roll - 1) / max;

describe('Parser.parse()', function () {
    describe('handles single expression', function () {
        it('with purpose', function () {
            assert.equal(Parser.parse('2d6r<3 + 5 for damage').toString(), '2d6r1<3 + 5 for damage');
        });

        it('without purpose', function () {
            assert.equal(Parser.parse('2d6r<3 + 5').toString(), '2d6r1<3 + 5');
        });
    });

    describe('handles multiple expressions', function () {
        it('with purposes', function () {
            assert.equal(
                Parser.parse('2d20K1 + 5 for hit; 2d6r<3 + 5 for damage; 1d4! for explosion').toString(),
                '2d20K1 + 5 for hit,2d6r1<3 + 5 for damage,1d4! for explosion'
            );
        });

        it('without purposes', function () {
            assert.equal(Parser.parse('2d20K1 + 5; 2d6r<3 + 5; 1d4!').toString(), '2d20K1 + 5,2d6r1<3 + 5,1d4!');
        });
    });
});


describe('RollDecorator', function() {
    describe('for()', function () {
        const tests = [
            {args: ['adv', 'advantage'],       expected: RollDecorator.Advantage},
            {args: ['', 'foo'],                expected: RollDecorator.None},
            {args: ['disadv', 'disadvantage'], expected: RollDecorator.Disadvantage}
        ];

        tests.forEach(function(test) {
            test.args.forEach(function(arg) {
                it('correctly matches "' + arg + '" to ' + test.expected, function () {
                    assert.equal(RollDecorator.for(arg), test.expected);
                });
            });
        });
    });

    describe('Advantage.decorate()', function () {
        it('correctly replaces 1d20', function () {
            assert.equal(RollDecorator.Advantage.decorate('1d20 + 3'), '2d20K1 + 3');
        });

        it('correctly ignores non-1d20', function () {
            assert.equal(RollDecorator.Advantage.decorate('1d6 + 3'), '1d6 + 3');
        });
    });
    describe('None.decorate()', function () {
        it('correctly provides no modification', function () {
            assert.equal(RollDecorator.None.decorate('1d20 + 3'), '1d20 + 3');
            assert.equal(RollDecorator.None.decorate('1d6 + 3'), '1d6 + 3');
        });
    });
    describe('Disadvantage.decorate()', function () {
        it('correctly replaces 1d20', function () {
            assert.equal(RollDecorator.Disadvantage.decorate('1d20 + 3'), '2d20k1 + 3');
        });

        it('correctly ignores non-1d20', function () {
            assert.equal(RollDecorator.Disadvantage.decorate('1d6 + 3'), '1d6 + 3');
        });
    });
});

describe('Roller.roll()', function () {
    it('evaluates each expression', function () {
        const expressions = [
            {
                toEvaluation: function () {
                    return 'evaluation-1';
                }
            },
            {
                toEvaluation: function () {
                    return 'evaluation-2';
                }
            },
            {
                toEvaluation: function () {
                    return 'evaluation-3';
                }
            }
        ];
        assert.deepEqual(Roller.roll(expressions), ['evaluation-1', 'evaluation-2', 'evaluation-3']);
    });

    describe('with real values', function () {
        it('handles explode', function () {
            random.use(seedrandom('test-seed-5'));
            const evaluations = Roller.roll(Parser.parse('1d4! - 1'), () => random.float());
            assert.equal(evaluations.toString(), '6 - 1 = 5');
            assert.deepEqual(evaluations[0].results[0].rolls, [4, 2]);
        });

        it('handles re-rolls', function () {
            random.use(seedrandom('test-seed-1'));
            const evaluations = Roller.roll(Parser.parse('2d6r<3 + 6'), () => random.float());
            assert.equal(evaluations.toString(), '10 + 6 = 16');
            assert.deepEqual(evaluations[0].results[0].rolls, [4, 6]);
            assert.deepEqual(evaluations[0].results[0].rerolls, [2]);
        });

        describe('keep high', function () {
            it ('keeps the highest when the highest value is first', function () {
                const rolls = [ 18, 8 ];
                const evaluations = Roller.roll(Parser.parse('2d20K1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '18 + 3 = 21');
                assert.deepEqual(evaluations[0].results[0].rolls, [18]);
                assert.deepEqual(evaluations[0].results[0].removed, [8]);
            });

            it ('keeps the highest when the highest value is last', function () {
                const rolls = [ 8, 18 ];
                const evaluations = Roller.roll(Parser.parse('2d20K1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '18 + 3 = 21');
                assert.deepEqual(evaluations[0].results[0].rolls, [18]);
                assert.deepEqual(evaluations[0].results[0].removed, [8]);
            });

            it ('keeps the highest when both values are the same', function () {
                const rolls = [ 10, 10 ];
                const evaluations = Roller.roll(Parser.parse('2d20K1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '10 + 3 = 13');
                assert.deepEqual(evaluations[0].results[0].rolls, [10]);
                assert.deepEqual(evaluations[0].results[0].removed, [10]);
            });
        });

        describe('keep low', function () {
            it ('keeps the lowest when the lowest value is first', function () {
                const rolls = [ 8, 18 ];
                const evaluations = Roller.roll(Parser.parse('2d20k1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '8 + 3 = 11');
                assert.deepEqual(evaluations[0].results[0].rolls, [8]);
                assert.deepEqual(evaluations[0].results[0].removed, [18]);
            });

            it ('keeps the lowest when the lowest value is last', function () {
                const rolls = [ 18, 8 ];
                const evaluations = Roller.roll(Parser.parse('2d20k1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '8 + 3 = 11');
                assert.deepEqual(evaluations[0].results[0].rolls, [8]);
                assert.deepEqual(evaluations[0].results[0].removed, [18]);
            });

            it ('keeps the lowest when both values are the same', function () {
                const rolls = [ 10, 10 ];
                const evaluations = Roller.roll(Parser.parse('2d20k1 + 3'), () => convertRollToFloat(rolls.shift(), 20));
                assert.equal(evaluations.toString(), '10 + 3 = 13');
                assert.deepEqual(evaluations[0].results[0].rolls, [10]);
                assert.deepEqual(evaluations[0].results[0].removed, [10]);
            });
        });
    });
});
