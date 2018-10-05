'use strict';

const {
  Commands,
  Playing,
  Store,
  Summarize,
  Unrecognized
} = require("./models/Commands");
const { Storage } = require("./models/Storage");

const querystring = require('querystring');
const XRegExp = require('xregexp');

XRegExp.install('natives');

const storage = new Storage();

function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function handleCommandWithArguments(params) {
  const commandName = toTitleCase(params.command.trim().slice(1));
  const text = params.text.trim();
  if (Commands.hasOwnProperty(commandName)) {
    if (text === 'help') {
      return Commands[commandName].help();
    } else {
      let character = await storage.load({
        workspaceName: params.team_domain,
        workspaceId: params.team_id,
        userId: params.user_id
      });
      // HACK: Workaround for /roll so a user doesn't require a character
      if ('Roll' === commandName && !character) {
        character = { id: params.user_id }
      }
      return Commands[commandName].execute(character, text);
    }
  } else if ('Summarize' === commandName) {
    if (text === 'help') {
      return Summarize.help();
    }
    return await Summarize.execute(
      storage,
      params.user_id,
      params.team_id,
      params.team_domain,
      text
    );
  } else if ('Playing' === commandName) {
    if (text === 'help') {
      return Playing.help();
    }
    return await Playing.execute(storage, params.user_id, params.team_id, text);
  } else if ('Store' === commandName) {
    if (text === 'help') {
      return Store.help();
    }
    return await Store.execute(storage, params.team_domain, text);
  } else {
    console.log(`Error handling request ${JSON.stringify(params)}`);
    return Unrecognized.help(commandName.toLowerCase(), text);
  }
}

function handleFormEncoded(encoded) {
  const parameters = {};
  Object.entries(querystring.parse(encoded)).forEach(([k, v]) => parameters[k] = v);
  return parameters;
}

module.exports = {
  handleCommandWithArguments,
  handleFormEncoded
};
