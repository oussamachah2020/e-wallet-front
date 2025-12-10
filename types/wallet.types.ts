export enum TransactionType {
  CREDIT = "credit", // Money in (funding)
  DEBIT = "debit", // Money out (withdrawal)
  TRANSFER = "transfer", // P2P transfer
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  reference: string;
  description: string;
  category: string;
  createdAt: string;

  recipient?: {
    name: string;
    avatar?: string;
  };
  status: TransactionStatus;
}

export enum WalletStatus {
  ACTIVE = "active",
  FROZEN = "frozen",
  CLOSED = "closed",
}
export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  accountNumber: string;
}

export interface TransactionDto {
  toUserId: string;
  amount: number;
  description?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}
