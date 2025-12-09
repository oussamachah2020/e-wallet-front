import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../constants/theme";
import type { Transaction } from "../../types/wallet.types";

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  const isCredit = transaction.type === "credit";

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "food",
      shopping: "shopping",
      transport: "car",
      entertainment: "filmstrip",
      bills: "file-document",
      transfer: "bank-transfer",
      salary: "cash",
      default: "currency-usd",
    };
    return icons[category.toLowerCase()] || icons.default;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
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
          name={getCategoryIcon(transaction.category) as any}
          size={24}
          color={isCredit ? theme.colors.success : theme.colors.error}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>

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
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: "capitalize",
  },
  separator: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginHorizontal: 6,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: theme.colors.warning + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: theme.colors.warning,
    fontWeight: "600",
  },
});
