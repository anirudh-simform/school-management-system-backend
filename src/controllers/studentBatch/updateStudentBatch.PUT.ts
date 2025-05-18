import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UnauthorizedAccessError,
    BadRequestError,
} from "../../errors/errors.js";
import { type UpdateItemRequestParams } from "../../models/types.js";
import { type StudentBatch } from "../../../generated/prisma/index.js";

const prisma = new PrismaClient();

const updateStudentBatchPUT = asyncHandler(async function updateStudentBatch(
    req: Request<
        UpdateItemRequestParams,
        {},
        Omit<StudentBatch, "id" | "schoolId">
    >,
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
                        id: Number(req.body.gradeLevelId),
                    },
                },
                program: {
                    connect: {
                        id: Number(req.body.programId),
                    },
                },
            },
        });

        res.status(200).json({
            message: "success",
            updatedStudentBatch: updatedStudentBatch,
            studentBatches: await prisma.studentBatch.findMany({
                where: {
                    schoolId: req.user.schoolId,
                },
                select: {
                    id: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                    program: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        });
    }
});

export { updateStudentBatchPUT };
