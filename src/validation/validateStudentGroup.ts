import { body, query } from "express-validator";
const studentGroupValidation = [
    body("name").isString().trim().notEmpty(),
    body("studentProfiles")
        .isArray()
        .custom((arr: number[]) => arr.every((id) => Number.isInteger(id)))
        .withMessage("student Profile Ids can only be integers"),
    body("groupType")
        .isString()
        .isIn(["LAB", "CLASS"])
        .withMessage("Invalid group type"),
];

const studentGroupQueryParamsValidation = [
    query("search").isString().trim().notEmpty(),
];

export { studentGroupValidation, studentGroupQueryParamsValidation };
