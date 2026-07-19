import Redis from "ioredis";
import env from "./env.js";
import logger from "./logger.js";

const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

redis.on("connect", () => {
    logger.info("Redis Connected");
});

redis.on("error", (err) => {
    logger.error(err);
});

export default redis;