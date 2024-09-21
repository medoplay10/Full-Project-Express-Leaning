import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { InvalidTokenModel } from "../modules/auth/invalid-token.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const accessTokenFind = await InvalidTokenModel.findOne({
      token: accessToken,
    });
    if (accessTokenFind) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    var decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);

    req.user = {
      id: (decoded as JwtPayload).id,
    };
    req.accessToken = {
      value: accessToken,
      expireAt: new Date((decoded as JwtPayload).exp! * 1000),
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};
