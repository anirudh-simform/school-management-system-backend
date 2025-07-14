import Router from "express";
import { createCoursePOST } from "../controllers/course/createCoursePOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { validateCreateCourse } from "../validation/validateCreateCourse.js";
import { getAllCoursesGET } from "../controllers/course/getAllCoursesGET.js";
import { editCoursePOST } from "../controllers/course/editCoursePUT.js";
import { deleteCourseDELETE } from "../controllers/course/deleteCourseDELETE.js";

const courseRouter = Router();

courseRouter.post(
    "/",
    validateCreateCourse,
    verifyAccessToken,
    createCoursePOST
);

courseRouter.put(
    "/:id",
    validateCreateCourse,
    verifyAccessToken,
    editCoursePOST
);

courseRouter.get("/", verifyAccessToken, getAllCoursesGET);
courseRouter.delete("/:id", verifyAccessToken, deleteCourseDELETE);

export { courseRouter };
