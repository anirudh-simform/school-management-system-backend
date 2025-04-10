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
        userId?: string;
    }
}

export { type ApiError, type SuperAdmin, type LoginRequest };
