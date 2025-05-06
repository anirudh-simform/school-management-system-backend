import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UnauthorizedAccessError,
    ValidationError,
} from "../../errors/errors.js";
import { UpdateItemRequestParams } from "../../models/types.js";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

const editCoursePOST = asyncHandler(async function editCourse(
    req: Request<UpdateItemRequestParams, unknown, Prisma.CourseCreateInput>,
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

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit courses"
            );
        }

        const updatedCourse = await prisma.course.update({
            data: {
                name: req.body.name,
                description: req.body.description,
            },
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(200).json({
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
            updatedCourse: updatedCourse,
        });
    }
});

export { editCoursePOST };
