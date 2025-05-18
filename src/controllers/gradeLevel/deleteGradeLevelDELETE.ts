import { PrismaClient } from "../../../generated/prisma/index.js";
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

const deleteLevelGradeDELETE = asyncHandler(async function deleteLevelGrade(
    req: Request<UpdateItemRequestParams, {}, {}>,
    res: Response
) {
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

        const studentGradeLevel = await prisma.gradeLevel.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(200).json({
            message: "success",
            UpdatedStudentGradeLevel: studentGradeLevel,
            studentGradeLevels: await prisma.gradeLevel.findMany(),
        });
    }
});

export { deleteLevelGradeDELETE };
