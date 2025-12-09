import type {
  AuthResponse,
  SignInCredentials,
  SignUpData,
} from "../types/auth.types";
import { storage } from "../utils/storage";
import { authApi } from "./api";

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data } = await authApi.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      console.log("✅ Sign In Success");

      return data;
    } catch (error: any) {
      console.error("❌ Sign In Error:", error.response?.data);

      const errorData = error.response?.data || {};
      const message =
        errorData.message || "Failed to sign in. Please try again.";
      const statusCode = error.response?.status || 500;

      throw new ApiError(message, statusCode, errorData.errors);
    }
  },

  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const { data } = await authApi.post<AuthResponse>("/auth/register", {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
      });

      console.log("✅ Sign Up Success");

      return data;
    } catch (error: any) {
      console.error("❌ Sign Up Error:", error.response?.data);

      const errorData = error.response?.data || {};
      const message =
        errorData.message || "Failed to create account. Please try again.";
      const statusCode = error.response?.status || 500;

      throw new ApiError(message, statusCode, errorData.errors);
    }
  },

  async signOut(): Promise<void> {
    try {
      await authApi.post("/auth/logout");
    } catch (error) {
      console.error("❌ Sign Out Error:", error);
    } finally {
      await storage.clearAuth();
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      // Verify token is valid by calling a protected endpoint
      await authApi.get("/auth/me");
      return true;
    } catch (error) {
      return false;
    }
  },
};
