import Router from "express";
import { registerUserPost } from "../controllers/registerUserPost.js";
import { validateUserRegistration } from "../validation/validateUserRegistration.js";

const registerRouter = Router();

registerRouter.post("/", validateUserRegistration, registerUserPost);

export { registerRouter };
