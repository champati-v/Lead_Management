import { api } from "@/lib/api";
import type { AuthResponse, User, UserRole } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

function normalizeUser(raw: any): User {
  const nameFromEmail = typeof raw?.email === "string" ? raw.email.split("@")[0] : "User";
  return {
    _id: String(raw?._id ?? raw?.id ?? ""),
    name: String(raw?.name ?? raw?.fullName ?? nameFromEmail),
    email: String(raw?.email ?? ""),
    role: (raw?.role === "admin" ? "admin" : "sales") as UserRole,
  };
}

function normalizeAuthResponse(payload: any): AuthResponse {
  const body = payload?.data ?? payload;
  return {
    token: String(body?.token ?? ""),
    user: normalizeUser(body?.user ?? body),
  };
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/api/auth/register", payload);
  return normalizeAuthResponse(data);
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/api/auth/login", payload);
  return normalizeAuthResponse(data);
}

export async function getMe() {
  const { data } = await api.get("/api/auth/me");
  return normalizeUser(data?.data?.user ?? data?.user ?? data?.data ?? data);
}
