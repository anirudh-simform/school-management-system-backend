import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import {
    GetCoursesQueryParams,
    PaginationQueryParams,
} from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllCoursesGET = asyncHandler(async function getAllCourses(
    req: Request<{}, {}, Prisma.DepartmentCreateInput>,
    res: Response
) {
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

        const query = req.query as unknown as GetCoursesQueryParams &
            PaginationQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [courses, totalCount] = await Promise.all([
            prisma.course.findMany({
                where: {
                    schoolId: req.user.schoolId,
                    name: query.name
                        ? { contains: query.name, mode: "insensitive" }
                        : undefined,
                },

                orderBy: query.name ? undefined : { createdAt: "desc" },

                skip: skip,
                take: take,
            }),
            prisma.course.count(),
        ]);

        res.status(200).json({
            courses: courses.map((course) => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                };
            }),
            totalCount: totalCount,
        });
    }
});

export { getAllCoursesGET };
