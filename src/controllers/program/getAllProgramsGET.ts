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

const getAllProgramsGET = asyncHandler(async function getAllPrograms(
    req: Request<{}, {}, Prisma.DepartmentCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit programs"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit programs"
            );
        }

        const query = req.query as unknown as GetProgramQueryParams &
            PaginationQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [programs, totalCount] = await Promise.all([
            await prisma.program.findMany({
                where: {
                    schoolId: req.user.schoolId,
                    name: query.name
                        ? { contains: query.name, mode: "insensitive" }
                        : undefined,
                },
                include: {
                    courses: true,
                },
                orderBy: query.name ? undefined : { createdAt: "desc" },
                skip: skip,
                take: take,
            }),
            await prisma.program.count(),
        ]);

        res.status(200).json({
            programs: programs.map((program) => ({
                id: program.id,
                name: program.name,
                description: program.description,
                courses: program.courses,
            })),
            totalCount: totalCount,
        });
    }
});

export { getAllProgramsGET };
