import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UnauthorizedAccessError,
    BadRequestError,
} from "../../errors/errors.js";
import {
    StudentBatchCreateDto,
    type UpdateItemRequestParams,
} from "../../models/types.js";

const prisma = new PrismaClient();

const updateStudentBatchPUT = asyncHandler(async function updateStudentBatch(
    req: Request<UpdateItemRequestParams, {}, StudentBatchCreateDto>,
    res: Response
) {
    console.log("inside update student batch");
    // TODO: Update according to latest information
    if (!req.params.id) {
        throw new BadRequestError(
            "The request does not contain any request parameters"
        );
    }
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit student batches"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit student batch"
            );
        }

        const updatedStudentBatch = await prisma.studentBatch.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                gradeLevel: {
                    connect: {
                        id: Number(req.body.gradeLevel),
                    },
                },
                program: {
                    connect: {
                        id: Number(req.body.program),
                    },
                },
            },
        });

        res.status(200).json({
            updated: updatedStudentBatch,
        });
    }
});

export { updateStudentBatchPUT };
