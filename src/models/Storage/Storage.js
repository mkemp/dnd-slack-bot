'use strict';

const {DynamoDB, S3} = require('aws-sdk');
const Character = require('../Character');
const NodeCache = require('node-cache');
const Preconditions = require('../../helpers/preconditions');
const Validation = require('../../helpers/validation');

function toAttribute(obj) {
    switch ((typeof (obj || '')).toLowerCase()) {
        case 'string':
            return {S: obj || ''};
        case 'number':
            return {N: obj.toString()};
        case 'boolean':
            return {BOOL: obj.toString()};
        default:
            if (Array.isArray(obj)) {
                return {L: obj.map(toAttribute)};
            }
            return {M: toAttributes(obj)}
    }
}

function toAttributes(obj) {
    const attrs = {};
    Object.entries(obj).forEach(entry => {
        const [ key, value ] = entry;
        attrs[key] = toAttribute(value);
    });
    return attrs;
}

class Storage {

    constructor() {
        this.dynamodb = new DynamoDB();
        this.s3 = new S3();
        this.cache = new NodeCache({stdTTL: 3600});
    }

    /**
     * Asynchronously loads a character from storage.
     *
     * workspaceName = team_domain (from Slack)
     * workspaceId = team_id (from Slack)
     * userName = user_name (from Slack)
     * userId = user_id (from Slack)
     *
     * @param params
     */
    async load(params) {
        if (!Validation.isPresent(params.workspaceName)) {
            params.workspaceName = this.translateWorkspace(params.workspaceId);
        }
        if (!Validation.isPresent(params.userName)) {
            params.userName = await this.translateUser(params.userId, params.workspaceId);
        }

        return await this.loadAsync(params);
    }

    loadAsync(params) {
        const campaignName = params.workspaceName.toLowerCase();
        const characterName = params.userName.toLowerCase();
        // work around bad `this` reference in the promise executor
        const s3 = this.s3;
        const cache = this.cache;
        return new Promise((resolve, reject) => {
            let character = cache.get(characterName);
            if (Validation.isDefined(character)) {
                resolve(character);
            } else {
                s3.getObject({Bucket: campaignName, Key: `characters/${characterName}.json`}, (err, data) => {
                    if (err) {
                        console.log(`Error ${err}`);
                        reject(err);
                    }
                    // console.log('response = ' + data.Body.toString('utf-8'));
                    const characterObj = JSON.parse(data.Body.toString('utf-8'));
                    characterObj.id = params.userId;
                    character = Character.from(characterObj);
                    cache.set(characterName, character);
                    resolve(character);
                });
            }
        });
    }

    store(slackWorkspaceName, characterObj) {
        Preconditions.checkState(Character.isValid(characterObj), 'character JSON invalid');
        const campaignName = slackWorkspaceName.toLowerCase();
        const characterName = characterObj.name.toLowerCase();
        // work around bad `this` reference in the promise executor
        const s3 = this.s3;
        return new Promise((resolve, reject) => {
            s3.putObject({
                Bucket: campaignName,
                Key: `characters/${characterName}.json`,
                Body: JSON.stringify(characterObj, null, 2),
                ContentType: 'application/json'
            }, (err, data) => {
                if (err) {
                    console.log(`Error ${err}`);
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    playingAs(slackUserId, slackWorkspaceId, characterName) {
        this.cache.del(characterName.toLowerCase());
        // work around bad `this` reference in the promise executor
        const dynamodb = this.dynamodb;
        return new Promise((resolve, reject) => {
            dynamodb.putItem({
                TableName: 'playing-as',
                Item: toAttributes({slackUserId, slackWorkspaceId, characterName}),
                ReturnConsumedCapacity: 'NONE',
                ReturnValues: 'NONE'
            }, (err, data) => {
                if (err) {
                    console.log(`Error ${err}`);
                    reject(err);
                }
                resolve(data.Attributes);
            });
        });
    }

    // TODO: Do we even need this as Slack sems to always provide the name?
    static translateWorkspace(slackWorkspaceId) {
        return 'westofduskhaven';
    }

    translateUser(slackUserId, slackWorkspaceId) {
        // work around bad `this` reference in the promise executor
        const dynamodb = this.dynamodb;
        return new Promise((resolve, reject) => {
            dynamodb.getItem({
                TableName: 'playing-as',
                Key: toAttributes({slackUserId}),
                ReturnConsumedCapacity: 'NONE'
            }, (err, data) => {
                if (err) {
                    console.log(`Error ${err}`);
                    reject(err);
                }
                if (slackWorkspaceId !== data.Item.slackWorkspaceId.S) {
                    reject(`Expected workspace ${slackWorkspaceId} != ${data.Item.slackWorkspaceId.S}`);
                }
                resolve(data.Item.characterName.S);
            });
        });
    }
}

module.exports = {
    Storage
};
