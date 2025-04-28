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

type tokenObject = {
    id: string;
    role: string;
    schoolId?: number;
};

type UpdateProgramRequestParams = {
    id?: number;
};

type UpdateDepartmentRequestParams = UpdateProgramRequestParams;
type ProgramUpdateInput = {
    name: string;
    description: string;
    courses?: { id: number }[];
};

type ProgramRequest = ProgramUpdateInput;

type AddUserRequest = Prisma.UserGetPayload<{
    select: {
        studentProfile: {
            select: {
                studentBatchId: true;
            };
        };
        instructorProfile: {
            select: {
                departmentId: true;
            };
        };
        firstname: true;
        lastname: true;
        email: true;
        password: true;
        dob: true;
        gender: true;
        role: true;
        phone: true;
        schoolId: true;
    };
}>;

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id?: string;
        role?:
            | "SuperAdmin"
            | "Student"
            | "SchoolSuperAdmin"
            | "Admin"
            | "Instructor";
        schoolId?: number;
    }
}

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload | string;
    }
}

export {
    type ApiError,
    type SuperAdmin,
    type LoginRequest,
    type tokenObject,
    type UpdateProgramRequestParams,
    type ProgramUpdateInput,
    type ProgramRequest,
    type AddUserRequest,
    type UpdateDepartmentRequestParams,
};
