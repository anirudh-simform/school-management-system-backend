import { body } from "express-validator";

const validateCreateDepartment = [
    body("name")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Department name must be atleast one character long"),
];

export { validateCreateDepartment };
