class NotFoundError extends Error {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
}

class DataInsertionError extends Error {
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "DataInsertionError";
    }
}

export { NotFoundError, DataInsertionError };
