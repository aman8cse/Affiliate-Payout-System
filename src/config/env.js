import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URL: process.env.REDIS_URL,
    ADVANCE_PERCENTAGE: Number(process.env.ADVANCE_PERCENTAGE) || 10,
    ADVANCE_PAYMENT_BATCH: process.env.ADVANCE_PAYMENT_BATCH || "*/5 * * * *",
    FINAL_PAYMENT_BATCH: process.env.FINAL_PAYMENT_BATCH || "*/5 * * * *"
};

export default env;