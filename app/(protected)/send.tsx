import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RecipientSearch } from "../../components/send/RecipientSearch";
import { theme } from "../../constants/theme";
import type { Recipient } from "../../types/transaction.types";

// Mock wallet data - will be replaced with actual wallet store later
const MOCK_WALLET = {
  balance: 12847.5,
  currency: "USD",
};

export default function SendMoneyScreen() {
  const router = useRouter();
  const [recipient, setRecipient] = useState<Recipient | undefined>();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [walletBalance] = useState(MOCK_WALLET.balance);

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
            <RecipientSearch
              onSelectRecipient={setRecipient}
              selectedRecipient={recipient}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
});
