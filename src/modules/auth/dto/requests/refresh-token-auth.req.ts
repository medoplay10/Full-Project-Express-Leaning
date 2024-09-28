import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";
export const refreshTokenAuthSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
