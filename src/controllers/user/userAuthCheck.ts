import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const userAuthCheck = asyncHandler(function userAuth(
    req: Request,
    res: Response
) {
    if (req.user && typeof req.user != "string") {
        res.status(200).json({
            role: req.user.role,
            id: req.user.id,
            schoolId: Number(req.user.schoolId),
        });
    }
});

export { userAuthCheck };
