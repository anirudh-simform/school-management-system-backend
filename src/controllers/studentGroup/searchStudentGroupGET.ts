import { PrismaClient } from "../../../generated/prisma/index.js";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { searchStudentGroupParams } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";

const prisma = new PrismaClient();

const searchStudentGroupGET = asyncHandler(async function searchStudentGroup(
    req: Request<{}, {}, {}>,
    res: Response
) {
    const query = req.query as unknown as searchStudentGroupParams;
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to edit and edit courses"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to edit and edit courses"
            );
        }

        const searchResults = await prisma.studentGroup.findMany({
            where: {
                schoolId: req.user.schoolId,
                name: query.search
                    ? { contains: query.search, mode: "insensitive" }
                    : {},
            },
            orderBy: query.search ? { name: "asc" } : { createdAt: "desc" },
            take: Number(query.limit) || 10,
        });

        res.status(200).json({
            status: "success",
            searchResults: searchResults,
        });
    }
});

export { searchStudentGroupGET };
