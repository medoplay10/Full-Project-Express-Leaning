import { register, login, logout, refreshToken } from "./auth.controller";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validationJoiMiddleware } from "../../middlewares/validation-joi.middleware";
import { registerAuthSchema } from "./dto/requests/register-auth.req";
import { loginAuthSchema } from "./dto/requests/login-auth.req";
import { refreshTokenAuthSchema } from "./dto/requests/refresh-token-auth.req";

export const authRouter = Router();

authRouter.post(
  "/register",
  validationJoiMiddleware(registerAuthSchema),
  register
);
authRouter.post("/login", validationJoiMiddleware(loginAuthSchema), login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post(
  "/refresh-token",
  validationJoiMiddleware(refreshTokenAuthSchema),
  refreshToken
);
