import express from "express";
import { handleError } from "./middlewares/errorHandling.js";
import { registerRouter } from "./routes/registerRouter.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use("/register", registerRouter);

// Error handler
app.use(handleError);

const PORT = process.env.PORT;

if (PORT) {
    app.listen(PORT, () => {
        console.log(`server started on port ${PORT} `);
    });
}
