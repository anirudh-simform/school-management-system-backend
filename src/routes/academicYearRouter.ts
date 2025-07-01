import { Router } from "express";
import { createAcademicYearPOST } from "../controllers/academicYear/createAcademicYearPOST.js";
import {
    academicYearQueryParamsValidation,
    academicYearValidation,
} from "../validation/validateAcademicYear.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { editAcademicYearPUT } from "../controllers/academicYear/editAcademicYearPUT.js";
import { deleteAcademicYearDELETE } from "../controllers/academicYear/deleteAcademicYearDELETE.js";
import { searchAcademicYearGET } from "../controllers/academicYear/searchAcademicYearGET.js";

const academicYearRouter = Router();

academicYearRouter.post(
    "/",
    verifyAccessToken,
    academicYearValidation,
    createAcademicYearPOST
);

academicYearRouter.put(
    "/:id",
    verifyAccessToken,
    academicYearValidation,
    editAcademicYearPUT
);

academicYearRouter.delete("/:id", verifyAccessToken, deleteAcademicYearDELETE);

academicYearRouter.get(
    "/",
    verifyAccessToken,
    academicYearQueryParamsValidation,
    searchAcademicYearGET
);

export { academicYearRouter };
