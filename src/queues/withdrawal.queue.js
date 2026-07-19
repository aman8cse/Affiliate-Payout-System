import { Queue } from "bullmq";

import redis from "../config/redis.js";

const withdrawalQueue = new Queue("withdrawal", {
    connection: redis
});

export default withdrawalQueue;