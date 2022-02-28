const Redis = require("ioredis");
const {json} = require("./helpers");

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
        await redis.remove(key);
    } catch (e) {
        console.log(e);
    }
}

const clearAll = async (key) => {
    try {
        await redis.remove();
    } catch (e) {
        console.log(e);
    }
}

exports.get = get;
exports.set = set;
exports.clear = clear;
exports.clearAll = clearAll;
