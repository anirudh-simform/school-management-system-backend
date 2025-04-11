import asyncHandler from "express-async-handler";
import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import { Request, Response } from "express";
import "dotenv/config";
import * as argon2 from "argon2";
import { LoginRequest } from "../../models/types.js";
import { NotFoundError, UnauthorizedAccessError } from "../../errors/errors.js";
import { generateTokenPair } from "../../authentication/utilityMethods/generateTokenPair.js";

const prisma = new PrismaClient();

const userLoginPost = asyncHandler(async function userLogin(
    req: Request<{}, {}, LoginRequest>,
    res: Response
) {
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
            { email: email },
            process.env.ACCESS_TOKEN_EXPIRY,
            process.env.REFRESH_TOKEN_EXPIRY
        );
        res.cookie("accessToken", tokens.accessToken);
        res.cookie("refreshToken", tokens.refreshToken);
        res.status(200).json({ message: "User successfully logged in" });
    } else {
        throw new UnauthorizedAccessError("User does not have access");
    }
});

export { userLoginPost };
