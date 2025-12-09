import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../constants/theme";
import type { Transaction } from "../../types/wallet.types";
import { TransactionItem } from "./TransactionItem";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  onViewAll?: () => void;
}

export function RecentTransactions({
  transactions,
  onTransactionPress,
  onViewAll,
}: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        {onViewAll && (
          <Text style={styles.viewAll} onPress={onViewAll}>
            View All
          </Text>
        )}
      </View>

      {/* Transactions List */}
      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => onTransactionPress?.(item)}
            />
          )}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  listContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
