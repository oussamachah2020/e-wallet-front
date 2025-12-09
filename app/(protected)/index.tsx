import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { Transaction } from "@/types/wallet.types";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data
const MOCK_WALLET = {
  balance: 12847.5,
  currency: "USD",
  accountNumber: "4532123456789012",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "credit",
    amount: 2500.0,
    description: "Salary Payment",
    category: "Salary",
    date: new Date().toISOString(),
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: 45.99,
    description: "Grocery Shopping",
    category: "Shopping",
    date: new Date(Date.now() - 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "3",
    type: "debit",
    amount: 120.0,
    description: "Restaurant Bill",
    category: "Food",
    date: new Date(Date.now() - 7200000).toISOString(),
    status: "completed",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

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
          balance={MOCK_WALLET.balance}
          accountNumber={MOCK_WALLET.accountNumber}
          currency={MOCK_WALLET.currency}
          onRefresh={handleRefresh}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={MOCK_TRANSACTIONS}
          onTransactionPress={(transaction) =>
            console.log("Transaction:", transaction)
          }
          onViewAll={() => console.log("View all")}
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
