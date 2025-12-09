import { TransactionDto } from "@/types/wallet.types";
import { walletApi } from "./api";

export const transactionService = {
  async sendFundToRecipient(transaction: TransactionDto) {
    try {
      const { data, status } = await walletApi.post(
        `/transactions/transfer`,
        transaction
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
};
