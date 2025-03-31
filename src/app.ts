import express from "express";
import "dotenv/config";
import { registerRouter } from "./routes/registerRouter.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/register", registerRouter);

if (PORT) {
    app.listen(PORT, () => {
        console.log(`Sever listening on port ${PORT}`);
    });
}
