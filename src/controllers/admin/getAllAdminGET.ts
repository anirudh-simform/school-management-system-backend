import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { BaseQueryParams } from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllAdminsGET = asyncHandler(async function getAllAdmin(
    req: Request<{}, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit Admin"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit Admin"
            );
        }

        const query = req.query as unknown as BaseQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [Admins, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: {
                    AND: [
                        { schoolId: req.user.schoolId },
                        {
                            OR: [
                                {
                                    firstname: query.query
                                        ? {
                                              contains: query.query,
                                              mode: "insensitive",
                                          }
                                        : undefined,
                                },
                                {
                                    lastname: query.query
                                        ? {
                                              contains: query.query,
                                              mode: "insensitive",
                                          }
                                        : undefined,
                                },
                            ],
                        },
                        {
                            OR: [
                                { role: "Admin" },
                                { role: "SchoolSuperAdmin" },
                            ],
                        },
                    ],
                },

                orderBy: query.query ? undefined : { createdAt: "desc" },

                skip: skip,
                take: take,
            }),
            prisma.user.count({
                where: {
                    OR: [{ role: "Admin" }, { role: "SchoolSuperAdmin" }],
                },
            }),
        ]);

        res.status(200).json({
            fetch: Admins.map((Admin) => {
                return {
                    id: Admin.id,
                    firstname: Admin.firstname,
                    lastname: Admin.lastname,
                    gender: Admin.gender,
                    dob: Admin.dob,
                    email: Admin.email,
                    phone: Admin.phone,
                };
            }),
            totalCount: totalCount,
        });
    }
});

export { getAllAdminsGET };
