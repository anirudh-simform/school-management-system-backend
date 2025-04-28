import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
import "dotenv/config";
import { generateTokenPair } from "./utilityMethods/generateTokenPair.js";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    InvalidTokenError,
    ReusedTokenError,
} from "../errors/errors.js";
import { verifyJwtPromisified } from "./utilityMethods/verifyJwtPromisified.js";

// TODO: Remove all the console.logs

const prisma = new PrismaClient();

/**
 * Processes the refresh token and responds to the client with a new pair if refresh token is valid otherwise throws an error
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const processRefreshToken = asyncHandler(async function processToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const oldRefreshToken: string = req.cookies.refreshToken;

    if (!oldRefreshToken) {
        throw new AuthTokenNotFoundError(
            "Could not find authentication token in request,make sure you are logged in"
        );
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret) {
        throw new EnvironmentVariableNotFoundError(
            "Environment Variable not found",
            "REFRESH_TOKEN_SECRET"
        );
    }

    try {
        const decoded = await verifyJwtPromisified(
            oldRefreshToken,
            refreshTokenSecret
        );

        if (!decoded) {
            throw new InvalidTokenError("Invalid token, please reauthenticate");
        }

        if (typeof decoded != "string" && decoded.id && decoded.role) {
            const storedToken = await prisma.refreshToken.findFirst({
                where: {
                    AND: [{ userId: decoded.id }, { token: oldRefreshToken }],
                },
            });

            if (!storedToken) {
                throw new InvalidTokenError(
                    "Invalid token,please authenticate again"
                );
            }

            // If jwt already has been used before, delete the stored token and throw error asking the user to reauthenticate
            if (storedToken.used) {
                // If token is used delete all the tokens associated with user
                await prisma.refreshToken.deleteMany({
                    where: {
                        userId: decoded.id,
                    },
                });
                throw new ReusedTokenError(
                    "Reused token,please authenticate again"
                );
            }

            // Update the used status of unused token
            await prisma.refreshToken.updateMany({
                data: {
                    used: true,
                },
                where: {
                    AND: [{ userId: decoded.id }, { token: oldRefreshToken }],
                },
            });

            const newTokens = generateTokenPair(
                { id: decoded.id, role: decoded.role },
                process.env.ACCESS_TOKEN_EXPIRY,
                process.env.REFRESH_TOKEN_EXPIRY
            );

            // Store new token in database
            await prisma.refreshToken.create({
                data: {
                    token: newTokens.refreshToken,
                    used: false,
                    userId: decoded.id,
                },
            });

            res.cookie("accessToken", newTokens.accessToken, {
                httpOnly: true,
            });
            res.cookie("refreshToken", newTokens.refreshToken, {
                httpOnly: true,
            });

            // Add the user object to request object for the next middleware
            req.user = decoded;
            next();
            return;
        }
    } catch (error) {
        if (error == "TokenExpiredError") {
            throw new Error("Token Expired, please reauthenticate");
        } else {
            throw new InvalidTokenError("Invalid token, please reauthenticate");
        }
    }
});

export { processRefreshToken };
