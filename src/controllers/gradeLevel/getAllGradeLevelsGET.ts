import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { BaseQueryParams } from "../../models/types.js";

import { UnauthorizedAccessError } from "../../errors/errors.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllLevelGradeGET = asyncHandler(async function getAllLevelGrade(
    req: Request<{}, {}, Prisma.GradeLevelCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit student grade levels"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit student grade levels"
            );
        }

        const query = req.query as unknown as BaseQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [gradeLevels, totalCount] = await Promise.all([
            await prisma.gradeLevel.findMany({
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
            prisma.gradeLevel.count(),
        ]);

        res.status(200).json({
            fetch: gradeLevels.map((level) => ({
                id: level.id,
                name: level.name,
                levelOrder: level.levelOrder,
            })),
            totalCount: totalCount,
        });
    }
});

export { getAllLevelGradeGET };
