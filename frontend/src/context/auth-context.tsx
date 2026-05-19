import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "@/lib/api";
import { getMe, login as loginApi, register as registerApi, type LoginPayload, type RegisterPayload } from "@/services/auth-service";
import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((me) => setUser(me))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await loginApi(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    const me = await getMe().catch(() => data.user);
    setUser(me);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await registerApi(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    const me = await getMe().catch(() => data.user);
    setUser(me);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
