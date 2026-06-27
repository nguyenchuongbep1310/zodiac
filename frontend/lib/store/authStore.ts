"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { TokenPair } from "@/lib/types/api";
import { tokenStorage } from "@/lib/api/client";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  userId: string | null;
  userRole: string | null;
  isAuthenticated: boolean;

  setTokens: (pair: TokenPair) => void;
  setUser: (id: string, email: string, role: string) => void;
  logout: () => void;
  hydrate: () => void;
}

interface JwtPayload {
  email: string;
  uid: string;
  role: string;
  exp: number;
}

// Decode JWT payload without verifying signature (client-side display only)
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userEmail: null,
      userId: null,
      userRole: null,
      isAuthenticated: false,

      setTokens: (pair: TokenPair) => {
        tokenStorage.set(pair);
        const payload = decodeJwtPayload(pair.access_token);
        set({
          accessToken: pair.access_token,
          refreshToken: pair.refresh_token,
          isAuthenticated: true,
          userId: payload ? payload.uid : null,
          userRole: payload ? payload.role : null,
          userEmail: payload ? payload.email : null,
        });
      },

      setUser: (id, email, role) =>
        set({ userId: id, userEmail: email, userRole: role }),

      logout: () => {
        tokenStorage.clear();
        set({
          accessToken: null,
          refreshToken: null,
          userEmail: null,
          userId: null,
          userRole: null,
          isAuthenticated: false,
        });
      },

      hydrate: () => {
        const token = tokenStorage.getAccess();
        const refresh = tokenStorage.getRefresh();
        if (token) {
          const payload = decodeJwtPayload(token);
          // Check expiry
          if (payload && payload.exp && typeof payload.exp === "number") {
            const expired = payload.exp * 1000 < Date.now();
            if (!expired) {
              set({
                accessToken: token,
                refreshToken: refresh,
                isAuthenticated: true,
                userId: payload.uid,
                userRole: payload.role,
                userEmail: payload.email,
              });
              return;
            }
          }
          tokenStorage.clear();
        }
      },
    }),
    {
      name: "zodiac-auth",
      partialize: (state) => ({
        userEmail: state.userEmail,
        userId: state.userId,
        userRole: state.userRole,
      }),
    }
  )
);
