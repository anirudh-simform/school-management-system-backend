import { Request, Response } from "express";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    UnauthorizedAccessError,
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

    if (decodedToken && typeof decodedToken != "string" && decodedToken.role) {
        if (decodedToken.role != "SuperAdmin") {
            throw new UnauthorizedAccessError(
                "Only users with SuperAdmin pirvileges can add schools"
            );
        }
    }

    return decodedToken;
}

export { authenticateSuperAdmin };
