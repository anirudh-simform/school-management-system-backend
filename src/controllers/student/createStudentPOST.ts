import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateStudentDto, CreateUserDto } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

const createStudentPost = asyncHandler(async function createStudent(
    req: Request<{}, {}, CreateStudentDto>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can create other users"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins can create other admins"
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
            role: "Student",
        };

        // TODO: create user role specific fields at time of creation

        const student = await prisma.user.create({
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

        res.status(201).json({
            created: {
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

export { createStudentPost };
