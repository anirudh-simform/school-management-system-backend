import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateInstructorDto } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

const updateInstructorPUT = asyncHandler(async function updateInstructor(
    req: Request<{ id: string }, {}, CreateInstructorDto>,
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

        const commonData: Partial<Prisma.UserUncheckedCreateInput> = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            schoolId: Number(req.user.schoolId),
            dob: new Date(req.body.dob),
            role: "Instructor",
        };

        // TODO: update user role specific fields at time of creation

        const Instructor = await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...commonData,
                instructorProfile: {
                    update: {
                        department: {
                            connect: {
                                id: Number(req.body.department),
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json({
            updated: {
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

export { updateInstructorPUT };
