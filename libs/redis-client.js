const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: '',
});

const get = async (key) => {
    try {
        const val = await redis.get(key)
        return val;
    } catch (e) {
        console.log(e);
        return ''
    }
}

const set = async (key, value) => {
    try {
        await redis.set(key, value);
    } catch (e) {
        console.log(e);
    }
}


exports.get = get;
exports.set = set;
