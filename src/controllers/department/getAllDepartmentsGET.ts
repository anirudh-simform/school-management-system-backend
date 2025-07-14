import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import {
    GetProgramQueryParams,
    PaginationQueryParams,
} from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllDepartmentsGET = asyncHandler(async function getAllDepartments(
    req: Request<{}, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit departments"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit departments"
            );
        }

        const query = req.query as unknown as GetProgramQueryParams &
            PaginationQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [departments, totalCount] = await Promise.all([
            prisma.department.findMany({
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
            prisma.department.count(),
        ]);

        res.status(200).json({
            fetch: departments.map((department) => ({
                id: department.id,
                name: department.name,
            })),
            totalCount: totalCount,
        });
    }
});

export { getAllDepartmentsGET };
