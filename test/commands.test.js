'use strict';

const assert = require('assert');
const {Commands} = require('../src/commands');
const {RollDecorator} = require('../src/dice');

describe('Commands', function () {
    function formatRoll(character, evaluation) {
        assert.equal(evaluation, 'evaluation');
        return 'formatted-evaluation';
    }

    describe('Ability.execute()', function () {
        it('handles check', function () {
            const character = {
                rollAbilityCheck: function (abilityName, description, decorator) {
                    assert.equal(abilityName, 'athletics');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Ability.execute(character, 'athletics', formatRoll), 'formatted-evaluation');
        });

        it('handles check with advantage', function () {
            const character = {
                rollAbilityCheck: function (abilityName, description, decorator) {
                    assert.equal(abilityName, 'athletics');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Advantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Ability.execute(character, 'athletics with adv', formatRoll), 'formatted-evaluation');
        });

        it('handles check with disadvantage', function () {
            const character = {
                rollAbilityCheck: function (abilityName, description, decorator) {
                    assert.equal(abilityName, 'athletics');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Disadvantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Ability.execute(character, 'athletics with disadvantage', formatRoll), 'formatted-evaluation');
        });

        it('handles check with purpose', function () {
            const character = {
                rollAbilityCheck: function (abilityName, description, decorator) {
                    assert.equal(abilityName, 'athletics');
                    assert.equal(description, 'jumping');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Ability.execute(character, 'athletics for jumping', formatRoll), 'formatted-evaluation');
        });

        it('handles help', function () {
            assert.deepEqual(Commands.Ability.help(), Commands.Ability.help());
        });
    });

    describe('Attack.execute()', function () {
        const attacks = {
            "Greatsword": {
                name: "Greatsword",
                toHit: "1d20 + 10",
                damage: "2d6 + 6"
            },
            "Greatsword with Smite": {
                name: "Greatsword with Smite",
                toHit: "1d20 + 10",
                damage: "2d6r<3 + 2d8r<3 + 6"
            }
        };

        it('handles check', function () {
            const character = {
                rollAttackToHit: function (attackName, description, decorator) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Attack.execute(character, 'Greatsword with Smite', formatRoll), 'formatted-evaluation');
        });

        it('handles check with advantage', function () {
            const character = {
                rollAttackToHit: function (attackName, description, decorator) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Advantage);
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Attack.execute(character, 'Greatsword with Smite with adv', formatRoll), 'formatted-evaluation');
        });

        it('handles check with disadvantage', function () {
            const character = {
                rollAttackToHit: function (attackName, description, decorator) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Disadvantage);
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Attack.execute(character, 'Greatsword with Smite with disadvantage', formatRoll), 'formatted-evaluation');
        });

        it('handles check with purpose', function () {
            const character = {
                rollAttackToHit: function (attackName, description, decorator) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, 'against foes');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Attack.execute(character, 'Greatsword with Smite against foes', formatRoll), 'formatted-evaluation');
        });

        it('handles help', function () {
            assert.deepEqual(Commands.Attack.help(), Commands.Attack.help());
        });
    });

    describe('Damage.execute()', function () {
        const attacks = {
            "Greatsword": {
                name: "Greatsword",
                toHit: "1d20 + 10",
                damage: "2d6 + 6"
            },
            "Greatsword with Smite": {
                name: "Greatsword with Smite",
                toHit: "1d20 + 10",
                damage: "2d6r<3 + 2d8r<3 + 6"
            }
        };

        it('handles check', function () {
            const character = {
                rollAttackDamage: function (attackName, description) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, '');
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Damage.execute(character, 'Greatsword with Smite', formatRoll), 'formatted-evaluation');
        });

        it('handles check with purpose', function () {
            const character = {
                rollAttackDamage: function (attackName, description) {
                    assert.equal(attackName, 'Greatsword with Smite');
                    assert.equal(description, 'against foes');
                    return 'evaluation'
                },
                attacks
            };
            assert.equal(Commands.Damage.execute(character, 'Greatsword with Smite against foes', formatRoll), 'formatted-evaluation');
        });

        it('handles help', function () {
            assert.deepEqual(Commands.Damage.help(), Commands.Damage.help());
        });
    });

    describe('Initiative.execute()', function () {
        it('handles check', function () {
            const character = {
                rollInitiative: function (description, decorator) {
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Initiative.execute(character, '', formatRoll), 'formatted-evaluation');
        });

        it('handles check with advantage', function () {
            const character = {
                rollInitiative: function (description, decorator) {
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Advantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Initiative.execute(character, 'with adv', formatRoll), 'formatted-evaluation');
        });

        it('handles check with disadvantage', function () {
            const character = {
                rollInitiative: function (description, decorator) {
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Disadvantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Initiative.execute(character, 'with disadvantage', formatRoll), 'formatted-evaluation');
        });

        it('handles check with purpose', function () {
            const character = {
                rollInitiative: function (description, decorator) {
                    assert.equal(description, 'mortal combat');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Initiative.execute(character, 'for mortal combat', formatRoll), 'formatted-evaluation');
        });

        it('handles help', function () {
            assert.deepEqual(Commands.Initiative.help(), Commands.Initiative.help());
        });
    });

    describe('Save.execute()', function () {
        it('handles check', function () {
            const character = {
                rollSavingThrow: function (statName, description, decorator) {
                    assert.equal(statName, 'CON');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Save.execute(character, 'CON', formatRoll), 'formatted-evaluation');
        });

        it('handles check with advantage', function () {
            const character = {
                rollSavingThrow: function (statName, description, decorator) {
                    assert.equal(statName, 'CON');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Advantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Save.execute(character, 'CON with adv', formatRoll), 'formatted-evaluation');
        });

        it('handles check with disadvantage', function () {
            const character = {
                rollSavingThrow: function (statName, description, decorator) {
                    assert.equal(statName, 'CON');
                    assert.equal(description, '');
                    assert.equal(decorator, RollDecorator.Disadvantage);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Save.execute(character, 'CON with disadvantage', formatRoll), 'formatted-evaluation');
        });

        it('handles check with purpose', function () {
            const character = {
                rollSavingThrow: function (statName, description, decorator) {
                    assert.equal(statName, 'CON');
                    assert.equal(description, 'near death');
                    assert.equal(decorator, RollDecorator.None);
                    return 'evaluation'
                }
            };
            assert.equal(Commands.Save.execute(character, 'CON for near death', formatRoll), 'formatted-evaluation');
        });

        it('handles help', function () {
            assert.deepEqual(Commands.Save.help(), Commands.Save.help());
        });
    });
});
