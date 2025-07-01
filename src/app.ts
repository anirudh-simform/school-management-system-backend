import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { handleError } from "./middlewares/errorHandling.js";
import { superAdminRouter } from "./routes/superAdminRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { departmentRouter } from "./routes/departmentRouter.js";
import { courseRouter } from "./routes/courseRouter.js";
import { programRouter } from "./routes/programRouter.js";
import { studentBatchRouter } from "./routes/studentBatchRouter.js";
import { gradeLevelRouter } from "./routes/gradeLevelRouter.js";
import { academicYearRouter } from "./routes/academicYearRouter.js";
import { academicTermRouter } from "./routes/academicTermRouter.js";


import "dotenv/config";

const app = express();

app.use(cors({ origin: "http://localhost:4200/", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/superAdmin", superAdminRouter);
app.use("/user", userRouter);
app.use("/department", departmentRouter);
app.use("/course", courseRouter);
app.use("/program", programRouter);
app.use("/studentBatch", studentBatchRouter);
app.use("/gradeLevel", gradeLevelRouter);
app.use("academicYear", academicYearRouter);
app.use("academicTerm", academicTermRouter);


// Error handler
app.use(handleError);

const PORT = process.env.PORT;

if (PORT) {
    app.listen(PORT, () => {
        console.log(`server started on port ${String(PORT)} `);
    });
}
