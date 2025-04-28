import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    InvalidTokenError,
} from "../errors/errors.js";
import { verifyJwtPromisified } from "./utilityMethods/verifyJwtPromisified.js";
import "dotenv/config";
import { processRefreshToken } from "./processRefreshTokens.js";
import asyncHandler from "express-async-handler";

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload | string;
    }
}

// TODO: Remove all the console.log's

/**
 * @description
 * Verifies Jwt access token:
 * - calls processRefreshToken if access token has expired
 * - throws error if access token is invalid
 * - otherwise appends the decoded ```JwtPayload``` to the request object and passes control to the next middleware
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {*}
 */

const verifyAccessToken = asyncHandler(async function verifyAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies.accessToken;

    if (!token) {
        throw new AuthTokenNotFoundError(
            "Could not find authentication token in request,make sure you are logged in"
        );
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        throw new EnvironmentVariableNotFoundError(
            "Environment variable not found.",
            "ACCESS_TOKEN_SECRET"
        );
    }

    try {
        const user = await verifyJwtPromisified(token, secretKey);

        if (user) {
            req.user = user;

            next();
            return;
        } else {
            throw new Error("An unexpected error occurred");
        }
    } catch (error) {
        if (error == "TokenExpiredError") {
            await processRefreshToken(req, res, next);
            return;
        } else {
            throw new InvalidTokenError("Invalid token, please reauthenticate");
        }
    }
});

export { verifyAccessToken };
