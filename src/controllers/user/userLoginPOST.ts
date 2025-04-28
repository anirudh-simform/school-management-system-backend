import asyncHandler from "express-async-handler";
import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import { Request, Response } from "express";
import "dotenv/config";
import * as argon2 from "argon2";
import { LoginRequest } from "../../models/types.js";
import {
    NotFoundError,
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";
import { generateTokenPair } from "../../authentication/utilityMethods/generateTokenPair.js";
import { validationResult } from "express-validator";
import { logger } from "../../logging/logger.js";

const prisma = new PrismaClient();

/**
 *
 *
 * @param {Request<{}, {}, LoginRequest>} req
 * @param {Response} res
 */
const userLoginPost = asyncHandler(async function userLogin(
    req: Request<{}, {}, LoginRequest>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.error(errors);
        throw new ValidationError("Validation Failed");
    }
    const email = req.body.email;
    const password = req.body.password;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new NotFoundError("User not found, please regiser first");
    }

    if (await argon2.verify(user.password, password)) {
        const tokens = generateTokenPair(
            { id: user.id, role: user.role, schoolId: user.schoolId },
            process.env.ACCESS_TOKEN_EXPIRY,
            process.env.REFRESH_TOKEN_EXPIRY
        );

        // Add refresh token to database for reuse detection
        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                used: false,
                userId: user.id,
            },
        });

        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        res.status(200).json({
            message: "User successfully logged in",
            userDetails: {
                id: user.id,
                role: user.role,
                schoolId: user.schoolId,
            },
        });
    } else {
        throw new UnauthorizedAccessError("User does not have access");
    }
});

export { userLoginPost };
