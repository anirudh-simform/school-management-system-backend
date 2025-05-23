import { body } from "express-validator";

const gradeLevelValidation = [
    body("name")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("grade level name must be atleast one character long"),
    body("levelOrder")
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("level order cannot be negative"),
];

export { gradeLevelValidation };
