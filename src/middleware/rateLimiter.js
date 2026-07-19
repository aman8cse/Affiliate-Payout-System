import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
});

export const withdrawLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
});