import { NextFunction, Request, Response } from "express";
import { TOTP } from "../utils/TOTP";
import SecretModel from "../models/secret.model";
import { v4 } from "uuid";
export const saveSecret = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { secretCode, issuer } = req.body;
    if (!secretCode || !issuer) {
      return res.status(400).json({
        status: "fail",
        message: "secret code and service are required",
      });
    }
    const id = v4();
    const otpObj = new SecretModel({
      id,
      issuer,
      secretCode,
    });

    const savedSecret = await otpObj.save();
    res.status(201).json({
      status: "success",
      message: `Saved successfully`,
      data: savedSecret,
    });
  } catch (error) {
    next(error);
  }
};

export const generateOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Id",
      });
    }
    const retrived = await SecretModel.findOne({ id });

    if (!retrived) {
      return res.status(404).json({
        status: "fail",
        message: "Secret not found",
      });
    }

    const otpObj = await TOTP.generate(retrived.secretCode);

    res.status(200).json({
      id: retrived.id,
      otp: otpObj.otp,
      expires: otpObj.expires,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSecretData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { secretCode, issuer } = req.body;
    if (!id || !secretCode || !issuer) {
      return res.status(400).json({
        status: "fail",
        message: "id, secret code and service are required",
      });
    }
    const retrived = await SecretModel.findOne({ id });

    if (!retrived) {
      return res.status(404).json({
        status: "fail",
        message: "Secret not found",
      });
    }
    retrived.secretCode = secretCode;
    retrived.issuer = issuer;
    const updated = await retrived.save();
    res.status(200).json({
      status: "success",
      message: `Updated successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSecret = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Id",
      });
    }
    const deleted = await SecretModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Entry not found",
      });
    }

    res.status(200).json({ success: "true" });
  } catch (error) {
    next(error);
  }
};

export const listAllSecrets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const retrieved = await SecretModel.find({}, { _id: 0, __v: 0 }).lean();
    const secrets = await Promise.all(
      retrieved.map(async (item) => {
        const { otp, expires } = await TOTP.generate(item.secretCode);
        return {
          id: item.id,
          issuer: item.issuer,
          otp,
          expires,
        };
      })
    );
    res.status(200).json(secrets);
  } catch (error) {
    next(error);
  }
};
