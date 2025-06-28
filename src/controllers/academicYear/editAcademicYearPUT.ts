import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    AddAcademicYearRequest,
    UpdateItemRequestParams,
} from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();

const editAcademicYearPUT = asyncHandler(async function createAcademicYear(
    req: Request<UpdateItemRequestParams, {}, AddAcademicYearRequest>,
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
            "Only School Super Admins and Admins are allowed to create and edit courses"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit courses"
            );
        }

        const updatedAcademicYear = await prisma.academicYear.update({
            data: {
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.startDate),
            },
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({
            status: "success",
            updatedAcademicYear: {
                id: updatedAcademicYear.id,
                name: updatedAcademicYear.name,
                startDate: updatedAcademicYear.startDate,
                endDate: updatedAcademicYear.endDate,
            },
        });
    }
});

export { editAcademicYearPUT };
