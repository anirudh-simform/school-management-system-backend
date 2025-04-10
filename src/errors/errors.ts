import { ApiError } from "../models/types.js";

class AuthTokenNotFoundError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "AuthenticationTokenNotFoundError";
    }
}

class ReusedTokenError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = "ReusedTokenError";
    }
}

class InvalidTokenError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = "InvalidTokenError";
    }
}

class EnvironmentVariableNotFoundError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string, variableName: string) {
        super(message);
        this.statusCode = 500;
        this.name = `EnvironmentVariablesNotFoundError(${variableName})`;
    }
}

class ValidationError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = `ValidationError`;
    }
}

class NotFoundError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = `NotFoundError`;
    }
}

export {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    ValidationError,
    ReusedTokenError,
    InvalidTokenError,
    NotFoundError,
};
