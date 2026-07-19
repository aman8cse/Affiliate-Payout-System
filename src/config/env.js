import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URL: process.env.REDIS_URL,
    ADVANCE_PERCENTAGE: Number(process.env.ADVANCE_PERCENTAGE) || 10,
};

export default env;