import { body } from "express-validator";

const validateUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Must be a valid email"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 characters long"),
];

export { validateUserLogin };
