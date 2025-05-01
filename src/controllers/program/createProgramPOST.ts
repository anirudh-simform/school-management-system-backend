import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { type ProgramRequest } from "../../models/types.js";

const prisma = new PrismaClient();

const createProgramPOST = asyncHandler(async function createProgram(
    req: Request<{}, {}, ProgramRequest>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit program"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit program"
            );
        }

        let createdProgram: {
            id: number;
            name: string;
            description: string;
            schoolId: number;
        };

        if (req.body.courses.length > 0) {
            createdProgram = await prisma.program.create({
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    courses: {
                        connect: req.body.courses.map((course) => {
                            const id = Number(course.id);
                            return { id: id };
                        }),
                    },
                    school: {
                        connect: {
                            id: req.user.schoolId,
                        },
                    },
                },
            });
        } else {
            createdProgram = await prisma.program.create({
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
        }
        res.status(201).json({
            message: "success",
            createdProgram: {
                id: createdProgram.id,
                name: createdProgram.name,
                description: createdProgram.description,
            },
            programs: (
                await prisma.program.findMany({
                    where: {
                        schoolId: req.user.schoolId,
                    },
                    include: {
                        courses: true,
                    },
                })
            ).map((program) => {
                return {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    courses: program.courses,
                };
            }),
        });
    }
});

export { createProgramPOST };
