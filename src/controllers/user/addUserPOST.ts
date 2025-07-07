import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateUserDto } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

const addUserPost = asyncHandler(async function addUser(
    req: Request<{}, {}, CreateUserDto, "schoolId">,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can add other users"
        );
    }

    if (typeof req.user != "string") {
        if (
            req.user.role != "SchoolSuperAdmin" &&
            (req.body.role == "Admin" || req.body.role == "SchoolSuperAdmin")
        ) {
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
            role: req.body.role,
        };

        // TODO: Add user role specific fields at time of creation

        switch (req.body.role) {
            case "Instructor":
                await prisma.user.create({
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
                break;

            case "Admin":
                await prisma.user.create({
                    data: commonData,
                });
                break;

            case "Student":
                await prisma.user.create({
                    data: {
                        ...commonData,
                        studentProfile: {
                            create: {
                                studentBatch: {
                                    connect: {
                                        id: Number(req.body.studentBatch),
                                    },
                                },
                                gradeLevel: {
                                    connect: {
                                        id: Number(req.body.gradeLevel),
                                    },
                                },
                            },
                        },
                    },
                });
                break;
        }

        res.status(201).json({
            message: "success",
            createdUser: {
                name: `${commonData.firstname} ${commonData.lastname}`,
                email: commonData.email,
                schooId: commonData.schoolId,
            },
        });
    }
});

export { addUserPost };
