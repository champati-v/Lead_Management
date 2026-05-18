import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserRole } from "../models/userModel";

interface AuthJwtPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized access") as Error & { statusCode?: number };
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    const error = new Error("JWT_SECRET is not configured") as Error & { statusCode?: number };
    error.statusCode = 500;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthJwtPayload;

    if (!decoded.userId) {
      const error = new Error("Invalid token") as Error & { statusCode?: number };
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new Error("Unauthorized access") as Error & { statusCode?: number };
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();
  } catch (_error) {
    const error = new Error("Unauthorized access") as Error & { statusCode?: number };
    error.statusCode = 401;
    return next(error);
  }
};

export default authMiddleware;
