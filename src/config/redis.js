import Redis from "ioredis";
import env from "./env.js";
import logger from "./logger.js";

const redis = new Redis( env.REDIS_URL, {maxRetriesPerRequest: null});

redis.on("connect", () => {
    logger.info("Redis Connected");
});

redis.on("error", (err) => {
    logger.error(err);
});

export default redis;