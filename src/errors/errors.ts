class AuthenticationTokenNotFoundError extends Error {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "AuthenticationTokenNotFoundError";
    }
}

class EnvironmentVariableNotFoundError extends Error {
    public statusCode: number;
    constructor(message: string, variableName: string) {
        super(message);
        this.statusCode = 400;
        this.name = `EnvironmentVariablesNotFoundError(${variableName})`;
    }
}

export { AuthenticationTokenNotFoundError, EnvironmentVariableNotFoundError };
