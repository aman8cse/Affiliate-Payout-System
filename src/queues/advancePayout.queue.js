import { Queue } from "bullmq";

import redis from "../config/redis.js";

const advancePayoutQueue = new Queue("advance-payout", {
    connection: redis
});

export default advancePayoutQueue;