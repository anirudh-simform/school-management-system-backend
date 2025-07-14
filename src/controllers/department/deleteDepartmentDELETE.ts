import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteDepartmentDELETE = asyncHandler(async function deleteDepartment(
    req: Request<{ id?: number }, unknown, Prisma.DepartmentCreateInput>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create,edit and delete departments"
        );
    }

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create,edit and edit departments"
            );
        }

        const deletedDepartment = await prisma.department.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(200).json({
            message: "success",
            departments: await prisma.department.findMany({
                where: {
                    schoolId: Number(req.user.schoolId),
                },
            }),
            createdDepartment: deletedDepartment,
        });
    }
});

export { deleteDepartmentDELETE };
