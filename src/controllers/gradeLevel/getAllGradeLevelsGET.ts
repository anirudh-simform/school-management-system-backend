import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const getAllLevelGradeGET = asyncHandler(async function getAllLevelGrade(
    req: Request<{}, {}, Prisma.GradeLevelCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit student grade levels"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit student grade levels"
            );
        }

        res.status(200).json({
            message: "success",
            studentGradeLevels: await prisma.gradeLevel.findMany(),
        });
    }
});

export { getAllLevelGradeGET };
