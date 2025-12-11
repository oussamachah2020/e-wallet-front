import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { AmountInput } from "@/components/send/AmountInput";
import { theme } from "@/constants/theme";
import { transactionService } from "@/services/transaction-service";
import { useWalletStore } from "@/store/wallet-store";

type PaymentMethod = "card" | "bank" | "paypal" | "crypto";

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
  fee: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "card",
    name: "Debit/Credit Card",
    icon: "credit-card",
    description: "Add money instantly",
    processingTime: "Instant",
    fee: "2.9% + $0.30",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: "bank",
    description: "Transfer from your bank",
    processingTime: "1-3 business days",
    fee: "Free",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "paypal",
    description: "Pay with PayPal balance",
    processingTime: "Instant",
    fee: "3.5%",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "bitcoin",
    description: "Pay with crypto",
    processingTime: "10-30 minutes",
    fee: "Network fees apply",
  },
];

export default function FundWalletScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState("");
  const { wallet } = useWalletStore();

  const validateAmount = () => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
      setAmountError("Please enter a valid amount");
      return false;
    }

    if (numAmount < 10) {
      setAmountError("Minimum amount is $10.00");
      return false;
    }

    if (numAmount > 10000) {
      setAmountError("Maximum amount is $10,000.00");
      return false;
    }

    setAmountError("");
    return true;
  };

  const calculateFee = () => {
    if (!selectedMethod || !amount) return 0;

    const numAmount = parseFloat(amount);
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

    switch (selectedMethod) {
      case "card":
        return numAmount * 0.029 + 0.3;
      case "bank":
        return 0;
      case "paypal":
        return numAmount * 0.035;
      case "crypto":
        return 0; // Network fees handled separately
      default:
        return 0;
    }
  };

  const getTotalAmount = () => {
    if (!amount) return 0;
    return parseFloat(amount) + calculateFee();
  };

  const handleContinue = async () => {
    if (!validateAmount()) {
      return;
    }

    setLoading(true);

    try {
      await transactionService.fundWallet(parseFloat(amount));

      setTimeout(() => {
        toast.success("Wallet Funded!", {
          description: `$${amount} added to your wallet`,
        });
        router.back();
      }, 2000);
    } catch (error: any) {
      console.error("Funding error:", error);
      toast.error("Funding Failed", {
        description:
          error.message || "Failed to fund wallet. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.infoBannerText}>
                Add money to your wallet to send payments and make purchases
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Enter Amount</Text>
              <AmountInput
                balance={wallet?.balance || 0}
                amount={amount}
                onAmountChange={setAmount}
                error={amountError}
              />
            </View>

            {/* Payment Methods */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>

              <View style={styles.methodsContainer}>
                {PAYMENT_METHODS.map((method) => (
                  <Pressable
                    key={method.id}
                    style={[
                      styles.methodCard,
                      selectedMethod === method.id && styles.methodCardSelected,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    <View style={styles.methodHeader}>
                      <View style={styles.methodIconContainer}>
                        <MaterialCommunityIcons
                          name={method.icon as any}
                          size={28}
                          color={
                            selectedMethod === method.id
                              ? theme.colors.primary
                              : theme.colors.text
                          }
                        />
                      </View>
                      <View style={styles.methodInfo}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        <Text style={styles.methodDescription}>
                          {method.description}
                        </Text>
                      </View>
                      <View style={styles.radioButton}>
                        {selectedMethod === method.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>

                    <View style={styles.methodDetails}>
                      <View style={styles.methodDetail}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.methodDetailText}>
                          {method.processingTime}
                        </Text>
                      </View>
                      <View style={styles.methodDetail}>
                        <MaterialCommunityIcons
                          name="cash"
                          size={14}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.methodDetailText}>
                          {method.fee}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View> */}

            {/* Transaction Summary */}
            {amount ? (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount</Text>
                  <Text style={styles.summaryValue}>${amount}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Processing Fee</Text>
                  <Text style={styles.summaryValue}>
                    ${calculateFee().toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>
                    Total to be charged
                  </Text>
                  <Text style={styles.summaryTotalValue}>
                    ${getTotalAmount().toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryNote}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={16}
                    color={theme.colors.success}
                  />
                  <Text style={styles.summaryNoteText}>
                    Your payment is secure and encrypted
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
            labelStyle={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}
            disabled={!amount || loading}
            loading={loading}
          >
            {loading ? "Processing..." : "Continue Funding"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? 45 : 50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "15",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  methodsContainer: {
    gap: theme.spacing.md,
  },
  methodCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  methodCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "05",
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  methodDetails: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  methodDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  methodDetailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  summary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  summaryNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.success + "10",
    borderRadius: theme.borderRadius.sm,
  },
  summaryNoteText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
});
