import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { connectDB } from "./config/db.js";
import "./config/redis.js";
import advanceQueue from "./queues/advancePayout.queue.js";
import finalQueue from "./queues/finalReconciliation.queue.js";

import "./workers/advancePayout.worker.js";
import "./workers/finalReconciliation.worker.js";
import "./workers/withdrawal.worker.js";

async function bootstrap() {
    await connectDB();
    await advanceQueue.upsertJobScheduler(
        "advance-batch",
        {
            pattern: "* * * * *"
        },
        {
            name: "advance-payout"
        }
    );

    await finalQueue.upsertJobScheduler(
        "final-batch",
        {
            pattern: "* * * * *"
        },
        {
            name: "final-reconciliation"
        }
    );

    app.listen(env.PORT, () => {

        logger.info(
            `Server running on port ${env.PORT}`
        );

    });

}

bootstrap();