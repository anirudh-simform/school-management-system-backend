import { body } from "express-validator";

const superAdminValidation = [
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
    body("phone").trim().isMobilePhone("en-IN"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 characters long"),
    body("dob").isDate().withMessage("Date should be format YYYY-MM-DD"),
];

export { superAdminValidation };
