import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { SuperAdmin } from "../../models/types.js";
import * as argon2 from "argon2";
import asyncHandler from "express-async-handler";
import { Result, validationResult } from "express-validator";
import { ValidationError } from "../../errors/errors.js";
import { logger } from "../../logging/logger.js";

const prisma = new PrismaClient();

const registerSuperAdmin = asyncHandler(async function registerSuperAdmin(
    req: Request<{}, {}, SuperAdmin>,
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

    const passwordHash = await argon2.hash(req.body.password);

    await prisma.superAdmin.create({
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: passwordHash,
            dob: new Date(req.body.dob),
            phone: req.body.phone,
        },
    });

    res.status(201).json({
        status: "success",
        message: "User created successfully",
        user: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            dob: req.body.dob,
            phone: req.body.phone,
        },
    });
});

export { registerSuperAdmin };
