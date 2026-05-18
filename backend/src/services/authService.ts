import bcrypt from "bcryptjs";
import User, { IUser, UserRole } from "../models/userModel";
import generateToken from "../utils/generateToken";

interface AuthInput {
  email: string;
  password: string;
}

interface RegisterInput extends AuthInput {
  name: string;
  role?: UserRole;
}

interface ServiceResponse {
  user: IUser;
  token: string;
}

interface ServiceError extends Error {
  statusCode?: number;
}

const createServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export const registerUser = async ({
  name,
  email,
  password,
  role,
}: RegisterInput): Promise<ServiceResponse> => {
  if (!name || !email || !password) {
    throw createServiceError("Name, email and password are required", 400);
  }

  if (password.length < 6) {
    throw createServiceError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createServiceError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  const safeUser = await User.findById(user._id);
  if (!safeUser) {
    throw createServiceError("User not found", 404);
  }

  const token = generateToken({ userId: safeUser._id.toString(), role: safeUser.role });

  return { user: safeUser, token };
};

export const loginUser = async ({ email, password }: AuthInput): Promise<ServiceResponse> => {
  if (!email || !password) {
    throw createServiceError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw createServiceError("Invalid credentials", 401);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw createServiceError("Invalid credentials", 401);
  }

  const safeUser = await User.findById(user._id);
  if (!safeUser) {
    throw createServiceError("User not found", 404);
  }

  const token = generateToken({ userId: safeUser._id.toString(), role: safeUser.role });

  return { user: safeUser, token };
};

export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw createServiceError("User not found", 404);
  }

  return user;
};
