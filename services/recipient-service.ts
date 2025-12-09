import { Recipient } from "@/types/transaction.types";
import { walletApi } from "./api";

export const recipientService = {
  async searchRecipient(accountNumber: string) {
    try {
      const { data, status } = await walletApi.get<Recipient>(
        `/wallets/search?accountNumber=${accountNumber}`
      );

      return data;
    } catch (error: any) {
      console.error("❌ Failed to find recipients:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Sign up failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async addRecipient(accountNumber: string) {
    try {
      const { data, status } = await walletApi.post<Recipient>(
        `/beneficiaries/add`,
        { accountNumber }
      );

      return data;
    } catch (error: any) {
      console.error("❌ Failed to find recipients:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Sign up failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async getRecipients() {
    try {
      const { data } = await walletApi.get<Recipient[]>(`/beneficiaries`);

      return data;
    } catch (error: any) {
      console.error("❌ Failed to find recipients:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Sign up failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },

  async getRecipientDetails(id: string) {
    try {
      const { data } = await walletApi.get<Recipient>(`/beneficiaries/${id}`);

      return data;
    } catch (error: any) {
      console.error("❌ Failed to find recipients:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Extract error message from backend response
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "Sign up failed";

      // Create a custom error with the backend message
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response?.status;
      (customError as any).response = error.response;

      throw customError;
    }
  },
};
