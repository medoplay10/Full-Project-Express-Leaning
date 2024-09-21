"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_util_1 = require("./utils/database.util");
require("dotenv/config");
const auth_route_1 = require("./modules/auth/auth.route");
const user_route_1 = require("./modules/user/user.route");
const app = (0, express_1.default)();
const port = 3000;
// parse application/json
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.use("/auth", auth_route_1.authRouter);
app.use("/user", user_route_1.userRouter);
(0, database_util_1.mongooseConnect)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.log("database connection failed", error);
    process.exit(1); // stop the application
});
