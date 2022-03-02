const Redis = require("ioredis");
const {numArray} = require("../controllers/libs/helpers");
const {json} = require("./helpers");
const {CONSTANTS: {REDIS}} = require('../libs/constants');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: '',
});

const get = async (key) => {
    try {
        const val = await redis.get(key)
        return json(val);
    } catch (e) {
        console.log(e);
        return false
    }
}

const set = async (key, value) => {
    try {
        await redis.set(key, value);
    } catch (e) {
        console.log(e);
    }
}

const clear = async (key) => {
    try {
        await redis.set(key, null);
    } catch (e) {
        console.log(e);
    }
}

const clearAll = async () => {
    try {
        for (const key in REDIS) {
            await clear(REDIS[key]);
        }

        for (const key of numArray(1000)) {
            await clear(`${REDIS.CRYPTO_FLUCTUATION}-${key}`);
        }
    } catch (e) {
        console.log(e);
    }
}

exports.get = get;
exports.set = set;
exports.clear = clear;
exports.clearAll = clearAll;
