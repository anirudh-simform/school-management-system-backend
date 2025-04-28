import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { UpdateDepartmentRequestParams } from "../../models/types.js";

const prisma = new PrismaClient();

const EditDepartmentPOST = asyncHandler(async function editDepartment(
    req: Request<
        UpdateDepartmentRequestParams,
        unknown,
        Prisma.DepartmentCreateInput
    >,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit departments"
        );
    }

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit departments"
            );
        }

        const createdDepartment = await prisma.department.update({
            data: {
                name: req.body.name,
            },
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(201).json({
            message: "success",
            departments: await prisma.department.findMany({
                where: {
                    schoolId: Number(req.user.schoolId),
                },
            }),
            createdDepartment: createdDepartment,
        });
    }
});

export { EditDepartmentPOST };
