import { body } from "express-validator";

const commonUserValidation = [
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
        .isIn(["Admin", "Instructor", "Student", "SuperAdmin"])
        .withMessage("Unsupported user role"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Must be a valid email"),
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
    body("school")
        .isAlphanumeric()
        .withMessage("School names can only be alphanumeric"),
];

export { commonUserValidation };
