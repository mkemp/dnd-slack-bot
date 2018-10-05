'use strict';

const {Enum} = require('enumify');
const {formatCharacter, formatRoll} = require('../../helpers/display');
const {Parser, Roller, RollDecorator} = require('../Dice');
const {Skills, Stats} = require('../../helpers//Reference');
const XRegExp = require('xregexp');

/**
 * Pre-compute the regex for all abilities as this never changes.
 */
const allAbilities = (() => {
    const allValidNames = [];
    Skills.enumValues.forEach(skill => {
        allValidNames.push(XRegExp.escape(skill.name));
        skill.aliases().forEach(alias => allValidNames.push(XRegExp.escape(alias)));
    });
    Stats.enumValues.forEach(stat => {
        allValidNames.push(XRegExp.escape(stat.name));
        stat.aliases().forEach(alias => allValidNames.push(XRegExp.escape(alias)));
    });
    return allValidNames.join('|');
})();
/**
 * Pre-compute the regex for all stats as this never changes.
 */
const allStats = (() => {
    const allValidNames = [];
    Stats.enumValues.forEach(stat => {
        allValidNames.push(XRegExp.escape(stat.name));
        stat.aliases().forEach(alias => allValidNames.push(XRegExp.escape(alias)));
    });
    return allValidNames.join('|');
})();

function sortByLength(a, b) {
    return b.length - a.length;
}

class Commands extends Enum {}
Commands.initEnum({
    Ability: {
        execute(character, text, format=formatRoll) {
            /*
             * all groups with index >0 can be undefined
             * 0: full term matched
             * 1: ability name
             * 2: advantage or disadvantage
             * 3: purpose
             */
            this.buildParseRegex();
            const [ _, abilityName, advantageName, purpose ] = this.buildParseRegex().exec(text);
            const evaluations = character.rollAbilityCheck(abilityName, purpose, RollDecorator.for(advantageName));
            return format(character, evaluations);
        },

        buildParseRegex() {
            return new RegExp(`^(?:(${allAbilities})(?:\\s+with ((?:dis)?adv(?:antage)?))?(?:\\s+(?:for\\s+)?)?([\\w ]*))$`, 'gi');
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Rolls an ability check.',
                attachments: [
                    {
                        text: '/ability {ability-name} [with [dis]adv[antage]] [[for] purpose]'
                    }
                ]
            };
        }
    },
    Attack: {
        execute(character, text, format=formatRoll) {
            /*
             * all groups with index >0 can be undefined
             * 0: full term matched
             * 1: attack name
             * 2: advantage or disadvantage
             * 3: purpose
             */
            const [_, attackName, advantageName, purpose] = this.buildParseRegex(character).exec(text);
            const evaluations = character.rollAttackToHit(attackName, purpose, RollDecorator.for(advantageName));
            return format(character, evaluations);
        },

        buildParseRegex(character) {
            return new RegExp(`^(?:(${Object.keys(character.attacks).sort(sortByLength).map(XRegExp.escape).join('|')})(?:\\s+with ((?:dis)?adv(?:antage)?))?(?:\\s+(?:for\\s+)?)?([\\w ]*))$`, 'gi');
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Rolls an attack (to hit).',
                attachments: [
                    {
                        text: '/attack {attack-name} [with [dis]adv[antage]] [[for] purpose]'
                    }
                ]
            };
        }
    },
    Damage: {
        execute(character, text, format=formatRoll) {
            /*
             * all groups with index >0 can be undefined
             * 0: full term matched
             * 1: attack name
             * 2: purpose
             */
            const [ _, attackName, purpose ] = this.buildParseRegex(character).exec(text);
            const evaluations = character.rollAttackDamage(attackName, purpose);
            return format(character, evaluations);
        },

        buildParseRegex(character) {
            return new RegExp(`^(?:(${Object.keys(character.attacks).sort(sortByLength).map(XRegExp.escape).join('|')})(?:\\s+(?:for\\s+)?)?([\\w ]*))$`, 'gi');
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Rolls damage for an attack or spell.',
                attachments: [
                    {
                        text: '/damage {attack-name} [[for] purpose]'
                    }
                ]
            };
        }
    },
    Initiative: {
        execute(character, text, format=formatRoll) {
            /*
             * all groups with index >0 can be undefined
             * 0: full term matched
             * 1: advantage or disadvantage
             * 2: purpose
             */
            const [ _, advantageName, purpose ] = this.buildParseRegex().exec(text);
            const evaluations = character.rollInitiative(purpose, RollDecorator.for(advantageName));
            return format(character, evaluations);
        },

        buildParseRegex() {
            return new RegExp(`^(?:(?:\\s*with ((?:dis)?adv(?:antage)?))?(?:\\s*(?:for\\s+)?)?([\\w ]*))$`, 'gi');
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Rolls initiative.',
                attachments: [
                    {
                        text: '/initiative [with [dis]adv[antage]] [[for] purpose]'
                    }
                ]
            };
        }
    },
    Roll: {
        execute(character, text, format=formatRoll) {
            const evaluations = Roller.roll(Parser.parse(text));
            return format(character, evaluations);
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Roll some dice.',
                attachments: [
                    {
                        text: '/roll {dice-expression} [for {purpose}][, {dice-expression} [for {purpose}]]'
                    }
                ]
            };
        }
    },
    Save: {
        execute(character, text, format=formatRoll) {
            /*
             * all groups with index >0 can be undefined
             * 0: full term matched
             * 1: stat name
             * 2: advantage or disadvantage
             * 3: purpose
             */
            const [ _, statName, advantageName, purpose ] = this.buildParseRegex().exec(text);
            const evaluations = character.rollSavingThrow(statName, purpose, RollDecorator.for(advantageName));
            return format(character, evaluations);
        },

        buildParseRegex() {
            return new RegExp(`^(?:(${allStats})(?:\\s+with ((?:dis)?adv(?:antage)?))?(?:\\s+(?:for\\s+)?)?([\\w ]*))$`, 'gi');
        },

        help() {
            return {
                response_type: 'ephemeral',
                text: 'Rolls a saving throw.',
                attachments: [
                    {
                        text: '/save {stat-name} [with [dis]adv[antage]] [[for] purpose]'
                    }
                ]
            };
        }
    }
});

class Playing {
    static async execute(storage, slackUserId, slackWorkspaceId, characterName) {
        await storage.playingAs(slackUserId, slackWorkspaceId, characterName);
        return {
            response_type: 'ephemeral',
            fallback: `Congratulations! You are now ${characterName}.`,
            text: `Congratulations! You are now *${characterName}*.`,
            mrkdwn_in: 'text'
        };
    }

    static help() {
        return {
            response_type: 'ephemeral',
            text: 'Indicate that you are playing as the specified character.',
            attachments: [
                {
                    text: '/playing {character-name}'
                }
            ]
        };
    }
}

class Store {
    static async execute(storage, slackWorkspaceName, characterText) {
        const characterObj = JSON.parse(characterText.replace(/`/g, ''));
        await storage.store(slackWorkspaceName, characterObj);
        return {
            response_type: 'ephemeral',
            fallback: `Congratulations! You have uploaded ${characterObj.name}.`,
            text: `Congratulations! You have uploaded *${characterObj.name}*.`,
            mrkdwn_in: 'text'
        };
    }

    static help() {
        return {
            response_type: 'ephemeral',
            text: 'Upload a new character sheet.',
            attachments: [
                {
                    text: '/store {character-json}'
                }
            ]
        };
    }
}

class Summarize {
    static async execute(storage, userId, workspaceId, workspaceName, text, format=formatCharacter) {
        const userName = text.replace(/verbose\s*/, '').trim();
        const params = {userId, userName, workspaceId, workspaceName};
        const character = await storage.load(params);
        return format(character, text.startsWith('verbose'));
    }

    static help() {
        return {
            response_type: 'ephemeral',
            text: 'Provides a summary of a character.',
            attachments: [
                {
                    text: '/summarize [verbose] [character-name]'
                }
            ]
        };
    }
}

class Unrecognized {
    static help(command, text) {
        return {
            response_type: 'ephemeral',
            text: `Unrecognized command: /${command} ${text}`
        };
    }
}

module.exports = {
    Commands,
    Playing,
    Store,
    Summarize,
    Unrecognized
};
