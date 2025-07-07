import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateInstructorDto, CreateUserDto } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

const createInstructorPost = asyncHandler(async function addInstructor(
    req: Request<{}, {}, CreateInstructorDto>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can add other users"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins can add other admins"
            );
        }

        const hashedPassword = await argon2.hash(req.body.password);

        const commonData: Prisma.UserUncheckedCreateInput = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            schoolId: Number(req.user.schoolId),
            dob: new Date(req.body.dob),
            role: "Instructor",
        };

        // TODO: Add user role specific fields at time of creation

        const Instructor = await prisma.user.create({
            data: {
                ...commonData,
                instructorProfile: {
                    create: {
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
            created: {
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

export { createInstructorPost };
