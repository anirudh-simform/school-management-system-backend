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

const updateProgramPOST = asyncHandler(async function updateProgram(
    req: Request<UpdateProgramRequestParams, {}, ProgramUpdateInput>,
    res: Response
) {
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

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit program"
            );
        }

        if (req.body.courses && req.body.courses.length > 0) {
            await prisma.program.update({
                where: {
                    id: Number(req.params.id),
                },
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
            await prisma.program.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                },
            });
        }

        res.status(200).json({
            message: "Program updated",
            program: req.body,
        });
    }
});

export { updateProgramPOST };
