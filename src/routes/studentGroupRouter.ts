import { Router } from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { createStudentGroupPOST } from "../controllers/studentGroup/createStudentGroupPOST.js";
import { editStudentGroupPUT } from "../controllers/studentGroup/editStudentGroupPUT.js";
import {
    studentGroupQueryParamsValidation,
    studentGroupValidation,
} from "../validation/validateStudentGroup.js";
import { searchStudentGroupGET } from "../controllers/studentGroup/searchStudentGroupGET.js";

const studentGroupRouter = Router();

studentGroupRouter.post(
    "/",
    verifyAccessToken,
    studentGroupValidation,
    createStudentGroupPOST
);

studentGroupRouter.put(
    "/:id",
    verifyAccessToken,
    studentGroupValidation,
    editStudentGroupPUT
);

studentGroupRouter.get(
    "/",
    verifyAccessToken,
    studentGroupQueryParamsValidation,
    searchStudentGroupGET
);

export { studentGroupRouter };
