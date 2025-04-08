import { ApiError } from "../models/types.js";

class AuthTokenNotFoundError extends Error implements ApiError {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "AuthenticationTokenNotFoundError";
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

export {
    AuthTokenNotFoundError,
    EnvironmentVariableNotFoundError,
    ValidationError,
};
