import { body } from "express-validator";
import { commonUserValidation } from "./commonUserValidation.js";

const validateInstructorInfo = [
    body("department").trim().notEmpty().isInt({ min: 0 }),
];

const validateCreateInstructor = [
    ...commonUserValidation,
    ...validateInstructorInfo,
];

export { validateCreateInstructor };
