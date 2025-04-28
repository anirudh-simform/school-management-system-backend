import Router from "express";
import { createProgramPOST } from "../controllers/program/createProgramPOST.js";
import { updateProgramPOST } from "../controllers/program/updateProgramPOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";

const programRouter = Router();

programRouter.post("/", verifyAccessToken, createProgramPOST);
programRouter.post("/:id", verifyAccessToken, updateProgramPOST);

export { programRouter };
