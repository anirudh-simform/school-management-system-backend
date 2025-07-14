import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
    BadRequestError,
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";
import { UpdateItemRequestParams } from "../../models/types.js";

const prisma = new PrismaClient();

const updateLevelGradePUT = asyncHandler(async function updateLevelGrade(
    req: Request<UpdateItemRequestParams, {}, Prisma.GradeLevelCreateInput>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationError("Error in validating form fields", {
            errors: errors.array(),
        });
    }

    if (!req.params.id) {
        throw new BadRequestError(
            "The request does not contain any request parameters"
        );
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

        const studentGradeLevel = await prisma.gradeLevel.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name: req.body.name,
                levelOrder: Number(req.body.levelOrder),
            },
        });

        res.status(200).json({
            updated: studentGradeLevel,
        });
    }
});

export { updateLevelGradePUT };
