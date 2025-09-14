import { NextFunction, Request, Response } from "express";

export const greetByName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: "success",
      data: { message: `GOOD` },
    });
  } catch (error) {
    next(error);
  }
};
