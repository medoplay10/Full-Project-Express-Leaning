import { isGeneratorFunction } from "util/types";
import { UserModel } from "../user/user.model";
import { RefreshTokenModel } from "../auth/refresh-token.model";
import { InvalidTokenModel } from "../auth/invalid-token.model";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { console } from "inspector";


// Handles new user registration
const register = async (req :any, res:any) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create a new user instance and save to the database
    const user = new UserModel({ name, email, password: passwordHash, role });
    await user.save();

    // Successfully registered
    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // Catch any errors during registration
    return res.status(500).json({ message: "Registration failed" });
  }
};

// Handles user login
const login = async (req :any, res:any) => {
  try {
    const { email, password } = req.body;

    // Validate presence of email and password
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const userFind = await UserModel.findOne({ email });
    if (!userFind) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is correct
    const checkPassword = await bcrypt.compare(password, userFind.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: userFind._id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    // Generate JWT refresh token
    const refreshToken = jwt.sign(
      { id: userFind._id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    // Save the refresh token in the database
    const refreshTokenModel = new RefreshTokenModel({
      token: refreshToken,
      user: userFind._id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshTokenModel.save();

    // Prepare user data for response
    const data = {
      id: userFind._id,
      name: userFind.name,
      email: userFind.email,
      role: userFind.role,
      accessToken,
      refreshToken,
    };

    // Successfully logged in
    return res.status(200).json({ message: "Login successful", data });
  } catch (error) {
    // Catch any errors during login
    return res.status(500).json({ message: "Login failed" });
  }
};

// Handles token refreshing
const refreshToken = async (req :any, res:any) => {
  try {
    const { refreshToken } = req.body;

    // Check if the refresh token is provided
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    const userId = (decoded as JwtPayload).id;

    // Check if the token is stored and valid
    const refreshTokenFind = await RefreshTokenModel.findOne({ token: refreshToken, user: userId });
    if (!refreshTokenFind || refreshTokenFind.expiredAt < new Date()) {
      return res.status(400).json({ message: "Refresh token is invalid or expired" });
    }

    // Delete the old refresh token
    await RefreshTokenModel.deleteOne({ _id: refreshTokenFind._id });

    // Generate a new access token
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });

    // Generate a new refresh token
    const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    // Save the new refresh token
    const newRefreshTokenModel = new RefreshTokenModel({
      token: newRefreshToken,
      user: userId,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await newRefreshTokenModel.save();

    // Prepare new tokens for response
    const data = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    // Successfully refreshed the token
    return res.status(200).json({ message: "Refresh token successful", data });
  } catch (error) {
    // Catch any errors during token refresh
    return res.status(500).json({ message: "Refresh token failed" });
  }
};


// Handles user logout
const logout = async (req :any, res:any)=> {
  try {
    const { userId } = req.user;

    // Delete all refresh tokens for the user
    await RefreshTokenModel.deleteMany({ user: userId });

    // Optionally save the current access token as invalid if implementing token invalidation
    const invalidToken = new InvalidTokenModel({
      token: req.accessToken.value,
      user: userId,
      expiredAt: req.accessToken.expireAt,
    });
    await invalidToken.save();

    // Successfully logged out
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // Catch any errors during logout
    return res.status(500).json({ message: "Logout failed" });
  }
};

export { register, login, refreshToken ,logout};
