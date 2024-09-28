import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Role } from "../../../../constants/enums/role.enum";
export const registerAuthSchema = Joi.object({
  name: Joi.string().min(3).max(30).alphanum().required(),

  email: Joi.string().email().required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  role: Joi.string().valid(Role.Admin, Role.Member).required(),
});
