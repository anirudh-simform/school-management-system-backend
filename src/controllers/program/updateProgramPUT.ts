import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UnauthorizedAccessError,
    BadRequestError,
} from "../../errors/errors.js";
import { UpdateProgramRequestParams } from "../../models/types.js";
import { ProgramUpdateInput } from "../../models/types.js";

const prisma = new PrismaClient();

const updateProgramPUT = asyncHandler(async function updateProgram(
    req: Request<UpdateProgramRequestParams, {}, ProgramUpdateInput>,
    res: Response
) {
    // TODO: Update according to latest information
    if (!req.params.id) {
        throw new BadRequestError(
            "The request does not contain any request parameters"
        );
    }
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit program"
        );
    }

    let updatedProgram: {
        id: number;
        name: string;
        description: string;
        schoolId: number;
    };

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit program"
            );
        }

        if (req.body.courses.length > 0) {
            updatedProgram = await prisma.program.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    courses: {
                        set: req.body.courses.map((course) => {
                            const id = Number(course.id);
                            return { id: id };
                        }),
                    },
                },
            });
        } else {
            updatedProgram = await prisma.program.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    courses: {
                        set: [],
                    },
                },
            });
        }

        res.status(200).json({
            message: "success",
            updateProgram: updatedProgram,
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

export { updateProgramPUT };
