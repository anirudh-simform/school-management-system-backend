import { body } from "express-validator";
import { Request } from "express";
import { AddAcademicYearRequest } from "../models/types.js";
import { academicTermQueryParamsValidation } from "./validateAcademicTerm.js";
const academicYearValidation = [
    body("name").trim().notEmpty(),
    body("startDate").notEmpty().isDate(),
    body("endDate")
        .notEmpty()
        .isDate()
        .custom((value: string, { req }) => {
            const typedRequest = req as Request<{}, {}, AddAcademicYearRequest>;

            const startDate = new Date(typedRequest.body.startDate);
            const endDate = new Date(value);

            if (startDate >= endDate) {
                throw new Error("Start Date cannot be End Date");
            } else {
                return true;
            }
        }),
];

const academicYearQueryParamsValidation = academicTermQueryParamsValidation;

export { academicYearValidation, academicYearQueryParamsValidation };
