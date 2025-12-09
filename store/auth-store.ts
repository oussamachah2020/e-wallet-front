import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "../services/auth-service";
import type {
  AuthResponse,
  SignInCredentials,
  SignUpData,
  User,
} from "../types/auth.types";
import { storage } from "../utils/storage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signUp: (userData: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      signIn: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.signIn(credentials);

          // Store tokens in both Zustand and SecureStore
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Also store in SecureStore for extra security
          await storage.setAccessToken(response.accessToken);
          await storage.setRefreshToken(response.refreshToken);

          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      signUp: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authService.signUp(userData);

          // Store tokens in both Zustand and SecureStore
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Also store in SecureStore for extra security
          await storage.setAccessToken(response.accessToken);
          await storage.setRefreshToken(response.refreshToken);

          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
        } catch (error) {
          console.error("Sign out error:", error);
        } finally {
          // Clear both stores
          await storage.clearAuth();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // First check Zustand state
          const { accessToken } = get();

          if (accessToken) {
            // Verify token is still valid
            const isValid = await authService.checkAuth();

            if (isValid) {
              // Token is valid, ensure we have user data
              if (!get().user) {
                const user = await storage.getUser();
                set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  isInitialized: true,
                });
              } else {
                set({
                  isAuthenticated: true,
                  isLoading: false,
                  isInitialized: true,
                });
              }
            } else {
              // Token invalid, clear auth
              get().clearAuth();
              set({ isLoading: false, isInitialized: true });
            }
          } else {
            // No token, check SecureStore as backup
            const storedToken = await storage.getAccessToken();

            if (storedToken) {
              const user = await storage.getUser();
              set({
                accessToken: storedToken,
                user,
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
              });
            } else {
              set({
                isLoading: false,
                isInitialized: true,
                isAuthenticated: false,
              });
            }
          }
        } catch (error) {
          console.error("Check auth error:", error);
          set({
            isLoading: false,
            isInitialized: true,
            isAuthenticated: false,
          });
        }
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      setUser: (user) => {
        set({ user });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // Name of the item in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
