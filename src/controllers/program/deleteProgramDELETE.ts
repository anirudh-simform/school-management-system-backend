import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteProgramDELETE = asyncHandler(async function deleteProgram(
    req: Request<{ id?: number }, unknown, unknown>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create,edit and delete program"
        );
    }

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create,edit and edit program"
            );
        }

        const deletedProgram = await prisma.program.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(201).json({
            message: "success",
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
            deletedProgram: deletedProgram,
        });
    }
});

export { deleteProgramDELETE };
