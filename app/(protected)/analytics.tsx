import { theme } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SegmentedButtons, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

interface CategorySpending {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
  icon: string;
}

interface SpendingTrend {
  month: string;
  amount: number;
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState("month");

  // Mock data - Replace with actual API data
  const totalSpent = 3847.52;
  const totalEarned = 5200.0;
  const netSavings = totalEarned - totalSpent;
  const savingsRate = ((netSavings / totalEarned) * 100).toFixed(1);

  const categorySpending: CategorySpending[] = [
    {
      name: "Food",
      amount: 1247.5,
      color: "#FF6384",
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
      icon: "food",
    },
    {
      name: "Shopping",
      amount: 890.3,
      color: "#36A2EB",
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
      icon: "shopping",
    },
    {
      name: "Transport",
      amount: 543.2,
      color: "#FFCE56",
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
      icon: "car",
    },
    {
      name: "Entertainment",
      amount: 456.8,
      color: "#4BC0C0",
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
      icon: "movie",
    },
    {
      name: "Bills",
      amount: 709.72,
      color: "#9966FF",
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
      icon: "receipt",
    },
  ];

  const spendingTrend: SpendingTrend[] = [
    { month: "Jul", amount: 3200 },
    { month: "Aug", amount: 3650 },
    { month: "Sep", amount: 3100 },
    { month: "Oct", amount: 4200 },
    { month: "Nov", amount: 3900 },
    { month: "Dec", amount: 3847 },
  ];

  const monthlyComparison = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [850, 920, 1100, 977],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "0",
      stroke: theme.colors.primary,
      fill: theme.colors.primary,
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <SegmentedButtons
            value={period}
            onValueChange={setPeriod}
            buttons={[
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            {/* Spent Card */}
            <View style={[styles.summaryCard, styles.spentCard]}>
              <View style={styles.summaryIconContainer}>
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={styles.summaryAmount}>${totalSpent.toFixed(2)}</Text>
            </View>

            {/* Earned Card */}
            <View style={[styles.summaryCard, styles.earnedCard]}>
              <View style={styles.summaryIconContainer}>
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.summaryLabel}>Earned</Text>
              <Text style={styles.summaryAmount}>
                ${totalEarned.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Savings Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsContent}>
              <View>
                <Text style={styles.savingsLabel}>Net Savings</Text>
                <Text style={styles.savingsAmount}>
                  ${netSavings.toFixed(2)}
                </Text>
              </View>
              <View style={styles.savingsRateBadge}>
                <Text style={styles.savingsRateText}>{savingsRate}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>

          <View style={styles.chartContainer}>
            <PieChart
              data={categorySpending}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          {/* Category Breakdown */}
          <View style={styles.breakdownContainer}>
            {categorySpending.map((category, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.categoryItem,
                  pressed && styles.categoryItemPressed,
                ]}
                onPress={() => console.log("Category:", category.name)}
              >
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={22}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryPercentage}>
                      {((category.amount / totalSpent) * 100).toFixed(1)}% of
                      total
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>
                  ${category.amount.toFixed(2)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Spending Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: spendingTrend.map((item) => item.month),
                datasets: [
                  {
                    data: spendingTrend.map((item) => item.amount),
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero
              style={styles.chart}
            />
          </View>
        </View>

        {/* Weekly Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month by Week</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={monthlyComparison}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              yAxisLabel="$"
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>

          {/* Spending Pattern */}
          <View style={[styles.insightCard, styles.primaryInsight]}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={28}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Spending Pattern</Text>
              <Text style={styles.insightText}>
                Your spending increased by 15% compared to last month. Food and
                Shopping are your top categories.
              </Text>
            </View>
          </View>

          {/* Savings Goal */}
          <View style={[styles.insightCard, styles.successInsight]}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons
                name="trending-up"
                size={28}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Savings Goal</Text>
              <Text style={styles.insightText}>
                Great job! You're saving {savingsRate}% of your income. Keep it
                up to reach your $10,000 goal by year end.
              </Text>
            </View>
          </View>

          {/* Budget Alert */}
          <View style={[styles.insightCard, styles.warningInsight]}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={28}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Budget Alert</Text>
              <Text style={styles.insightText}>
                You've spent 80% of your monthly budget for Food. Consider
                reducing dining out expenses.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  periodSelector: {
    padding: theme.spacing.md,
    backgroundColor: "#FFFFFF",
  },
  segmentedButtons: {
    backgroundColor: "#F8F9FA",
  },
  summaryContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  spentCard: {
    backgroundColor: "#EF5350",
  },
  earnedCard: {
    backgroundColor: "#66BB6A",
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  savingsCard: {
    backgroundColor: "#42A5F5",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  savingsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    fontWeight: "500",
  },
  savingsAmount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  savingsRateBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 100,
  },
  savingsRateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: theme.spacing.md,
  },
  chart: {
    marginVertical: 0,
  },
  breakdownContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryItemPressed: {
    opacity: 0.6,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  insightCard: {
    flexDirection: "row",
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "flex-start",
  },
  primaryInsight: {
    backgroundColor: theme.colors.primary,
  },
  successInsight: {
    backgroundColor: "#66BB6A",
  },
  warningInsight: {
    backgroundColor: "#FFA726",
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 19,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
