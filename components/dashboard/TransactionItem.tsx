import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../constants/theme";
import { TransactionType, type Transaction } from "../../types/wallet.types";

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  showRecipient?: boolean; // Optional: show who sent/received
}

export function TransactionItem({
  transaction,
  onPress,
  showRecipient = true,
}: TransactionItemProps) {
  const isCredit =
    transaction.type === TransactionType.CREDIT ||
    transaction.type === TransactionType.DEBIT;
  const isTransfer = transaction.type === TransactionType.TRANSFER;

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case TransactionType.CREDIT:
        return "arrow-down-circle";
      case TransactionType.DEBIT:
      case "transfer":
        return isCredit ? "arrow-down-circle" : "arrow-up-circle";
      default:
        return "currency-usd";
    }
  };

  const getTransactionTitle = () => {
    if (transaction.description) {
      return transaction.description;
    }

    switch (transaction.type) {
      case "credit":
        return "Money Received";
      case "debit":
        return "Money Sent";
      case TransactionType.DEBIT:
        return "Wallet Funded";
      case "transfer":
        return isCredit ? "Money Received" : "Money Sent";
      default:
        return "Transaction";
    }
  };

  const getTransactionSubtitle = () => {
    const parts = [];

    // Transaction type
    parts.push(
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
    );

    // Reference number (shortened)
    if (transaction.reference) {
      const shortRef =
        transaction.reference.split("-").pop() || transaction.reference;
      parts.push(shortRef);
    }

    return parts.join(" • ");
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isCredit
              ? theme.colors.success + "15"
              : theme.colors.error + "15",
          },
        ]}
      >
        <MaterialCommunityIcons
          name={getTransactionIcon() as any}
          size={24}
          color={isCredit ? theme.colors.success : theme.colors.error}
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {getTransactionTitle()}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.subtitle}>{getTransactionSubtitle()}</Text>
        </View>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
      </View>

      {/* Amount & Status */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            { color: isCredit ? theme.colors.success : theme.colors.error },
          ]}
        >
          {isCredit ? "+" : "-"}
          {formatAmount(transaction.amount)}
        </Text>
        {transaction.status === "pending" && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        )}
        {transaction.status === "completed" && (
          <View style={styles.completedBadge}>
            <MaterialCommunityIcons
              name="check-circle"
              size={12}
              color={theme.colors.success}
            />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: theme.colors.warning + "20",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: theme.colors.warning,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.success + "10",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "600",
  },
});