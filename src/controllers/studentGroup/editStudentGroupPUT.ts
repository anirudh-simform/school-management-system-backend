import { PrismaClient } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
    UpdateItemRequestParams,
    type AddStudentGroupRequest,
} from "../../models/types.js";
import { validationResult } from "express-validator";
import {
    ValidationError,
    UnauthorizedAccessError,
} from "../../errors/errors.js";

const prisma = new PrismaClient();
const editStudentGroupPUT = asyncHandler(async function editStudentGroup(
    req: Request<UpdateItemRequestParams, {}, AddStudentGroupRequest>,
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
            async function editStudentGroupTransaction(tx) {
                if (!req.user) {
                    throw new UnauthorizedAccessError(
                        "Only School Super Admins and Admins are allowed to edit and edit courses"
                    );
                }

                if (typeof req.user != "string") {
                    if (
                        req.user.role != "SchoolSuperAdmin" &&
                        req.user.role != "Admin"
                    ) {
                        throw new UnauthorizedAccessError(
                            "Only School Super Admins and Admins are allowed to edit and edit courses"
                        );
                    }

                    if (req.body.studentProfiles.length == 0) {
                        res.send("Nothing to update");
                        return;
                    }
                    const updatedStudentGroup = await tx.studentGroup.update({
                        data: {
                            name: req.body.name,
                            groupType: req.body.groupType,
                            studentProfile: {
                                set: req.body.studentProfiles.map((id) => ({
                                    id,
                                })),
                            },
                        },
                        where: {
                            id: req.params.id,
                        },
                    });

                    res.status(200).json({
                        status: "success",
                        updatedStudentGroup: updatedStudentGroup,
                    });

                    return 0;
                }
            }
        );
    } catch {
        throw new Error("Could not edit Student Group, Please try again");
    }
});

export { editStudentGroupPUT };
