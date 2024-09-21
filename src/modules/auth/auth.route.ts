import { register, login, logout, refreshToken } from "./auth.controller";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refresh-token", refreshToken);
