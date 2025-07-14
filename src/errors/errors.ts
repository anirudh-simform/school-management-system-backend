import { IApiError } from "../models/types.js";

abstract class ApiError extends Error implements IApiError {
    public statusCode: number = 500;
    public body?: Record<string, object>;
    public name: string = "InternalServerError";
}

class AuthTokenNotFoundError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "AuthenticationTokenNotFoundError";
    }
}

class ReusedTokenError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = "ReusedTokenError";
    }
}

class InvalidTokenError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = "InvalidTokenError";
    }
}

class EnvironmentVariableNotFoundError extends ApiError {
    public statusCode: number;
    constructor(message: string, variableName: string) {
        super(message);
        this.statusCode = 500;
        this.name = `EnvironmentVariablesNotFoundError(${variableName})`;
    }
}

class ValidationError extends ApiError {
    public statusCode: number;
    constructor(message: string, body?: Record<string, object>) {
        super(message);
        this.body = body;
        this.statusCode = 400;
        this.name = `ValidationError`;
    }
}

class NotFoundError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = `NotFoundError`;
    }
}

class UnauthorizedAccessError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = `UnauthorizedAccessError`;
    }
}

class BadRequestError extends ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = `BadRequestError`;
    }
}

export {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    ValidationError,
    ReusedTokenError,
    InvalidTokenError,
    NotFoundError,
    UnauthorizedAccessError,
    BadRequestError,
    ApiError,
};
