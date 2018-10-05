# dnd-slack-bot

Provides player and DM tools for playing D&D 5e in a Slack channel.

## Characters

Are stored as JSON files in S3. You can store (create or update) a character by using the following command. The command will strip any backticks (\`).

    /store {character-json}

Afterwards run the following command to start playing as that character.

    /playing {character-name}

The character JSON format is as follows.

    TODO

An example character JSON files is:

    {
      "name": "Valaris",
      "race": {
        "name": "Aasimar",
        "sub": "Fallen"
      },
      "classes": [
        {
          "name": "Paladin",
          "sub": "Vengeance",
          "levels": 10
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
          "damage": "2d6r<3 + 6"
        },
        {
          "name": "Greatsword with Smite",
          "to_hit": "1d20 + 10",
          "damage": "2d6r<3 + 2d8r<3 + 6"
        },
        {
          "name": "Greatsword with GWF",
          "to_hit": "1d20 + 5",
          "damage": "2d6 + 16"
        },
        {
          "name": "Greatsword with GWF+Smite",
          "to_hit": "1d20 + 5",
          "damage": "2d6r<3 + 2d8r<3 + 16"
        },
        {
          "name": "Dagger",
          "to_hit": "1d20 + 9",
          "damage": "1d4 + 5"
        }
      ]
    }

### Rolling Attacks, Ability Checks and Saving Throws

Computed off of provided character data.

Under the covers, uses syntax described below.

### DM Tools

TODO: Summarize

## Dice Expressions

The dice logic is borrows heavily from [dicebot](https://github.com/arkie/dicebot). The bot watches for relevant
commands and uses the same underlying formula to resolve them.

1. An optional operation, either:

   - `+` for addition
   - `-` for subtraction
   - `*` or `x` for multiplication
   - `/` for division
   - `^` for maximum
   - `v` for minimum

   If there is no operation, addition is assumed (e.g. `1d20 1d20` will roll two d20s and add the results).

   There is no "order of operations" or grouping of roll expressions, each expression's operation applies its value to
   the result of all the preceding expressions. For example, `1d4 * 1d6 ^ 1d8 + 1d10` will roll 1d4, then roll 1d6 and
   multiply the previous result by that, then roll 1d8 and take either that value or the previous result, whichever is
   higher, then roll 1d10 and add it to the previous result. If the rolls were `1 5 3 8`, the result would be
   `(((1 * 5) ^ 3) + 8)`, totalling 13.

2. A "dice expression", defined below.
3. Optionally, a purpose, like `2d6 for damage`,
   which will print out in the results to help explain what was rolled (the purpose will consume all the text from
   `for` up to the next comma or semicolon).

### Basics of Dice Expressions

Simple expressions involving standard dice notation is supported. You can do things like:

- `NdX`: rolls `N` `X`-sided dice (`1d6` is a single 6-sided die, `2d4` is two
  4-sided dice).
- `dX` is the same as `1dX` (so you can shorten `1d6` to `d6`).
- `NdX!` is the exploding die mechanic (on max roll, roll again).
- `NdXrT<V` lets you re-roll values less than `V` up to `T` times (default is once).
- `NdXrT>V` lets you re-roll values greater than `V` up to `T` times (default is once).
- `NdXKH`: rolls the dice and keeps the `H` highest results. For example, `2d20K1` is the 5e "advantage" mechanic.
- `NdXkL`: like `K` but keeps the `L` lowest results. For example, `2d20k1` is the 5e's "disadvantage" mechanic.

### Full syntax and semantics

The parser recognizes the following grammar:

    Expression ::=
          | (' '* Operator? ' '* Die)+ Purpose? ','?
          | (' '* Operator? ' '* Die)+ Purpose? ';'?

    Operator ::=
          | [*/^v+-] (+ is default if not specified)

    Dice ::=
          | Integer? 'd' Integer Modifier? (NdX or NdXM; missing N defaults to 1)
          | Integer (treated as one 1 sided dice with a single value)

    Modifier ::=
          | Explode? Reroll? Keep?

    Explode ::=
          | '!' (NdX!)

    Reroll ::=
          | 'r' Integer? '<' Integer (NdXrT<V, re-roll values less than V up to T times, missing T defaults to 1)
          | 'r' Integer? '>' Integer (NdXrT>V, re-roll values greater than V up to T times, missing T defaults to 1)

    Keep ::=
          | 'K' Integer (NdXKH, keep highest H)
          | 'k' Integer (NdXkL, keep lowest L)

    Purpose ::=
          | ' for ' <text>

    Integer ::=
          | [0-9]+

## Operations

### Install

Make sure you're using the version of node listed in the `.nvmrc` file, then run `npm install`.

### Development

Tests can be run via `npm run test`.

### Build & Deploy

Deployed as an AWS Lambda function that is fronted by an API Gateway.

Running `npm run-script build` will create a `dnd-slack-bot.zip` that can be upload to AWS Lambda.

### Storage

TODO: DynamoDB? RDS? S3?
