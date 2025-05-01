import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";
import { validationResult } from "express-validator";

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationError("Error in validating form fields", {
            errors: errors.array(),
        });
    }

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

        const createdCourse = await prisma.course.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                school: {
                    connect: {
                        id: req.user.schoolId,
                    },
                },
            },
        });

        res.status(201).json({
            message: "success",
            courses: (
                await prisma.course.findMany({
                    where: {
                        schoolId: req.user.schoolId,
                    },
                })
            ).map((course) => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                };
            }),
            createdCourse: {
                id: createdCourse.id,
                name: createdCourse.name,
                description: createdCourse.description,
            },
        });
    }
});

export { createCoursePOST };
