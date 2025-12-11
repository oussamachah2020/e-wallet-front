import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { PinModal } from "@/components/pin-modal";
import { AmountInput } from "@/components/send/AmountInput";
import { theme } from "@/constants/theme";
import { recipientService } from "@/services/recipient-service";
import { transactionService } from "@/services/transaction-service";
import { walletService } from "@/services/wallet-service";
import { useTransactionStore } from "@/store/transaction-store";
import { Recipient } from "@/types/transaction.types";

const MOCK_WALLET = {
  balance: 12847.5,
  currency: "USD",
};

export default function TransferScreen() {
  const router = useRouter();
  const [recipient, setRecipient] = useState<Recipient | undefined>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRecipient, setFetchingRecipient] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [walletBalance] = useState(MOCK_WALLET.balance);
  const [transactionId, setTransactionId] = useState("");
  const { recipientId } = useTransactionStore();
  const [showPinModal, setShowPinModal] = useState(false);

  const validateAmount = () => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
      setAmountError("Please enter a valid amount");
      return false;
    }

    if (numAmount > walletBalance) {
      setAmountError("Insufficient balance");
      return false;
    }

    if (numAmount < 1) {
      setAmountError("Minimum amount is $1.00");
      return false;
    }

    setAmountError("");
    return true;
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setRecipient(undefined);
    setAmount("");
    setDescription("");
    router.replace("/(protected)"); // Go back to home screen
  };

  useEffect(() => {
    const fetchRecipient = async () => {
      if (recipientId) {
        try {
          setFetchingRecipient(true);
          const fetchedRecipient =
            await recipientService.getRecipientDetails(recipientId);
          setRecipient(fetchedRecipient);
        } catch (error: any) {
          toast.error("Error", {
            description: error.message || "Failed to load recipient details",
          });
          router.back();
        } finally {
          setFetchingRecipient(false);
        }
      } else {
        toast.error("Error", { description: "No recipient selected" });
        router.back();
      }
    };

    fetchRecipient();
  }, [recipientId]);

  const handleContinue = async () => {
    if (!recipient) {
      toast.warning("Please select a recipient");
      return;
    }

    if (!validateAmount()) {
      return;
    }

    // Show PIN modal instead of processing immediately
    setShowPinModal(true);
  };

  const handlePinVerified = async (pin: string) => {
    console.log("🔐 Verifying PIN:", pin);
    setLoading(true);

    try {
      // Step 1: Verify PIN with backend
      const isValid = await walletService.verifyPin(pin);

      console.log("✅ PIN verification result:", isValid);

      if (!isValid) {
        // PIN is incorrect - show error but don't close modal
        toast.error("Invalid PIN", {
          description: "The PIN you entered is incorrect. Please try again.",
        });

        setLoading(false);
        // Keep modal open so user can try again
        return;
      }

      // Step 2: PIN is valid - close modal
      setShowPinModal(false);
      toast.success("PIN verified successfully");

      // Step 3: Process transaction
      const transaction = {
        toUserId: recipient!.recipientUserId,
        amount: parseFloat(amount),
        description: description || undefined,
      };

      const response =
        await transactionService.sendFundToRecipient(transaction);

      // Step 4: Show success
      setTransactionId(response.id || "");
      setShowSuccessModal(true);

      toast.success("Transfer Successful", {
        description: `$${amount} sent successfully to ${recipient?.fullName || "John Doe"}`,
      });
    } catch (error: any) {
      console.error("❌ Transfer error:", error);

      // Close PIN modal on network/server error
      setShowPinModal(false);

      toast.error("Transfer Failed", {
        description:
          error.message || "Failed to complete transfer. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while fetching recipient
  if (fetchingRecipient) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading recipient details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no recipient found
  if (!recipient) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={theme.colors.error}
          />
          <Text style={styles.errorTitle}>Recipient Not Found</Text>
          <Text style={styles.errorMessage}>
            Unable to load recipient details. Please try again.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

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
        >
          <View style={styles.content}>
            {/* Recipient Info Card */}
            <View style={styles.recipientCard}>
              <Text style={styles.recipientLabel}>Sending to:</Text>
              <View style={styles.recipientInfo}>
                <View style={styles.recipientAvatar}>
                  <Text style={styles.recipientInitials}>
                    {(recipient.fullName || "John Doe")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.recipientDetails}>
                  <Text style={styles.recipientName}>
                    {recipient.fullName || "John Doe"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Amount Input */}
            <AmountInput
              amount={amount}
              onAmountChange={setAmount}
              balance={walletBalance}
              error={amountError}
            />

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                mode="outlined"
                placeholder="What's this for?"
                value={description}
                onChangeText={setDescription}
                maxLength={100}
                style={styles.descriptionInput}
                multiline
                numberOfLines={3}
                disabled={loading}
              />
            </View>

            {/* Transaction Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Transaction Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>${amount || "0.00"}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fee</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>

              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>
                  ${amount || "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.sendButton}
            contentStyle={styles.sendButtonContent}
            disabled={!amount || loading}
            loading={loading}
          >
            {loading ? "Processing..." : "Send Money"}
          </Button>
        </View>
      </KeyboardAvoidingView>
      <PinModal
        visible={showPinModal}
        onDismiss={() => setShowPinModal(false)}
        onSuccess={handlePinVerified}
        mode="verify"
        title="Verify PIN"
        subtitle="Enter your 4-digit PIN to confirm this transaction"
      />
      {/* Success Modal */}
      <Portal>
        <Modal
          visible={showSuccessModal}
          dismissable={false}
          contentContainerStyle={styles.successModal}
        >
          <View style={styles.successContent}>
            {/* Success Animation Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <MaterialCommunityIcons
                  name="check"
                  size={48}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.successTitle}>Transfer Successful!</Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Amount Sent</Text>
                <Text style={styles.successDetailValue}>
                  ${parseFloat(amount).toFixed(2)}
                </Text>
              </View>

              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>To</Text>
                <Text style={styles.successDetailValue}>
                  {recipient?.fullName || "John Doe"}
                </Text>
              </View>

              {description && (
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Note</Text>
                  <Text
                    style={[
                      styles.successDetailValue,
                      styles.successDetailNote,
                    ]}
                  >
                    {description}
                  </Text>
                </View>
              )}

              {transactionId && (
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Transaction ID</Text>
                  <Text
                    style={[styles.successDetailValue, styles.successDetailId]}
                  >
                    {transactionId}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.successActions}>
              <Button
                mode="contained"
                onPress={handleSuccessClose}
                style={styles.successButton}
                contentStyle={styles.successButtonContent}
              >
                Done
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  setShowSuccessModal(false);
                  setAmount("");
                  setDescription("");
                }}
                style={styles.sendAgainButton}
              >
                Send Again
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? theme.spacing.md : 0,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    borderRadius: 100,
    paddingHorizontal: theme.spacing.xl,
  },
  recipientCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  recipientLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  recipientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  recipientInitials: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  recipientEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.lg,
  },
  descriptionInput: {
    backgroundColor: theme.colors.card,
  },
  summary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
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
    color: theme.colors.text,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sendButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
  },
  sendButtonContent: {
    paddingVertical: 8,
  },
  successModal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  successContent: {
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: theme.spacing.lg,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.large,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  successDetails: {
    width: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  successDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  successDetailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  successDetailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  successDetailNote: {
    fontStyle: "italic",
  },
  successDetailId: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  successActions: {
    width: "100%",
    gap: theme.spacing.sm,
  },
  successButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.success,
  },
  successButtonContent: {
    paddingVertical: 8,
  },
  sendAgainButton: {
    borderRadius: 100,
    borderColor: theme.colors.border,
  },
});
