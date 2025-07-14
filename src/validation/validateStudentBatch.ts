import { body } from "express-validator";
import { Request } from "express";
import { StudentBatch } from "../../generated/prisma/index.js";

const validateStudentBatch = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Batch name cannot be empty")
        .isLength({ min: 1 })
        .withMessage("Batch name must be atleast one character long"),
    body("startDate")
        .trim()
        .notEmpty()
        .withMessage("Batch startDate cannot be empty")
        .customSanitizer((value: string) => {
            const formattedDate = value.toString().split("T")[0];
            return formattedDate;
        })
        .isDate()
        .withMessage("Batch start Date must be a valid date"),
    body("endDate")
        .trim()
        .notEmpty()
        .withMessage("Batch end cannot be empty")
        .customSanitizer((value: string) => {
            const formattedDate = value.toString().split("T")[0];
            return formattedDate;
        })
        .isDate()
        .withMessage("Batch end Date must be a valid date")
        .custom((value, { req }) => {
            const typedReq = req as Request<
                {},
                {},
                Omit<StudentBatch, "id" | "schoolId">
            >;

            const startDate = new Date(typedReq.body.startDate);
            const endDate = new Date(typedReq.body.endDate);

            if (startDate > endDate) {
                throw new Error("The end date cannot be before the start date");
            } else if (startDate == endDate) {
                throw new Error(
                    "The start date and end date cannot be the same"
                );
            } else {
                return true;
            }
        }),
];

export { validateStudentBatch };
