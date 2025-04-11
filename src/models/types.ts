import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/index.js";

interface ApiError extends Error {
    statusCode: number;
}

type SuperAdmin = Prisma.SuperAdminCreateInput;

type LoginRequest = {
    email: string;
    password: string;
};

declare module "jsonwebtoken" {
    export interface JwtPayload {
        email?: string;
    }
}

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload | string;
    }
}

export { type ApiError, type SuperAdmin, type LoginRequest };
