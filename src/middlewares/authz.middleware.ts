import express, { Request, Response } from "express";
import { UserModel } from "../modules/user/user.model";

export function authzMiddleware(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: any) => {
    try {
      const user = await UserModel.findOne({ _id: req.user!.id });

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
