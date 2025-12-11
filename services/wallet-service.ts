import { SetPinDto } from "@/types/wallet.types";
import { walletApi } from "./api";

export const walletService = {
  async getWallet() {
    try {
      const { data, status } = await walletApi.get(`/wallets/user`);

      return data;
    } catch (error: any) {
      console.error("❌ Failed to get wallet:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Get wallet failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async createWallet() {
    try {
      const { data, status } = await walletApi.post(`/wallets/create`);

      return data;
    } catch (error: any) {
      console.error("❌ Failed to get wallet:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Get wallet failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async setWalletPin(pinDto: SetPinDto) {
    try {
      const { data } = await walletApi.post(`/wallets/set-pin`, pinDto);

      return data;
    } catch (error: any) {
      console.error("❌ Failed to set wallet pin:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "setting pin failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async verifyPin(pin: string) {
    try {
      const { data } = await walletApi.post<{ verified: boolean }>(
        `/wallets/verify-pin`,
        { pin }
      );

      console.log("✅ PIN verification response:", data);

      // Return the verified boolean
      return data.verified;
    } catch (error: any) {
      console.error("❌ Verify PIN Error Details:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error(
        "Response Data:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method);
      console.error("Request Data:", error.config?.data);
      console.error("Request Headers:", error.config?.headers);
      // Handle specific error cases
      const errorData = error.response?.data || {};

      // If backend returns 401 or specific error for invalid PIN
      if (
        error.response?.status === 401 ||
        errorData.message?.includes("Invalid PIN")
      ) {
        return false; // Invalid PIN - return false instead of throwing
      }

      // Extract error message for other errors
      const errorMessage = Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message || error.message || "PIN verification failed";

      // Throw error for network/server issues
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      throw customError;
    }
  },
};
