import { Socket } from "socket.io";
import { ExtendedError } from "socket.io";
import { parse as parseCookie } from "cookie";
import {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    InvalidTokenError,
} from "../errors/errors.js";
import { verifyJwtPromisified } from "./utilityMethods/verifyJwtPromisified.js";
import jwt from "jsonwebtoken";
import { logger } from "../logging/logger.js";

const { TokenExpiredError } = jwt;

type SocketNext = (err?: ExtendedError) => void;

export async function verifyAccessTokenWebSocket(
    socket: Socket,
    next: SocketNext
) {
    const cookieHeader = socket.handshake.headers.cookie;

    console.log("inside verify");

    if (!cookieHeader) {
        next(
            new AuthTokenNotFoundError(
                "Authentication token not found, please login first"
            )
        );
        return;
    }

    const cookies = parseCookie(cookieHeader);
    const accessToken = cookies["accessToken"];

    if (!accessToken) {
        next(new AuthTokenNotFoundError("AuthTokenNotFoundError"));
        return;
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        throw new EnvironmentVariableNotFoundError(
            "Environment variable not found.",
            "ACCESS_TOKEN_SECRET"
        );
    }

    try {
        const user = await verifyJwtPromisified(accessToken, secretKey);

        if (user) {
            socket.user = user;
            next();
            return;
        } else {
            next(new Error("An unexpected error occurred"));
        }
    } catch (err: unknown) {
        console.log(err);
        if (err instanceof TokenExpiredError) {
            console.log("token expired");
            next(err);
            return;
        } else {
            logger.error(err);
            next(new Error("An unexpected error occurred"));
        }
    }
}
