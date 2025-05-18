import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();

const createLevelGradePOST = asyncHandler(async function createLevelGrade(
    req: Request<{}, {}, Prisma.GradeLevelCreateInput>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationError("Error in validating form fields", {
            errors: errors.array(),
        });
    }

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

        const studentGradeLevel = await prisma.gradeLevel.create({
            data: {
                name: req.body.name,
                levelOrder: req.body.levelOrder,
            },
        });

        res.status(201).json({
            message: "success",
            createdStudentGradeLevel: studentGradeLevel,
            studentGradeLevels: await prisma.gradeLevel.findMany(),
        });
    }
});

export { createLevelGradePOST };
