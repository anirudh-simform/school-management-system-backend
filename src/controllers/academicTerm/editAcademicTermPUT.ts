import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    AddAcademicTermRequest,
    UpdateItemRequestParams,
} from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();

const editAcademicTermPUT = asyncHandler(async function createAcademicTerm(
    req: Request<UpdateItemRequestParams, {}, AddAcademicTermRequest>,
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

        const updatedAcademicTerm = await prisma.academicTerm.update({
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
            updatedAcademicTerm: {
                id: updatedAcademicTerm.id,
                name: updatedAcademicTerm.name,
                startDate: updatedAcademicTerm.startDate,
                endDate: updatedAcademicTerm.endDate,
            },
        });
    }
});

export { editAcademicTermPUT };
