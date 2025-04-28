import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const createCoursePOST = asyncHandler(async function createCourse(
    req: Request<
        {},
        {},
        Omit<
            Prisma.CourseCreateInput,
            "programs | assignments | courseSchedules"
        >
    >,
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

        await prisma.course.create({
            data: {
                name: req.body.name,
                description: req.body.description,
            },
        });

        res.status(201).json({
            message: "Course created",
            course: req.body,
        });
    }
});

export { createCoursePOST };
