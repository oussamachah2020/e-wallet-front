import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { theme } from "../../constants/theme";
// import { transactionService } from "../../services/transaction-service";
import { recipientService } from "@/services/recipient-service";
import { useTransactionStore } from "@/store/transaction-store";
import type { Recipient } from "../../types/transaction.types";

interface RecipientSearchProps {
  onSelectRecipient: (recipient: Recipient) => void;
  selectedRecipient?: Recipient;
}

export function RecipientSearch({ selectedRecipient }: RecipientSearchProps) {
  const [query, setQuery] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recentRecipients, setRecentRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingRecipient, setAddingRecipient] = useState(false);
  const { setRecipientId } = useTransactionStore();

  useEffect(() => {
    loadRecentRecipients();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      searchRecipients();
    } else {
      setRecipients([]);
      setShowResults(false);
    }
  }, [query]);

  const loadRecentRecipients = async () => {
    const recent = await recipientService.getRecipients();
    setRecentRecipients(recent);
  };

  const searchRecipients = async () => {
    setLoading(true);
    setShowResults(true);
    // const results = await transactionService.searchRecipients(query);
    // setRecipients(results);
    setLoading(false);
  };

  const handleSelectRecipient = (recipient: Recipient) => {
    setRecipientId(recipient.id);
    setQuery("");
    setShowResults(false);
    router.push("/(protected)/transfer");
  };

  const handleAddNewRecipient = async (data: any) => {
    setAddingRecipient(true);
    try {
      // const newRecipient = await transactionService.addRecipient(data);
      setShowAddForm(false);
      // handleSelectRecipient(newRecipient);
      // Refresh recent recipients
      await loadRecentRecipients();
    } catch (error) {
      console.error("Failed to add recipient:", error);
    } finally {
      setAddingRecipient(false);
    }
  };

  const getInitials = (name: string = "John Doe") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderRecipientItem = ({ item }: { item: Recipient }) => (
    <Pressable
      style={({ pressed }) => [
        styles.recipientItem,
        pressed && styles.recipientItemPressed,
      ]}
      onPress={() => handleSelectRecipient(item)}
    >
      <Avatar.Text
        size={48}
        label={getInitials(item.fullName)}
        style={styles.avatar}
      />
      <View style={styles.recipientInfo}>
        <Text style={styles.recipientName}>{item.fullName || "John Doe"}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.textSecondary}
      />
    </Pressable>
  );

  if (selectedRecipient) {
    return (
      <View style={styles.selectedContainer}>
        <View style={styles.selectedHeader}>
          <Text style={styles.label}>Sending to:</Text>
          <Pressable onPress={() => setRecipientId(null)}>
            <Text style={styles.changeButton}>Change</Text>
          </Pressable>
        </View>
        <View style={styles.selectedRecipient}>
          <Avatar.Text
            size={56}
            label={getInitials(selectedRecipient.fullName)}
            style={styles.avatar}
          />
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedName}>
              {selectedRecipient.fullName || "Jogn Doe"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recipient</Text>

      <TextInput
        mode="outlined"
        placeholder="Search by email, phone or name"
        value={query}
        onChangeText={setQuery}
        left={<TextInput.Icon icon="magnify" />}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {showResults && recipients.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={recipients}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipientItem}
            scrollEnabled={false}
          />
        </View>
      )}

      {showResults &&
        !loading &&
        recipients.length === 0 &&
        query.length >= 2 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="account-search"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyText}>No users found</Text>
            <Button
              mode="contained"
              onPress={() => router.push("/(protected)/new-recipient")}
              style={styles.addButton}
              icon="account-plus"
            >
              Add New Recipient
            </Button>
          </View>
        )}

      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Recipients</Text>
          <Pressable onPress={() => router.push("/(protected)/new-recipient")}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
        {!showResults && recentRecipients.length > 0 && (
          <FlatList
            data={recentRecipients}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipientItem}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  resultsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recipientItemPressed: {
    backgroundColor: theme.colors.background,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  recipientInfo: {
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
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
  recentContainer: {
    marginTop: theme.spacing.md,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  selectedContainer: {
    marginBottom: theme.spacing.lg,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  selectedRecipient: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  selectedEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
