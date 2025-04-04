import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
} from "../errors/errors.js";
import "dotenv/config";

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload | string;
    }
}

function verifyJwt(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        throw new AuthTokenNotFoundError(
            "Could not find authentication token in request,make sure you are logged in"
        );
    }

    const secretKey = process.env.AUTHENTICATION_KEY;

    if (!secretKey) {
        throw new EnvironmentVariableNotFoundError(
            "Environment variable not found.",
            "Jwt secret key"
        );
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            throw new JsonWebTokenError("Error in verifying JWT");
        }
        if (req.user && user) {
            req.user = user;
            next();
            return;
        }
    });
}

export { verifyJwt };
