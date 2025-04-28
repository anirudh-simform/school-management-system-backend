import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { type StudentBatch } from "../../../generated/prisma/index.js";

const prisma = new PrismaClient();

const createStudentBatchPOST = asyncHandler(async function createStudentBatch(
    req: Request<{}, {}, Omit<StudentBatch, "id">>,
    res: Response
) {
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
                program: {
                    connect: {
                        id: Number(req.body.programId),
                    },
                },
            },
        });

        res.status(201).json({
            message: "Student Batch created",
            studentBatch: studentBatch,
        });
    }
});

export { createStudentBatchPOST };
