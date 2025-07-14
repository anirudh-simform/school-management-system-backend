import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const userLogoutPOST = asyncHandler(async function (
    req: Request,
    res: Response
) {
    if (!req.user) {
        res.status(200).send();
        return;
    }

    if (typeof req.user != "string") {
        await prisma.refreshToken.deleteMany({
            where: {
                userId: req.user.id,
            },
        });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).send();
});

export { userLogoutPOST };
