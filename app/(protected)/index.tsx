import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { PinModal } from "@/components/pin-modal";
import { TransactionDetailsModal } from "@/components/transaction-details-modal";
import { WalletQRModal } from "@/components/wallet-qrcode-modal";
import { theme } from "@/constants/theme";
import { transactionService } from "@/services/transaction-service";
import { walletService } from "@/services/wallet-service";
import { useWalletStore } from "@/store/wallet-store";
import { Transaction } from "@/types/wallet.types";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { wallet, setWallet } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    let data = await walletService.getWallet();
    setWallet(data);

    setRefreshing(false);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (wallet) return;

    async function getUserWallet() {
      try {
        let data = await walletService.getWallet();

        if (!data) {
          await walletService.createWallet();
          data = await walletService.getWallet();
        }

        setWallet(data);
      } catch (error) {
        console.error("Failed to get/create wallet:", error);
      }
    }

    getUserWallet();
  }, [wallet]);

  useEffect(() => {
    if (wallet) return;

    async function getTransactions() {
      try {
        const data = await transactionService.getTransactionsHistory();

        setTransactions(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to get transactions history:", error);
      }
    }

    getTransactions();
  }, [wallet]);

  useEffect(() => {
    if (wallet && !wallet.hasPin) {
      setIsVisible(true);
    }
  }, [wallet]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Custom Header */}
      <View style={styles.header}>
        <IconButton
          icon="menu"
          size={28}
          iconColor={theme.colors.text}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.headerActions}>
          <IconButton
            icon="bell-outline"
            size={24}
            iconColor={theme.colors.text}
            onPress={() => console.log("Notifications")}
          />
          <IconButton
            icon="qrcode-scan"
            size={24}
            iconColor={theme.colors.text}
            onPress={() => setShowQRModal(true)}
          />
        </View>
      </View>
      <PinModal
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        onSuccess={() => setIsVisible(false)}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <BalanceCard
          balance={Number(wallet?.balance)}
          accountNumber={wallet?.accountNumber || ""}
          currency={"USD"}
          onRefresh={handleRefresh}
        />

        <QuickActions />

        <RecentTransactions
          transactions={transactions}
          onTransactionPress={handleTransactionPress}
          onViewAll={() => router.push("/history")}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <TransactionDetailsModal
        visible={showDetailsModal}
        transaction={selectedTransaction}
        onDismiss={() => setShowDetailsModal(false)}
      />
      <WalletQRModal
        visible={showQRModal}
        onDismiss={() => setShowQRModal(false)}
        walletData={wallet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
