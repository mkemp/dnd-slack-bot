'use strict';

const {handleCommandWithArguments, handleFormEncoded} = require('src/index');
const Validation = require('src/validation');

async function processEvent(event, callback) {
    const params = handleFormEncoded(event.body);
    const result = await handleCommandWithArguments(params);
    if (Validation.isDefined(result)) {
        callback(null, result)
    } else {
        callback(`Call to ${event.path} was not recognized`);
    }
}

module.exports.handler = async (event, context, callback) => {
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? (err.message || err) : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    await processEvent(event, done);
};
