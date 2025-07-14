import Router from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { createAdminPOST } from "../controllers/admin/createAdminPOST.js";
import { updateAdminPUT } from "../controllers/admin/updateAdminPUT.js";
import { getAllAdminsGET } from "../controllers/admin/getAllAdminGET.js";
import { deleteAdminDELETE } from "../controllers/admin/deleteAdminDELETE.js";

const adminRouter = Router();

adminRouter.post("/", verifyAccessToken, createAdminPOST);

adminRouter.put("/:id", verifyAccessToken, updateAdminPUT);

adminRouter.get("/", verifyAccessToken, getAllAdminsGET);
adminRouter.delete("/:id", verifyAccessToken, deleteAdminDELETE);

export { adminRouter };
