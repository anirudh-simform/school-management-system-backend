import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma/index.js";
import * as argon2 from "argon2";
import { Request, Response } from "express";
import { type LoginRequest } from "../../models/types.js";
import { NotFoundError } from "../../errors/errors.js";
import { generateTokenPair } from "../../authentication/utilityMethods/generateTokenPair.js";

const prisma = new PrismaClient();

const loginSuperAdmin = asyncHandler(async function login(
    req: Request<{}, {}, LoginRequest>,
    res: Response
) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await prisma.superAdmin.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new NotFoundError("User not found,please register first");
    }

    if (await argon2.verify(user.password, password)) {
        const tokens = generateTokenPair({ email: email }, "6h", "7d");

        res.status(200).json({ accessToken: tokens.accessToken });
        return;
    } else {
        res.status(401).send();
        return;
    }
});

export { loginSuperAdmin };
