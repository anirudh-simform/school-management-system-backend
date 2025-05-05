import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteCourseDELETE = asyncHandler(async function deleteCourse(
    req: Request<{ id?: number }, unknown, unknown>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create,edit and delete courses"
        );
    }

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create,edit and edit courses"
            );
        }

        const deletedCourse = await prisma.course.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(201).json({
            message: "success",
            courses: (
                await prisma.course.findMany({
                    where: {
                        schoolId: Number(req.user.schoolId),
                    },
                })
            ).map((course) => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                };
            }),
            deletedCourse: deletedCourse,
        });
    }
});

export { deleteCourseDELETE };
