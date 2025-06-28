import { Router } from "express";
import { createAcademicTermPOST } from "../controllers/academicTerm/createAcademicTermPOST.js";
import { academicTermValidation } from "../validation/validateAcademicTerm.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { editAcademicTermPUT } from "../controllers/academicTerm/editAcademicTermPUT.js";
import { deleteAcademicTermDELETE } from "../controllers/academicTerm/deleteAcademicTermDELETE.js";
import { searchAcademicTermGET } from "../controllers/academicTerm/searchAcademicTermGET.js";

const academicTermRouter = Router();

academicTermRouter.post(
    "/",
    verifyAccessToken,
    academicTermValidation,
    createAcademicTermPOST
);

academicTermRouter.put(
    "/:id",
    verifyAccessToken,
    academicTermValidation,
    editAcademicTermPUT
);

academicTermRouter.delete("/:id", verifyAccessToken, deleteAcademicTermDELETE);

academicTermRouter.get("/", verifyAccessToken, searchAcademicTermGET);

export { academicTermRouter };
