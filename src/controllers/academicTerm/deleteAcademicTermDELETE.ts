import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UpdateItemRequestParams } from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteAcademicTermDELETE = asyncHandler(async function createAcademicTerm(
    req: Request<UpdateItemRequestParams, {}, {}>,
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

        const deletedAcademicTerm = await prisma.academicTerm.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({
            status: "success",
            deletedAcademicTerm: {
                id: deletedAcademicTerm.id,
                name: deletedAcademicTerm.name,
                startDate: deletedAcademicTerm.startDate,
                endDate: deletedAcademicTerm.endDate,
            },
        });
    }
});

export { deleteAcademicTermDELETE };
