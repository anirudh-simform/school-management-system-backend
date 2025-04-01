import express from "express";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { registerRouter } from "./routes/registerRouter.js";
import { type CustomError } from "./models/types.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/register", registerRouter);

app.use(handleError);

if (PORT) {
    app.listen(PORT, () => {
        console.log(`Sever listening on port ${PORT}`);
    });
}

function handleError(
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let status = 500;

    if ("statusCode" in err) {
        console.log("inside status code", err.statusCode);
        status = err.statusCode;
    }
    console.error(err.message);
    res.status(status).json({ error: err });
}
