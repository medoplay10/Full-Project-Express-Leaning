import express, { Request, Response } from "express";
import { UserModel } from "../modules/user/user.model";

export function authzMiddleware(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: any) => {
    try {
      // Retrieve user based on ID stored in request (assumed to be set by previous auth middleware)
      const user = await UserModel.findOne({ _id: req.user!.id });

      // Check if user exists and if their role is in the list of allowed roles
      if (!user || !allowedRoles.includes(user.role)) {
        // If user does not exist or role is not allowed, respond with "Access denied"
        return res.status(403).json({ message: "Access denied" });
      }

      // If the user role is allowed, proceed to the next middleware
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
