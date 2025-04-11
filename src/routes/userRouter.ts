import Router from "express";
import { userLoginPost } from "../controllers/user/userLoginPOST.js";
const userRouter = Router();

userRouter.post("/login", userLoginPost);
export { userRouter };
