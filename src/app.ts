import express from "express";
import { handleError } from "./middlewares/errorHandling.js";
import { superAdminRouter } from "./routes/superAdminRouter.js";
import { userRouter } from "./routes/userRouter.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use("/superAdmin", superAdminRouter);
app.use("/user", userRouter);

// Error handler
app.use(handleError);

const PORT = process.env.PORT;

if (PORT) {
    app.listen(PORT, () => {
        console.log(`server started on port ${String(PORT)} `);
    });
}
