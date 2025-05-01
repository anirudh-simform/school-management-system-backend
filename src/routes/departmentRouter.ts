import Router from "express";
import { createDepartmentPOST } from "../controllers/department/createDepartmentPOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { getAllDepartmentsGET } from "../controllers/department/getAllDepartmentsGET.js";
import { EditDepartmentPOST } from "../controllers/department/editDepartmentPUT.js";
import { deleteDepartmentDELETE } from "../controllers/department/deleteDepartmentDELETE.js";
import { validateCreateDepartment } from "../validation/validateCreateDepartment.js";

const departmentRouter = Router();

departmentRouter.post(
    "/",
    validateCreateDepartment,
    verifyAccessToken,
    createDepartmentPOST
);
departmentRouter.get("/", verifyAccessToken, getAllDepartmentsGET);
departmentRouter.put(
    "/:id",
    validateCreateDepartment,
    verifyAccessToken,
    EditDepartmentPOST
);
departmentRouter.delete("/:id", verifyAccessToken, deleteDepartmentDELETE);

export { departmentRouter };
