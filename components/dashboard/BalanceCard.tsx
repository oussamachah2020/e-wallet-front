import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { theme } from "../../constants/theme";

interface BalanceCardProps {
  balance: number;
  accountNumber: string;
  currency?: string;
  onRefresh?: () => void;
}

export function BalanceCard({
  balance,
  accountNumber,
  currency = "USD",
  onRefresh,
}: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const maskAccountNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Total Balance</Text>
          <Pressable onPress={onRefresh} hitSlop={8}>
            <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
          </Pressable>
        </View>

        {/* Balance */}
        <View style={styles.balanceContainer}>
          <Pressable
            onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            style={styles.balanceRow}
          >
            <Text style={styles.balance}>
              {isBalanceVisible ? formatBalance(balance) : "••••••"}
            </Text>
            <MaterialCommunityIcons
              name={isBalanceVisible ? "eye-off" : "eye"}
              size={24}
              color="#FFF"
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>

        {/* Account Number */}
        <View style={styles.footer}>
          <View style={styles.accountInfo}>
            <MaterialCommunityIcons name="credit-card" size={16} color="#FFF" />
            <Text style={styles.accountNumber}>
              {maskAccountNumber(accountNumber)}
            </Text>
          </View>

          <View style={styles.chip}>
            <MaterialCommunityIcons
              name="contactless-payment"
              size={24}
              color="#FFF"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.large,
  },
  gradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    minHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  headerText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  balanceContainer: {
    flex: 1,
    justifyContent: "center",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balance: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  eyeIcon: {
    marginLeft: theme.spacing.sm,
    opacity: 0.8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountNumber: {
    color: "#FFF",
    fontSize: 14,
    marginLeft: theme.spacing.sm,
    opacity: 0.9,
  },
  chip: {
    opacity: 0.6,
  },
});
