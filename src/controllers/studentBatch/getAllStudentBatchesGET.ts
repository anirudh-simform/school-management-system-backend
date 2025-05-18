import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const getAllStudentBatchesGET = asyncHandler(
    async function getAllStudentBatches(
        req: Request<{}, {}, unknown>,
        res: Response
    ) {
        if (!req.user) {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit student batches"
            );
        }

        if (typeof req.user != "string") {
            if (
                req.user.role != "SchoolSuperAdmin" &&
                req.user.role != "Admin"
            ) {
                throw new UnauthorizedAccessError(
                    "Only School Super Admins and Admins are allowed to create and edit student batches"
                );
            }

            const studentBatches = await prisma.studentBatch.findMany({
                where: {
                    schoolId: req.user.schoolId,
                },
                include: {
                    program: true,
                },
            });

            res.status(200).json(
                studentBatches.map((studentBatch) => {
                    return {
                        id: studentBatch.id,
                        name: studentBatch.name,
                        startDate: studentBatch.startDate,
                        endDate: studentBatch.endDate,
                        gradeLevel: studentBatch.gradeLevelId,
                        program: {
                            id: studentBatch.program.id,
                            name: studentBatch.program.name,
                        },
                    };
                })
            );
        }
    }
);

export { getAllStudentBatchesGET };
