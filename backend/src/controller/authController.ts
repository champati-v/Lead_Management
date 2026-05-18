import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "sales";
  };

  const { user, token } = await registerUser({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, token },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    const error = new Error("Unauthorized") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }

  const user = await getCurrentUser(currentUser._id.toString());

  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: user,
  });
});
