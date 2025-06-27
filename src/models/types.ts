import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/index.js";

interface IApiError extends Error {
    statusCode: number;
    body?: Record<string, object>;
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

type UpdateItemRequestParams = UpdateDepartmentRequestParams;
type ProgramUpdateInput = {
    name: string;
    description: string;
    courses: { id: number }[];
};

type ProgramRequest = ProgramUpdateInput;

type AddUserRequest = Prisma.UserGetPayload<{
    select: {
        studentProfile: {
            select: {
                studentBatchId: true;
                gradeLevelId: true;
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
    type IApiError,
    type SuperAdmin,
    type LoginRequest,
    type tokenObject,
    type UpdateProgramRequestParams,
    type ProgramUpdateInput,
    type ProgramRequest,
    type AddUserRequest,
    type UpdateDepartmentRequestParams,
    type UpdateItemRequestParams,
};
