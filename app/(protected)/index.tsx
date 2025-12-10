import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { theme } from "@/constants/theme";
import { transactionService } from "@/services/transaction-service";
import { walletService } from "@/services/wallet-service";
import { useAuthStore } from "@/store/auth-store";
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
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const { wallet, setWallet } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleRefresh = async () => {
    setRefreshing(true);
    let data = await walletService.getWallet();
    setWallet(data);

    setRefreshing(false);
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

        console.log(data);

        setTransactions(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to get transactions history:", error);
      }
    }

    getTransactions();
  }, []);

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
            onPress={() => console.log("Scan QR")}
          />
        </View>
      </View>

      {/* Scrollable Content */}
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
        {/* Balance Card */}
        <BalanceCard
          balance={Number(wallet?.balance)}
          accountNumber={wallet?.accountNumber || ""}
          currency={"USD"}
          onRefresh={handleRefresh}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={transactions}
          onTransactionPress={(transaction) => console.log("Transaction")}
          onViewAll={() => router.push("/history")}
        />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
