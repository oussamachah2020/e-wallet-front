import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Chip,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { transactionService } from "@/services/transaction-service";
import { TransactionItem } from "../../components/dashboard/TransactionItem";
import { theme } from "../../constants/theme";
import type { Transaction } from "../../types/wallet.types";

type TransactionType = "all" | "credit" | "debit" | "transfer";
type TransactionStatus = "all" | "completed" | "pending" | "failed";
type SortBy = "date" | "amount";
type SortOrder = "asc" | "desc";

export default function AllTransactionsScreen() {
  const navigation = useNavigation();

  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Date Range
  const [dateRange, setDateRange] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    transactions,
    searchQuery,
    typeFilter,
    statusFilter,
    sortBy,
    sortOrder,
    dateRange,
  ]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const data = await transactionService.getTransactionsHistory();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt);

        switch (dateRange) {
          case "today":
            return transactionDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "amount") {
        const amountA =
          typeof a.amount === "string" ? parseFloat(a.amount) : a.amount;
        const amountB =
          typeof b.amount === "string" ? parseFloat(b.amount) : b.amount;
        comparison = amountA - amountB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateRange("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (typeFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (dateRange !== "all") count++;
    if (searchQuery) count++;
    return count;
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search transactions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={theme.colors.primary}
      />

      {/* Quick Filters */}
      <View style={styles.quickFilters}>
        <Pressable
          style={[
            styles.filterButton,
            getActiveFiltersCount() > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(true)}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={20}
            color={
              getActiveFiltersCount() > 0
                ? theme.colors.primary
                : theme.colors.text
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              getActiveFiltersCount() > 0 && styles.filterButtonTextActive,
            ]}
          >
            Filters
            {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
          </Text>
        </Pressable>

        <Pressable
          style={styles.sortButton}
          onPress={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <MaterialCommunityIcons
            name={sortOrder === "asc" ? "sort-ascending" : "sort-descending"}
            size={20}
            color={theme.colors.text}
          />
        </Pressable>
      </View>

      {/* Active Filters Chips */}
      {getActiveFiltersCount() > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersLabel}>Active filters:</Text>
          <View style={styles.chipsContainer}>
            {typeFilter !== "all" && (
              <Chip
                mode="flat"
                onClose={() => setTypeFilter("all")}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {typeFilter}
              </Chip>
            )}
            {statusFilter !== "all" && (
              <Chip
                mode="flat"
                onClose={() => setStatusFilter("all")}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {statusFilter}
              </Chip>
            )}
            {dateRange !== "all" && (
              <Chip
                mode="flat"
                onClose={() => setDateRange("all")}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {dateRange}
              </Chip>
            )}
            {searchQuery && (
              <Chip
                mode="flat"
                onClose={() => setSearchQuery("")}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                "{searchQuery}"
              </Chip>
            )}
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredTransactions.length} transaction
        {filteredTransactions.length !== 1 ? "s" : ""} found
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="receipt-text-outline"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyStateTitle}>No transactions found</Text>
      <Text style={styles.emptyStateText}>
        {getActiveFiltersCount() > 0
          ? "Try adjusting your filters"
          : "Your transactions will appear here"}
      </Text>
      {getActiveFiltersCount() > 0 && (
        <Button
          mode="outlined"
          onPress={clearFilters}
          style={styles.clearButton}
        >
          Clear Filters
        </Button>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <MaterialCommunityIcons
            name="menu"
            size={28}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => console.log("Transaction:", item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={
          filteredTransactions.length === 0 && styles.emptyListContent
        }
      />

      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modal}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Transactions</Text>
            <Pressable
              onPress={() => setShowFilters(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Transaction Type</Text>
              <View style={styles.buttonGroup}>
                {[
                  { value: "all", label: "All" },
                  { value: "credit", label: "Credit" },
                  { value: "debit", label: "Debit" },
                  { value: "transfer", label: "Transfer" },
                ].map((button) => (
                  <Pressable
                    key={button.value}
                    style={[
                      styles.filterButton,
                      typeFilter === button.value && styles.filterButtonActive,
                    ]}
                    onPress={() =>
                      setTypeFilter(button.value as TransactionType)
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        typeFilter === button.value &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      {button.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.buttonGroup}>
                {[
                  { value: "all", label: "All" },
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                ].map((button) => (
                  <Pressable
                    key={button.value}
                    style={[
                      styles.filterButton,
                      statusFilter === button.value &&
                        styles.filterButtonActive,
                    ]}
                    onPress={() =>
                      setStatusFilter(button.value as TransactionStatus)
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        statusFilter === button.value &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      {button.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <View style={styles.buttonGroup}>
                {[
                  { value: "all", label: "All" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                ].map((button) => (
                  <Pressable
                    key={button.value}
                    style={[
                      styles.filterButton,
                      dateRange === button.value && styles.filterButtonActive,
                    ]}
                    onPress={() => setDateRange(button.value as any)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateRange === button.value &&
                          styles.filterButtonTextActive,
                      ]}
                    >
                      {button.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortContainer}>
                <View style={styles.sortButtonGroup}>
                  {[
                    { value: "date", label: "Date", icon: "calendar" },
                    { value: "amount", label: "Amount", icon: "currency-usd" },
                  ].map((button) => (
                    <Pressable
                      key={button.value}
                      style={[
                        styles.sortButton,
                        sortBy === button.value && styles.sortButtonActive,
                      ]}
                      onPress={() => setSortBy(button.value as SortBy)}
                    >
                      <MaterialCommunityIcons
                        name={button.icon as any}
                        size={18}
                        color={
                          sortBy === button.value
                            ? "#FFFFFF"
                            : theme.colors.text
                        }
                      />
                      <Text
                        style={[
                          styles.sortButtonText,
                          sortBy === button.value &&
                            styles.sortButtonTextActive,
                        ]}
                      >
                        {button.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  style={[
                    styles.sortOrderButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  <MaterialCommunityIcons
                    name={
                      sortOrder === "asc" ? "sort-ascending" : "sort-descending"
                    }
                    size={24}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <Pressable style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
            <Pressable
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerRight: {
    width: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    backgroundColor: theme.colors.card,
    paddingBottom: theme.spacing.md,
  },
  searchbar: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  quickFilters: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  activeFiltersContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  activeFiltersLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    alignItems: "center",
  },
  chip: {
    backgroundColor: theme.colors.primary + "15",
    height: 28,
  },
  chipText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  clearAllText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  resultsCount: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },

  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
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
  modalContent: {
    padding: theme.spacing.lg,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    minWidth: 80,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  sortContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  sortButtonGroup: {
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  sortButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  sortButtonTextActive: {
    color: "#FFFFFF",
  },
  sortOrderButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
