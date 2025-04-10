import { Request, Response, NextFunction } from "express";
import { type ApiError } from "../models/types.js";
import { logger } from "../logging/logger.js";

/**
 * @param {(Error | ApiError)} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function handleError(
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    if ("statusCode" in err) {
        statusCode = err.statusCode;
    }

    logger.error(err);
    res.status(statusCode).json({ message: err.message });
}

export { handleError };
