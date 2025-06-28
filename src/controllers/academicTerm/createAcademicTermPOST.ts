import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AddAcademicTermRequest } from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();

const createAcademicTermPOST = asyncHandler(async function createAcademicTerm(
    req: Request<{}, {}, AddAcademicTermRequest>,
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

        const createdAcademicTerm = await prisma.academicTerm.create({
            data: {
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.startDate),
                academicYear: {
                    connect: {
                        id: req.body.academicYearId,
                    },
                },
                school: {
                    connect: {
                        id: req.user.schoolId,
                    },
                },
            },
        });

        res.status(200).json({
            status: "success",
            createdAcademicTerm: {
                name: createdAcademicTerm.name,
                startDate: createdAcademicTerm.startDate,
                endDate: createdAcademicTerm.endDate,
            },
        });
    }
});

export { createAcademicTermPOST };
