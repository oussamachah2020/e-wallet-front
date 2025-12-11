import { theme } from "@/constants/theme";
import { Transaction, TransactionType } from "@/types/wallet.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React from "react";
import { Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { Divider, Modal, Portal, Text } from "react-native-paper";
import { toast } from "sonner-native";

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onDismiss: () => void;
}

export const TransactionDetailsModal: React.FC<
  TransactionDetailsModalProps
> = ({ visible, transaction, onDismiss }) => {
  if (!transaction) return null;

  const isCredit =
    transaction.type === TransactionType.CREDIT ||
    (transaction.type === TransactionType.TRANSFER && transaction.toWalletId);

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "completed":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "completed":
        return "check-circle";
      case "pending":
        return "clock-outline";
      case "failed":
        return "close-circle";
      default:
        return "information";
    }
  };

  const handleShare = async () => {
    try {
      const message = `
Transaction Receipt
━━━━━━━━━━━━━━━━━━

Amount: ${isCredit ? "+" : "-"}${formatAmount(transaction.amount)}
Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
Status: ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
Reference: ${transaction.reference}
Date: ${formatDate(transaction.createdAt)}
${transaction.description ? `\nDescription: ${transaction.description}` : ""}

━━━━━━━━━━━━━━━━━━
E-Wallet Transaction
      `.trim();

      await Share.share({
        message,
        title: "Transaction Receipt",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .amount { font-size: 32px; font-weight: bold; color: ${isCredit ? "#4CAF50" : "#D32F2F"}; }
              .details { margin-top: 20px; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { color: #666; }
              .value { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Transaction Receipt</h1>
              <p class="amount">${isCredit ? "+" : "-"}${formatAmount(transaction.amount)}</p>
            </div>
            <div class="details">
              <div class="row">
                <span class="label">Type:</span>
                <span class="value">${transaction.type}</span>
              </div>
              <div class="row">
                <span class="label">Status:</span>
                <span class="value">${transaction.status}</span>
              </div>
              <div class="row">
                <span class="label">Reference:</span>
                <span class="value">${transaction.reference}</span>
              </div>
              <div class="row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(transaction.createdAt)}</span>
              </div>
              ${
                transaction.description
                  ? `
                <div class="row">
                  <span class="label">Description:</span>
                  <span class="value">${transaction.description}</span>
                </div>
              `
                  : ""
              }
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.warning("Error", { description: "Failed to generate PDF" });
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
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
                  name={isCredit ? "arrow-down" : "arrow-up"}
                  size={32}
                  color={isCredit ? theme.colors.success : theme.colors.error}
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>
                  {transaction.description || "Transaction"}
                </Text>
                <View style={styles.statusBadge}>
                  <MaterialCommunityIcons
                    name={getStatusIcon() as any}
                    size={16}
                    color={getStatusColor()}
                  />
                  <Text
                    style={[styles.statusText, { color: getStatusColor() }]}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          </View>

          {/* Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text
              style={[
                styles.amountValue,
                { color: isCredit ? theme.colors.success : theme.colors.error },
              ]}
            >
              {isCredit ? "+" : "-"}
              {formatAmount(transaction.amount)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Transaction Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Transaction Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference</Text>
              <Text style={[styles.detailValue, styles.referenceText]}>
                {transaction.reference}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {formatDate(transaction.createdAt)}
              </Text>
            </View>

            {transaction.completedAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Completed At</Text>
                <Text style={styles.detailValue}>
                  {formatDate(transaction.completedAt)}
                </Text>
              </View>
            )}

            {transaction.description && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>
                  {transaction.description}
                </Text>
              </View>
            )}

            {transaction.metadata && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Additional Info</Text>
                <Text style={styles.detailValue}>
                  {JSON.stringify(transaction.metadata)}
                </Text>
              </View>
            )}
          </View>

          {/* Transaction IDs Section */}
          <View style={styles.idsSection}>
            <Text style={styles.sectionTitle}>Transaction IDs</Text>

            <View style={styles.idRow}>
              <Text style={styles.idLabel}>Transaction ID</Text>
              <Text style={styles.idValue} numberOfLines={1}>
                {transaction.id}
              </Text>
            </View>

            {transaction.fromWalletId && (
              <View style={styles.idRow}>
                <Text style={styles.idLabel}>From Wallet</Text>
                <Text style={styles.idValue} numberOfLines={1}>
                  {transaction.fromWalletId}
                </Text>
              </View>
            )}

            {transaction.toWalletId && (
              <View style={styles.idRow}>
                <Text style={styles.idLabel}>To Wallet</Text>
                <Text style={styles.idValue} numberOfLines={1}>
                  {transaction.toWalletId}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable style={styles.actionButton} onPress={handleDownload}>
            <MaterialCommunityIcons
              name="download"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.actionButtonText}>Download</Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    maxHeight: "85%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  amountSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  amountLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  divider: {
    marginHorizontal: theme.spacing.lg,
  },
  detailsSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  referenceText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  idsSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  idRow: {
    marginBottom: theme.spacing.sm,
  },
  idLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  idValue: {
    fontSize: 11,
    color: theme.colors.text,
    fontFamily: "monospace",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  actionDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
});
