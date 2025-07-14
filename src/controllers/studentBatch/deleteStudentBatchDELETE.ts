import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const deleteStudentBatchDELETE = asyncHandler(async function deleteStudentBatch(
    req: Request<{ id?: number }, unknown, unknown>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create,edit and delete student batches"
        );
    }

    if (!req.params.id) {
        throw new Error("No request parameters found");
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create,edit and edit student batches"
            );
        }

        const deletedStudentBatch = await prisma.studentBatch.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.status(200).json({
            deleted: deletedStudentBatch,
        });
    }
});

export { deleteStudentBatchDELETE };
