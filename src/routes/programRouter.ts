import Router from "express";
import { createProgramPOST } from "../controllers/program/createProgramPOST.js";
import { updateProgramPUT } from "../controllers/program/updateProgramPUT.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { getAllProgramsGET } from "../controllers/program/getAllProgramsGET.js";
import { deleteProgramDELETE } from "../controllers/program/deleteProgramDELETE.js";

const programRouter = Router();

programRouter.post("/", verifyAccessToken, createProgramPOST);
programRouter.get("/", verifyAccessToken, getAllProgramsGET);
programRouter.put("/:id", verifyAccessToken, updateProgramPUT);
programRouter.delete("/:id", verifyAccessToken, deleteProgramDELETE);

export { programRouter };
