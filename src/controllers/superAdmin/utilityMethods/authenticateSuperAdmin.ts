import { Request, Response } from "express";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
} from "../../../errors/errors.js";
import { verifyJwtPromisified } from "../../../authentication/utilityMethods/verifyJwtPromisified.js";
import "dotenv/config";
import { logger } from "../../../logging/logger.js";

async function authenticateSuperAdmin(req: Request, res: Response) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        throw new AuthTokenNotFoundError(
            "Super Admin authentication token not found"
        );
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        throw new EnvironmentVariableNotFoundError(
            "Environment variable not found",
            "ACCESS_TOKEN_SECRET"
        );
    }
    const decodedToken = await verifyJwtPromisified(token, secret).catch(
        (reason: unknown) => {
            logger.error(reason);
            throw new Error("Invalid Access token");
        }
    );

    return decodedToken;
}

export { authenticateSuperAdmin };
