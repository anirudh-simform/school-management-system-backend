import { body, Meta } from "express-validator";
import { PrismaClient } from "../../generated/prisma/index.js";
import { Request } from "express";
const prisma = new PrismaClient();
const validateUserRegistration = [
    body("firstname")
        .trim()
        .notEmpty()
        .withMessage("Firstname cannot be empty")
        .isAlpha()
        .withMessage("Firstname can only contain alphabets")
        .isLength({ min: 1 })
        .withMessage("Firstname must be atleast one character long"),
    body("lastname")
        .trim()
        .notEmpty()
        .withMessage("Lastname cannot be empty")
        .isAlpha()
        .withMessage("Lastname can only contain alphabets")
        .isLength({ min: 1 })
        .withMessage("Lastname must be atleast one character long"),
    body("role")
        .isIn(["Admin", "Instructor", "Student"])
        .withMessage("Unsupported user role"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Must be a valid email")
        .custom(emailAlreadyExists),
    body("phone").trim().isMobilePhone("en-IN"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 characters long"),
    body("gender")
        .exists()
        .isIn(["Male", "Female"])
        .withMessage("Unsupported gender value"),
    body("dob").isDate(),
    body("department")
        .optional()
        .custom(validateDepartment)
        .withMessage("Department not recognised"),
    body("address")
        .trim()
        .notEmpty()
        .withMessage("The address field cannot be empty"),
];

async function validateDepartment(department: string) {
    try {
        const departments: { name: string }[] =
            (await prisma.department.findMany({
                select: {
                    name: true,
                },
            })) as { name: string }[];

        const departmentsArray: string[] = departments.map(
            (value) => value.name
        );

        if (departmentsArray.includes(department)) {
            return true;
        } else {
            return Promise.reject("Department is invalid");
        }
    } catch {
        throw new Error("Error in department validation");
    }
}

async function emailAlreadyExists(email: string, meta: Meta) {
    let returnedEmail;
    try {
        let userAlreadyRegistered = false;
        if ("role" in meta.req.body) {
            switch (meta.req.body.role) {
                case "Instructor":
                    returnedEmail = await prisma.instructor.findUnique({
                        select: {
                            email: true,
                        },
                        where: {
                            email: email,
                        },
                    });

                    if (returnedEmail) {
                        userAlreadyRegistered = true;
                    }
                    break;

                case "Student":
                    returnedEmail = await prisma.student.findUnique({
                        select: {
                            email: true,
                        },
                        where: {
                            email: email,
                        },
                    });

                    if (returnedEmail) {
                        userAlreadyRegistered = true;
                    }
                    break;

                case "Admin":
                    returnedEmail = await prisma.admin.findUnique({
                        select: {
                            email: true,
                        },
                        where: {
                            email: email,
                        },
                    });

                    if (returnedEmail) {
                        userAlreadyRegistered = true;
                    }
                    break;
            }

            if (userAlreadyRegistered) {
                return Promise.reject("User already registered");
            }
        }
    } catch (err) {
        throw new Error("An error occured in validation");
    }
}

export { validateUserRegistration };
