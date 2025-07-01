import { body, query } from "express-validator";
import { Request } from "express";
import { AddAcademicTermRequest } from "../models/types.js";
const academicTermValidation = [
    body("name").trim().notEmpty(),
    body("startDate").notEmpty().isDate(),
    body("academicYearId").notEmpty().isInt(),
    body("endDate")
        .notEmpty()
        .isDate()
        .custom((value: string, { req }) => {
            const typedRequest = req as Request<{}, {}, AddAcademicTermRequest>;

            const startDate = new Date(typedRequest.body.startDate);
            const endDate = new Date(value);

            if (startDate >= endDate) {
                throw new Error("Start Date cannot be End Date");
            } else {
                return true;
            }
        }),
];

const academicTermQueryParamsValidation = [
    query("year").isInt({ min: 2000, max: 3000 }),
];

export { academicTermValidation, academicTermQueryParamsValidation };
