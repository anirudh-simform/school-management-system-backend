import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
import "dotenv/config";
import { generateTokenPair } from "./utilityMethods/generateTokenPair.js";
import { VerifyErrors } from "jsonwebtoken";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    InvalidTokenError,
    ReusedTokenError,
} from "../errors/errors.js";
import { verifyJwtPromisified } from "./utilityMethods/verifyJwtPromisified.js";

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

    const decoded = await verifyJwtPromisified(
        oldRefreshToken,
        refreshTokenSecret
    ).catch((err: VerifyErrors) => {
        throw err;
    });

    if (!decoded) {
        throw new InvalidTokenError("Invalid token, please reauthenticate");
    }

    if (typeof decoded != "string" && decoded.email) {
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                AND: [{ userId: decoded.email }, { token: oldRefreshToken }],
            },
        });

        if (!storedToken) {
            throw new InvalidTokenError(
                "Invalid token,please authenticate again"
            );
        }

        // If jwt already used before delete the stored token and throw error asking to reauthenticate
        if (storedToken.used) {
            await prisma.refreshToken.delete({
                where: {
                    id: storedToken.id,
                },
            });
            throw new ReusedTokenError(
                "Reused token,please authenticate again"
            );
        }

        const newTokens = generateTokenPair(
            { email: decoded.email },
            "1d",
            "7d"
        );

        res.cookie("accessToken", newTokens.accessToken);
        res.cookie("refreshToken", newTokens.refreshToken);
    }
});

export { processRefreshToken };
