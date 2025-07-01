import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { type AddStudentGroupRequest } from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
    BadRequestError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();
const createStudentGroupPOST = asyncHandler(async function createStudentGroup(
    req: Request<{}, {}, AddStudentGroupRequest>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationError("Error in validating form fields", {
            errors: errors.array(),
        });
    }

    try {
        await prisma.$transaction(
            async function createStudentGroupTransaction(tx) {
                if (!req.user) {
                    throw new UnauthorizedAccessError(
                        "Only School Super Admins and Admins are allowed to create and edit courses"
                    );
                }

                if (typeof req.user != "string") {
                    if (
                        req.user.role != "SchoolSuperAdmin" &&
                        req.user.role != "Admin"
                    ) {
                        throw new UnauthorizedAccessError(
                            "Only School Super Admins and Admins are allowed to create and edit courses"
                        );
                    }

                    const createdStudentGroup = await tx.studentGroup.create({
                        data: {
                            name: req.body.name,
                            groupType: req.body.groupType,
                            school: {
                                connect: {
                                    id: req.user.schoolId,
                                },
                            },
                        },
                    });

                    if (req.body.studentProfiles.length != 0) {
                        const updatedStudentGroup =
                            await tx.studentGroup.update({
                                data: {
                                    studentProfile: {
                                        connect: req.body.studentProfiles.map(
                                            (id) => ({
                                                id: Number(id),
                                            })
                                        ),
                                    },
                                },
                                where: {
                                    id: createdStudentGroup.id,
                                },
                            });
                    }

                    res.status(200).json({
                        status: "success",
                        createdStudentGroup: createdStudentGroup,
                    });

                    return 0;
                }
            }
        );
    } catch {
        throw new Error("Could not create Student Group, Please try again");
    }
});

export { createStudentGroupPOST };
