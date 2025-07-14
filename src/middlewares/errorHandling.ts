import { Request, Response, NextFunction } from "express";
import { ApiError, ValidationError } from "../errors/errors.js";
import { logger } from "../logging/logger.js";

/**
 * @param {(Error | ApiError)} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function handleError(
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;

    if ("statusCode" in err) {
        statusCode = err.statusCode;
    }

    // TODO: Don't log errors for status codes other than 500

    logger.error(err);
    if (err.body && err instanceof ValidationError) {
        res.status(statusCode).json({ message: err.message, body: err.body });
    } else {
        res.status(statusCode).json({ message: err.message });
    }
}

export { handleError };
