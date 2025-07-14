import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validationResult, Result } from "express-validator";
import { authenticateSuperAdmin } from "./utilityMethods/authenticateSuperAdmin.js";
import { logger } from "../../logging/logger.js";
import { ValidationError } from "../../errors/errors.js";
import { PrismaClient, Prisma, Role } from "../../../generated/prisma/index.js";
import * as argon2 from "argon2";

const prisma = new PrismaClient();
const addSchoolSuperAdminPOST = asyncHandler(async function addSchoolSuperAdmin(
    req: Request<{}, {}, Prisma.UserUncheckedCreateInput>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const results: Result<string> = errors.formatWith(
            (error) => error.msg as string
        );
        logger.error(results.array());
        throw new ValidationError(results.array().join(","));
    }

    await authenticateSuperAdmin(req, res);

    const hashedPassword = await argon2.hash(req.body.password);
    await prisma.user.create({
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            dob: new Date(req.body.dob),
            password: hashedPassword,
            role: "SchoolSuperAdmin",
            email: req.body.email,
            phone: req.body.phone,
            schoolId: Number(req.body.schoolId),
        },
    });

    res.json({
        message: "New SchoolSuperAdmin Created",
        user: {
            name: `${req.body.firstname} ${req.body.lastname}`,
            role: req.body.role,
            email: req.body.email,
        },
    });
});

export { addSchoolSuperAdminPOST };
