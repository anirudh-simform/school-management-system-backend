import { Router } from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";

import { createLevelGradePOST } from "../controllers/gradeLevel/createGradeLevelPOST.js";
import { updateLevelGradePUT } from "../controllers/gradeLevel/updateGradeLevelPUT.js";
import { deleteLevelGradeDELETE } from "../controllers/gradeLevel/deleteGradeLevelDELETE.js";
import { getAllLevelGradeGET } from "../controllers/gradeLevel/getAllGradeLevelsGET.js";

import { gradeLevelValidation } from "../validation/validateGradeLevel.js";

const gradeLevelRouter = Router();

gradeLevelRouter.post(
    "/",
    verifyAccessToken,
    gradeLevelValidation,
    createLevelGradePOST
);
gradeLevelRouter.put(
    "/:id",
    verifyAccessToken,
    gradeLevelValidation,
    updateLevelGradePUT
);
gradeLevelRouter.delete("/:id", verifyAccessToken, deleteLevelGradeDELETE);
gradeLevelRouter.get("/", verifyAccessToken, getAllLevelGradeGET);

export { gradeLevelRouter };
