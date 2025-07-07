import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateAdminDto } from "../../models/types.js";
import { UnauthorizedAccessError } from "../../errors/errors.js";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

const updateAdminPUT = asyncHandler(async function updateAdmin(
    req: Request<{ id: string }, {}, CreateAdminDto>,
    res: Response
) {
    if (!req.user) {
        throw new UnauthorizedAccessError(
            "Only Super School Admins and School Admins can update other users"
        );
    }

    if (typeof req.user != "string") {
        if (req.user.role != "SchoolSuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only School Super Admins can update other admins"
            );
        }

        const hashedPassword = await argon2.hash(req.body.password);

        const commonData: Prisma.UserUncheckedCreateInput = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            schoolId: Number(req.user.schoolId),
            dob: new Date(req.body.dob),
            role: req.body.role,
        };

        // TODO: update user role specific fields at time of creation

        const admin = await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...commonData,
            },
        });

        res.status(201).json({
            updated: {
                firstname: admin.firstname,
                lastname: admin.lastname,
                gender: admin.gender,
                email: admin.email,
                phone: admin.phone,
                dob: admin.dob,
            },
        });
    }
});

export { updateAdminPUT };
