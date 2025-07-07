import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteStudentDELETE = asyncHandler(async function updateStudent(
    req: Request<{ id: string }, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can update other users"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins can update other admins"
            );
        }

        // TODO: update user role specific fields at time of creation

        const student = await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(201).json({
            deleted: {
                firstname: student.firstname,
                lastname: student.lastname,
                gender: student.gender,
                email: student.email,
                phone: student.phone,
                dob: student.dob,
            },
        });
    }
});

export { deleteStudentDELETE };
