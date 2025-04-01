import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import { User } from "../models/types.js";
import { DataInsertionError, NotFoundError } from "../errors/errors.js";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const registerUserPost = asyncHandler(async function registerUser(
    req: Request<{}, {}, User>,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.throw();
    } else {
        // hash the password before storing

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let addedUser = {};

        if (req.body.role == "Instructor" && req.body.department) {
            const departmentId = await prisma.department.findUnique({
                where: {
                    name: req.body.department,
                },
                select: {
                    id: true,
                },
            });

            if (!departmentId) {
                throw new NotFoundError("department not found");
            }

            const user = await prisma.instructor.create({
                data: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPassword,
                    gender: req.body.gender,
                    dob: new Date(req.body.dob),
                    departmentId: departmentId.id,
                    address: req.body.address,
                },
            });

            if (Object.keys(user).length == 0) {
                throw new DataInsertionError("Error in inserting User");
            }

            addedUser = user;
        } else if (req.body.role == "Admin") {
            const user = await prisma.admin.create({
                data: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPassword,
                    gender: req.body.gender,
                    dob: new Date(req.body.dob),
                    address: req.body.address,
                },
            });

            if (Object.keys(user).length == 0) {
                throw new DataInsertionError("Error in inserting User");
            }

            addedUser = user;
        } else {
            const user = await prisma.student.create({
                data: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPassword,
                    gender: req.body.gender,
                    dob: new Date(req.body.dob),
                    address: req.body.address,
                },
            });

            if (Object.keys(user).length == 0) {
                throw new DataInsertionError("Error in inserting User");
            }

            addedUser = user;
        }

        if ("password" in addedUser) {
            delete addedUser.password;
        }

        res.status(201).json({ user: addedUser, status: "success" });
    }
});

export { registerUserPost };
