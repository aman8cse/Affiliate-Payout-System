import mongoose from "mongoose";

import env from "./env.js";
import logger from "./logger.js";

export async function connectDB() {
    try {
        await mongoose.connect(env.MONGO_URI);
        logger.info("MongoDB Connected");
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}