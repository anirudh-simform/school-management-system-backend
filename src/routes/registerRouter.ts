import Router from "express";
import { registerSuperAdmin } from "../controllers/registerSuperAdmin.js";
import { superAdminValidation } from "../validation/validateSuperAdminRegistration.js";

const registerRouter = Router();

registerRouter.post("/", superAdminValidation, registerSuperAdmin);

export { registerRouter };
