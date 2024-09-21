"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_controller_1 = require("./user.controller");
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/current-user", auth_middleware_1.authMiddleware, user_controller_1.currentUser);
