import { v4 as uuid } from "uuid";

const requestId = (req, res, next) => {
    req.requestId = uuid();

    res.setHeader("x-request-id", req.requestId);

    next();
};

export default requestId;