import { isGeneratorFunction } from "util/types";
import { UserModel } from "../user/user.model";
import { RefreshTokenModel } from "../auth/refresh-token.model";
import { InvalidTokenModel } from "../auth/invalid-token.model";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { console } from "inspector";

const register = async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = new UserModel({ name, email, password: passwordHash, role });
    await user.save();
    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userFind = await UserModel.findOne({ email });
    if (!userFind) {
      return res.status(400).json({ message: "User not found" });
    }
    const CheckPassword = await bcrypt.compare(password, userFind.password);
    if (!CheckPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { id: userFind._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      }
    );

    const refreshToken = jwt.sign(
      { id: userFind._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      }
    );
    const refreshTokenModel = new RefreshTokenModel({
      token: refreshToken,
      user: userFind._id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshTokenModel.save();
    const data = {
      id: userFind._id,
      name: userFind.name,
      email: userFind.email,
      role: userFind.role,
      accessToken,
      refreshToken,
    };
    return res.status(200).json({ message: "Login successful", data });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const refreshToken = async (req: any, res: any) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    const userId = (decoded as JwtPayload).id;

    const refreshTokenFind = await RefreshTokenModel.findOne({
      token: refreshToken,
      user: userId,
    });

    if (!refreshTokenFind) {
      return res.status(400).json({ message: "Refresh token is invalid" });
    }

    if (refreshTokenFind.expiredAt < new Date()) {
      return res.status(400).json({ message: "Refresh token is expired" });
    }
    await RefreshTokenModel.deleteOne(refreshTokenFind._id);

    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });

    const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
    const refreshTokenModel = new RefreshTokenModel({
      token: newRefreshToken,
      user: userId,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshTokenModel.save();
    const data = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    return res.status(200).json({ message: "Refresh token successful", data });
  } catch (error) {
    return res.status(500).json({ message: "Refresh token failed" });
  }
};

const logout = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    console.log("userId", userId);
    await RefreshTokenModel.deleteMany({ user: userId });

    const invalidToken = new InvalidTokenModel({
      token: req.accessToken.value,
      user: userId,
      expiredAt: req.accessToken.expireAt,
    });

    await invalidToken.save();
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed"  });
  }
};
export { register, login, refreshToken ,logout};
