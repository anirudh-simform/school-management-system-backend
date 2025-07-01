import { PrismaClient } from "../../../generated/prisma/index.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { SearchAcademicTermParams } from "../../models/types.js";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();
const searchAcademicTermGET = asyncHandler(async function searchAcademicTerm(
    req: Request<{}, {}, {}>,
    res: Response
) {
    const query = req.query as unknown as SearchAcademicTermParams;
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit courses"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit courses"
            );
        }

        const years = await prisma.academicTerm.findMany({
            where: {
                startDate: {
                    gte: new Date(Number(query.year), 0, 1),
                    lte: new Date(Number(query.year), 11, 31),
                },
                schoolId: req.user.schoolId,
            },
        });

        res.status(200).json({
            status: "success",
            years: years.length === 0 ? "No matching records found" : years,
        });
    }
});

export { searchAcademicTermGET };
