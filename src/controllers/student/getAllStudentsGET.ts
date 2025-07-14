import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import { BaseQueryParams } from "../../models/types.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

const getAllStudentsGET = asyncHandler(async function getAllStudents(
    req: Request<{}, {}, {}>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only School Super Admins and Admins are allowed to create and edit students"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin" && req.user.role != "Admin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins and Admins are allowed to create and edit students"
            );
        }

        const query = req.query as unknown as BaseQueryParams;

        const { take, skip } = getPaginationParams(
            query.pageNumber,
            query.pageSize
        );

        const [students, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: {
                    schoolId: req.user.schoolId,
                    role: "Student",
                    ...(query.query && {
                        OR: [
                            {
                                firstname: {
                                    contains: query.query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                lastname: {
                                    contains: query.query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }),
                },

                orderBy: query.query ? undefined : { createdAt: "desc" },

                skip: skip,
                take: take,
                include: {
                    studentProfile: {
                        select: {
                            studentBatch: true,
                            gradeLevel: true,
                        },
                    },
                },
            }),
            prisma.user.count({
                where: {
                    role: "Student",
                    schoolId: req.user.schoolId,
                },
            }),
        ]);

        res.status(200).json({
            fetch: students.map((student) => {
                return {
                    id: student.id,
                    firstname: student.firstname,
                    lastname: student.lastname,
                    gender: student.gender,
                    dob: student.dob,
                    email: student.email,
                    phone: student.phone,
                    studentBatch: {
                        id: student.studentProfile?.studentBatch.id,
                        name: student.studentProfile?.studentBatch.name,
                    },
                    gradeLevel: {
                        id: student.studentProfile?.gradeLevel.id,
                        name: student.studentProfile?.gradeLevel.name,
                    },
                };
            }),
            totalCount: totalCount,
        });
    }
});

export { getAllStudentsGET };
