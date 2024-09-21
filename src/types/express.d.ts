import { Request } from "express";
import { User } from "../user/user.model";
declare global {
  namespace Express {
    interface Request {
      user?: {id: string};
      accessToken?: {value: string, expireAt: Date};
    }
  }
}
