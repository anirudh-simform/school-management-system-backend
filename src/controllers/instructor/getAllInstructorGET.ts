import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { BaseQueryParams } from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllInstructorsGET = asyncHandler(async function getAllInstructor(
    req: Request<{}, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit Instructor"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit Instructor"
            );
        }

        const query = req.query as unknown as BaseQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [instructors, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: {
                    schoolId: req.user.schoolId,
                    role: "Instructor",
                    OR: [
                        {
                            firstname: query.query
                                ? { contains: query.query, mode: "insensitive" }
                                : undefined,
                        },
                        {
                            lastname: query.query
                                ? { contains: query.query, mode: "insensitive" }
                                : undefined,
                        },
                    ],
                },

                orderBy: query.query ? undefined : { createdAt: "desc" },

                skip: skip,
                take: take,
            }),
            prisma.user.count({
                where: {
                    role: "Instructor",
                },
            }),
        ]);

        res.status(200).json({
            fetch: instructors.map((instructor) => {
                return {
                    id: instructor.id,
                    firstname: instructor.firstname,
                    lastname: instructor.lastname,
                    gender: instructor.gender,
                    dob: instructor.dob,
                    email: instructor.email,
                    phone: instructor.phone,
                };
            }),
            totalCount: totalCount,
        });
    }
});

export { getAllInstructorsGET };
