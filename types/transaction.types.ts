// src/types/transaction.types.ts
export interface SendMoneyRequest {
  recipientId: string;
  amount: number;
  description?: string;
  pin?: string;
}

export interface TransactionResponse {
  id: string;
  status: "success" | "pending" | "failed";
  amount: number;
  recipient: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  message?: string;
}

export interface Recipient {
  id: string;
  userId: string;
  recipientUserId: string;
  fullName: string;
  accountNumber?: string;
  avatar?: string;
}
