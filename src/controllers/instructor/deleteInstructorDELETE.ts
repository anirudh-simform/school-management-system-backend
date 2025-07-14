import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteInstructorDELETE = asyncHandler(async function deleteInstructor(
    req: Request<{ id: string }, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can delete other users"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins can delete other admins"
            );
        }

        // TODO: delete user role specific fields at time of creation

        const Instructor = await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(201).json({
            deleted: {
                firstname: Instructor.firstname,
                lastname: Instructor.lastname,
                gender: Instructor.gender,
                email: Instructor.email,
                phone: Instructor.phone,
                dob: Instructor.dob,
            },
        });
    }
});

export { deleteInstructorDELETE };
