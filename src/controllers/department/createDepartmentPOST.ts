import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const createDepartmentPOST = asyncHandler(async function createDepartment(
    req: Request<{}, {}, Prisma.DepartmentCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit departments"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit departments"
            );
        }

        const createdDepartment = await prisma.department.create({
            data: {
                name: req.body.name,
                school: {
                    connect: {
                        id: req.user.schoolId,
                    },
                },
            },
        });

        res.status(201).json({
            message: "success",
            departments: await prisma.department.findMany({
                where: {
                    schoolId: req.user.schoolId,
                },
            }),
            createdDepartment: createdDepartment,
        });
    }
});

export { createDepartmentPOST };
