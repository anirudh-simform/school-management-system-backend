import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const getAllProgramsGET = asyncHandler(async function getAllPrograms(
    req: Request<{}, {}, Prisma.DepartmentCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit programs"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit programs"
            );
        }

        const programs = await prisma.program.findMany({
            where: {
                schoolId: req.user.schoolId,
            },
            include: {
                courses: true,
            },
        });

        res.status(200).json(
            programs.map((program) => {
                return {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    courses: program.courses,
                };
            })
        );
    }
});

export { getAllProgramsGET };
