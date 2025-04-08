import { body } from "express-validator";

const validateCreateSchool = [
    body("name")
        .trim()
        .notEmpty()
        .isAlphanumeric()
        .withMessage("School names can only be alphanumeric")
        .isLength({ min: 1 })
        .withMessage("School names must be one character long"),
    body("address")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("address must be atleast one character long"),
];

export { validateCreateSchool };
