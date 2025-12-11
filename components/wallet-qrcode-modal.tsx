import { theme } from "@/constants/theme";
import { Wallet } from "@/types/wallet.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Platform, Pressable, Share, StyleSheet, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { toast } from "sonner-native";

interface WalletQRModalProps {
  visible: boolean;
  onDismiss: () => void;
  walletData: Wallet | null;
}

export const WalletQRModal: React.FC<WalletQRModalProps> = ({
  visible,
  onDismiss,
  walletData,
}) => {
  const qrData = JSON.stringify({
    type: "wallet",
    accountNumber: walletData?.accountNumber,
    name: "Oussama Chahidi",
  });

  const handleCopyAccountNumber = async () => {
    await Clipboard.setStringAsync(walletData?.accountNumber || "");
    toast.success("Copied!", {
      description: "Account number copied to clipboard",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send money to my E-Wallet:\n\nAccount: ${walletData?.accountNumber}\nName: "Oussama Chahidi"`,
        title: "My E-Wallet Account",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Wallet QR Code</Text>
          <Pressable onPress={onDismiss} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={220}
              backgroundColor="white"
              color={theme.colors.primary}
              logoSize={40}
              logoMargin={5}
              logoBorderRadius={10}
            />
          </View>

          <Text style={styles.scanText}>
            Scan this code to send money to my wallet
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.detailLabel}>Account Holder</Text>
            </View>
            <Text style={styles.detailValue}>{"Oussama Chahidi"}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.detailLabel}>Account Number</Text>
            </View>
            <View style={styles.accountNumberRow}>
              <Text style={styles.accountNumber}>
                {walletData?.accountNumber}
              </Text>
              <Pressable
                onPress={handleCopyAccountNumber}
                style={styles.copyButton}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={18}
                  color={theme.colors.primary}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.shareButton} onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.shareButtonText}>Share QR Code</Text>
          </Pressable>
        </View>

        <Text style={styles.infoText}>
          💡 Share this QR code with others to receive money directly to your
          wallet
        </Text>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  qrWrapper: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scanText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
  },
  detailsContainer: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  detailCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "600",
  },
  accountNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountNumber: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  copyButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + "15",
  },
  actions: {
    marginBottom: theme.spacing.md,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
