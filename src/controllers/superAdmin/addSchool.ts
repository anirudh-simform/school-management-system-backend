import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { authenticateSuperAdmin } from "./utilityMethods/authenticateSuperAdmin.js";
import { PrismaClient, Prisma } from "../../../generated/prisma/index.js";
import { validationResult, Result } from "express-validator";
import { logger } from "../../logging/logger.js";
import { ValidationError } from "../../errors/errors.js";
const prisma = new PrismaClient();

const addSchoolPOST = asyncHandler(async function addSchool(
    req: Request<{}, {}, Prisma.SchoolCreateInput>,
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

    const decodedToken = await authenticateSuperAdmin(req, res);

    const school = await prisma.school.create({
        data: {
            name: req.body.name,
            address: req.body.address,
        },
    });

    res.json({ school });
});

export { addSchoolPOST };
