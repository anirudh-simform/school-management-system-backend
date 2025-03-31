import { body } from "express-validator";
import { PrismaClient } from "../../generated/prisma/index.js";
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
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Must be a valid email"),
    body("phone").trim().isMobilePhone("any"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 characters long"),
    body("gender")
        .exists()
        .isIn(["Male,Female"])
        .withMessage("Unsupported gender value"),
    body("dob").isDate({ format: "DD/MM/YYYY" }),
    body("department").optional().custom(validateDepartment),
    body("role")
        .isIn(["Admin", "Instructor", "Student"])
        .withMessage("Unsupported user role"),
    body("address")
        .trim()
        .notEmpty()
        .withMessage("The address field cannot be empty")
        .isAlphanumeric(),
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
            throw new Error("Department is invalid");
        }
    } catch {
        throw new Error("Error in department validation");
    }
}

export { validateUserRegistration };
