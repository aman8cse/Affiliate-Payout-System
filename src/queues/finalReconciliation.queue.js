import { Queue } from "bullmq";

import redis from "../config/redis.js";

const finalReconciliationQueue = new Queue(
    "final-reconciliation",
    {
        connection: redis
    }
);

export default finalReconciliationQueue;