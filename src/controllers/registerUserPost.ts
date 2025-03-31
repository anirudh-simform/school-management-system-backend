import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import { User } from "../models/types.js";
const prisma = new PrismaClient();

async function registerUserPost(req: Request<{}, {}, User>, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        // hash the password before storing

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        try {
            if (req.body.role == "Instructor" && req.body.department) {
                const departmentId = await prisma.department.findUnique({
                    where: {
                        name: req.body.department,
                    },
                    select: {
                        id: true,
                    },
                });

                if (departmentId) {
                    await prisma.instructor.create({
                        data: {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                            password: hashedPassword,
                            gender: req.body.gender,
                            dob: req.body.dob,
                            departmentId: departmentId.id,
                            address: req.body.address,
                        },
                    });
                }
            } else if (req.body.role == "Admin") {
                await prisma.admin.create({
                    data: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hashedPassword,
                        gender: req.body.gender,
                        dob: req.body.dob,
                        address: req.body.address,
                    },
                });
            } else {
                await prisma.student.create({
                    data: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hashedPassword,
                        gender: req.body.gender,
                        dob: req.body.dob,
                        address: req.body.address,
                    },
                });
            }
        } catch {
            throw new Error("An error occured when registering user");
        }
    }
}
export { registerUserPost };
