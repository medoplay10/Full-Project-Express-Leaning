import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { InvalidTokenModel } from "../modules/auth/invalid-token.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  // Extract the access token from the authorization header
  const accessToken = req.headers.authorization;

  // If no access token is provided, return an unauthorized status
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if the access token is in the list of invalidated tokens
    const accessTokenFind = await InvalidTokenModel.findOne({
      token: accessToken,
    });

    // If the token is found in the invalid tokens database, return an unauthorized status
    if (accessTokenFind) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);

    // Attach user information and token details to the request object
    req.user = {
      id: (decoded as JwtPayload).id, // Assumed 'id' is part of the token's payload
    };
    req.accessToken = {
      value: accessToken,
      expireAt: new Date((decoded as JwtPayload).exp! * 1000), // Convert expiration time from seconds to milliseconds
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
