import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { theme } from "../../constants/theme";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  balance: number;
  error?: string;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];

export function AmountInput({
  amount,
  onAmountChange,
  balance,
  error,
}: AmountInputProps) {
  const formatBalance = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const handleQuickAmount = (value: number) => {
    onAmountChange(value.toString());
  };

  const validateAmount = (value: string) => {
    // Allow empty, digits, and single decimal point
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.balance}>Balance: {formatBalance(balance)}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          mode="flat"
          value={amount}
          onChangeText={validateAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          style={styles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          error={!!error}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.quickAmounts}>
        {QUICK_AMOUNTS.map((value) => (
          <Pressable
            key={value}
            onPress={() => handleQuickAmount(value)}
            style={({ pressed }) => [
              styles.quickButton,
              pressed && styles.quickButtonPressed,
              amount === value.toString() && styles.quickButtonActive,
            ]}
          >
            <Text
              style={[
                styles.quickButtonText,
                amount === value.toString() && styles.quickButtonTextActive,
              ]}
            >
              ${value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  balance: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  quickAmounts: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickButtonPressed: {
    opacity: 0.7,
  },
  quickButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  quickButtonTextActive: {
    color: "#FFFFFF",
  },
});
