import express, { Request, Response } from "express";
import { mongooseConnect } from "./config/database.util";
import "dotenv/config";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
const port = 3000;

// parse application/json
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});
app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);

mongooseConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("database connection failed", error);
    process.exit(1); // stop the application
  });
