import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { BaseQueryParams } from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

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

            const query = req.query as unknown as BaseQueryParams;

            const { take, skip } = getPaginationParams(
                query.pageNumber,
                query.pageSize
            );

            const [studentBatches, totalCount] = await Promise.all([
                await prisma.studentBatch.findMany({
                    include: {
                        program: true,
                        gradeLevel: true,
                    },
                    where: {
                        schoolId: req.user.schoolId,
                        name: query.query
                            ? { contains: query.query, mode: "insensitive" }
                            : undefined,
                    },
                    orderBy: query.query ? undefined : { createdAt: "desc" },

                    skip: skip,
                    take: take,
                }),
                prisma.studentBatch.count(),
            ]);

            res.status(200).json({
                fetch: studentBatches.map((studentBatch) => {
                    return {
                        id: studentBatch.id,
                        name: studentBatch.name,
                        startDate: studentBatch.startDate,
                        endDate: studentBatch.endDate,
                        gradeLevel: {
                            id: studentBatch.gradeLevelId,
                            name: studentBatch.gradeLevel.name,
                        },
                        program: {
                            id: studentBatch.program.id,
                            name: studentBatch.program.name,
                        },
                    };
                }),
                totalCount: totalCount,
            });
        }
    }
);

export { getAllStudentBatchesGET };
