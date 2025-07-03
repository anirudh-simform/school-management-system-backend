import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/index.js";

export interface IApiError extends Error {
    statusCode: number;
    body?: Record<string, object>;
}

enum GroupType {
    CLASS,
    LAB,
}
export type PaginationQueryParams = {
    pageSize: number;
    pageNumber: number;
};
export type SearchAcademicYearParams = {
    year: string;
};

export type GetCoursesQueryParams = {
    query: string;
};

export type GetProgramQueryParams = GetCoursesQueryParams;

export type SearchAcademicTermParams = SearchAcademicYearParams;

export type SuperAdmin = Prisma.SuperAdminCreateInput;

export type LoginRequest = {
    email: string;
    password: string;
};

export type tokenObject = {
    id: string;
    role: string;
    schoolId?: number;
};

export type UpdateProgramRequestParams = {
    id?: number;
};

export type UpdateDepartmentRequestParams = UpdateProgramRequestParams;

export type UpdateItemRequestParams = UpdateDepartmentRequestParams;
export type ProgramUpdateInput = {
    name: string;
    description: string;
    courses: { id: number }[];
};

export type ProgramRequest = ProgramUpdateInput;

export type AddUserRequest = Prisma.UserGetPayload<{
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

export type AddAcademicYearRequest = {
    name: string;
    startDate: string;
    endDate: string;
};

export type AddAcademicTermRequest = {
    academicYearId: number;
} & AddAcademicYearRequest;

export type AddStudentGroupRequest = {
    name: string;
    studentProfiles: number[];
    groupType: Prisma.StudentGroupUncheckedCreateInput["groupType"];
};

export type searchStudentGroupParams = {
    search: string;
    limit: 10;
};

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
