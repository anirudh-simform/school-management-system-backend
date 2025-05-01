import { body } from "express-validator";

const validateCreateCourse = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Course name cannot be empty")
        .isLength({ min: 1 })
        .withMessage("Course name must be atleast one character long"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Course Description cannot be empty")
        .isLength({ min: 1 })
        .withMessage(
            "Course Description name must be atleast one character long"
        ),
];

export { validateCreateCourse };
