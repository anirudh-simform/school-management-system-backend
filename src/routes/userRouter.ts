import Router from "express";
import { userLoginPost } from "../controllers/user/userLoginPOST.js";
import { addUserPost } from "../controllers/user/addUserPOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { userLogoutPOST } from "../controllers/user/userLogoutPOST.js";
import { userAuthCheck } from "../controllers/user/userAuthCheck.js";
import { validateUserLogin } from "../validation/validateUserLogin.js";
const userRouter = Router();

userRouter.post("/login", validateUserLogin, userLoginPost);
// userRouter.post("/", verifyAccessToken, addUserPost);
userRouter.post("/logout", verifyAccessToken, userLogoutPOST);
userRouter.get("/me", verifyAccessToken, userAuthCheck);
export { userRouter };
