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
};
