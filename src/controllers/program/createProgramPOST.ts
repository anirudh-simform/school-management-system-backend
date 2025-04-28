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

        if (req.body.courses) {
            await prisma.program.create({
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    courses: {
                        connect: req.body.courses.map((course) => {
                            const id = Number(course.id);
                            return { id: id };
                        }),
                    },
                },
            });
        } else {
            await prisma.program.create({
                data: {
                    name: req.body.name,
                    description: req.body.description,
                },
            });
        }

        res.status(201).json({
            message: "Program created",
            program: req.body,
        });
    }
});

export { createProgramPOST };
