import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "sales"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
