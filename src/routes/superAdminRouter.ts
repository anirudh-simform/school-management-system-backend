import Router from "express";
import { registerSuperAdmin } from "../controllers/superAdmin/registerSuperAdmin.js";
import { superAdminValidation } from "../validation/validateSuperAdminRegistration.js";
import { loginSuperAdmin } from "../controllers/superAdmin/loginSuperAdmin.js";
import { addSchoolPOST } from "../controllers/superAdmin/addSchool.js";
import { validateCreateSchool } from "../validation/validateCreateSchool.js";
import { addSchoolSuperAdminPOST } from "../controllers/superAdmin/addSchoolSuperAdminPOST.js";

const superAdminRouter = Router();

superAdminRouter.post("/sadmin", superAdminValidation, registerSuperAdmin);
superAdminRouter.post("/login", loginSuperAdmin);
superAdminRouter.post("/school", validateCreateSchool, addSchoolPOST);
superAdminRouter.post("/ssadmin", addSchoolSuperAdminPOST);

export { superAdminRouter };
