import { currentUser } from "./user.controller";
import { authzMiddleware } from "../../middlewares/authz.middleware";
import { Router } from "express";
import { Role } from "../../constants/enums/role.enum";

export const userRouter = Router();

userRouter.get("/current-user", authzMiddleware([Role.Member]), currentUser);
