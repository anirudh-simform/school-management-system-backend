import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";
import { type StudentBatch } from "../../../generated/prisma/index.js";

const prisma = new PrismaClient();

const createStudentBatchPOST = asyncHandler(async function createStudentBatch(
    req: Request<{}, {}, Omit<StudentBatch, "id" | "schoolId">>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationError("Error in validating form fields", {
            errors: errors.array(),
        });
    }

    console.log("inside create student batch");
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit student batches"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit student batches"
            );
        }

        const studentBatch = await prisma.studentBatch.create({
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
                school: {
                    connect: {
                        id: req.user.schoolId,
                    },
                },
            },
        });

        res.status(201).json({
            message: "success",
            studentBatch: studentBatch,
            studentBatches: await prisma.studentBatch.findMany({
                where: {
                    schoolId: req.user.schoolId,
                },
                select: {
                    id: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                    gradeLevel: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
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

export { createStudentBatchPOST };
