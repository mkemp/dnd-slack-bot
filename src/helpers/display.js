"use strict";

const { Stats } = require("../models/Character/Stat");
const { Skills } = require("../models/Character/Skill");
const Validation = require("./validation");

function formatCharacter(character, verbose) {
  const fields = [];
  character.classes.forEach(c => {
    fields.push(
      {
        title: "Class",
        value: c.name,
        short: true
      },
      {
        title: "Levels",
        value: c.levels,
        short: true
      }
    );
  });
  fields.push(
    {
      title: "HP",
      value: character.defense.hp,
      short: true
    },
    {
      title: "AC",
      value: character.defense.ac,
      short: true
    }
  );
  fields.push({
    title: `==== Stats ======`
  });
  Stats.enumValues.forEach(ref => {
    const stat = character.stats[ref];
    fields.push(
      {
        title: `${ref.name} Modifier`,
        value: `${0 <= stat.modifier ? "+" : ""}${stat.modifier}`,
        short: true
      },
      {
        title: `${ref.name} Saving Throw`,
        value: `${0 <= stat.save ? "+" : ""}${stat.save}`,
        short: true
      }
    );
  });
  if (verbose) {
    fields.push({
      title: `==== Skills =====`
    });
    Skills.enumValues.forEach(ref => {
      const skill = character.skills[ref];
      fields.push({
        title: `${ref.name} Modifier`,
        value: `${0 <= skill.modifier ? "+" : ""}${skill.modifier}`,
        short: true
      });
    });
    fields.push({
      title: `==== Attacks ====`
    });
    Object.values(character.attacks).forEach(attack => {
      fields.push(
        {
          title: `${attack.name} To Hit`,
          value: attack.toHit,
          short: true
        },
        {
          title: `${attack.name} Damage`,
          value: attack.damage,
          short: true
        }
      );
    });
  }
  return {
    response_type: "ephemeral",
    attachments: [
      {
        fallback: `Summary of ${character.name} the ${character.race}`,
        text: `Summary of *${character.name}* the *${character.race}*`,
        fields: fields,
        mrkdwn_in: "text"
      }
    ]
  };
}

function formatRoll(character, evaluations) {
  const fields = [];
  evaluations.forEach(evaluation => {
    evaluation.results.forEach(result => {
      if (!result.term.constant) {
        fields.push(
          {
            title: "Dice",
            value: result.term.toCanonicalForm(),
            short: true
          },
          {
            title: "Rolls",
            value: result.rolls.join(" "),
            short: true
          }
        );
        if (Validation.isDefined(result.term.reroll)) {
          fields.push(
            {
              title: `When ${result.term.reroll.value}`,
              value: `${result.term.reroll.times} time(s)`,
              short: true
            },
            {
              title: "Re-rolled",
              value: result.rerolls.join(" "),
              short: true
            }
          );
        }
        if (Validation.isDefined(result.term.keep)) {
          fields.push(
            {
              title: "Keep",
              value: result.term.keep.limit.toString(),
              short: true
            },
            {
              title: "Removed",
              value: result.removed.join(" "),
              short: true
            }
          );
        }
      }
    });
  });
  return {
    response_type: "in_channel",
    attachments: [
      {
        fallback: `<@${character.id}> rolled ${evaluations
          .map(evaluation => evaluation.fallback)
          .join("; ")}`,
        text: `<@${character.id}> rolled ${evaluations
          .map(evaluation => evaluation.text)
          .join("; ")}`,
        fields: fields,
        mrkdwn_in: "text"
      }
    ]
  };
}

module.exports = {
  formatCharacter,
  formatRoll
};
