export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  category: string;
  date: string;
  recipient?: {
    name: string;
    avatar?: string;
  };
  status: "completed" | "pending" | "failed";
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
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
