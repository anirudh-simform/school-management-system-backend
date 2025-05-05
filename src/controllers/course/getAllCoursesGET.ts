import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

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

        const courses = await prisma.course.findMany({
            where: {
                schoolId: req.user.schoolId,
            },
        });

        res.status(200).json(
            courses.map((course) => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                };
            })
        );
    }
});

export { getAllCoursesGET };
