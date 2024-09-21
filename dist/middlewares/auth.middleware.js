"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authMiddleware = (req, res, next) => {
    const accessToken = req.headers.authorization;
    console.log('accessToken', accessToken);
    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.isLoggedIn = true;
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authMiddleware = authMiddleware;
