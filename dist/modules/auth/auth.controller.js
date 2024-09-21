"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (yield user_model_1.UserModel.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, 12);
        const user = new user_model_1.UserModel({ name, email, password: passwordHash });
        yield user.save();
        return res.status(201).json({ message: "Registration successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Registration failed" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userFind = yield user_model_1.UserModel.findOne({ email });
        if (!userFind) {
            return res.status(400).json({ message: "User not found" });
        }
        const CheckPassword = yield bcryptjs_1.default.compare(password, userFind.password);
        if (!CheckPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: userFind._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const data = {
            id: userFind._id,
            name: userFind.name,
            email: userFind.email,
            accessToken,
        };
        return res.status(200).json({ message: "Login successful", data });
    }
    catch (error) {
        return res.status(500).json({ message: "Registration failed" });
    }
});
exports.login = login;
