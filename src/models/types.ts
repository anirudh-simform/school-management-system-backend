import { Prisma } from "../../generated/prisma/index.js";

interface ApiError extends Error {
    statusCode: number;
}

type SuperAdmin = Prisma.SuperAdminCreateInput;

export { type ApiError, type SuperAdmin };
