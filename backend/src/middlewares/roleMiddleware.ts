import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/userModel";

const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = new Error("Unauthorized access") as Error & { statusCode?: number };
      error.statusCode = 401;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error("Forbidden: insufficient permissions") as Error & {
        statusCode?: number;
      };
      error.statusCode = 403;
      return next(error);
    }

    return next();
  };

export default authorizeRoles;
