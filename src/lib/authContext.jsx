import { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "./authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const value = useMemo(() => {
    return {
      token,
      login: (newToken) => {
        if (!newToken) return;
        setToken(newToken);
        setTokenState(newToken);
      },
      logout: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

