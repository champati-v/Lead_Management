import jwt from "jsonwebtoken";
import { UserRole } from "../models/userModel";

interface TokenPayload {
  userId: string;
  role: UserRole;
}

const generateToken = ({ userId, role }: TokenPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: "7d" });
};

export default generateToken;
