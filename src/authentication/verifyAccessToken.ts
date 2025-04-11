import { Request, Response, NextFunction } from "express";
import { JwtPayload, VerifyErrors } from "jsonwebtoken";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    InvalidTokenError,
} from "../errors/errors.js";
import { verifyJwtPromisified } from "./utilityMethods/verifyJwtPromisified.js";
import "dotenv/config";
import { processRefreshToken } from "./processRefreshTokens.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload | string;
    }
}

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
async function verifyAccessToken(
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

    const user = await verifyJwtPromisified(token, secretKey).catch(
        async (err: VerifyErrors) => {
            if (err.name == "TokenExpiredError") {
                await processRefreshToken(req, res, next);
                return;
            } else {
                throw new InvalidTokenError(
                    "Invalid token, please reauthenticate"
                );
            }
        }
    );

    if (req.user && user) {
        req.user = user;
        next();
        return;
    }
}

export { verifyAccessToken };
