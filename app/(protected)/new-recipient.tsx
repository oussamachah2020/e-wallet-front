import { Input } from "@/components/ui/input";
import { theme } from "@/constants/theme";
import { recipientService } from "@/services/recipient-service";
import { Recipient } from "@/types/transaction.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";

const addRecipientSchema = z.object({
  accountNumber: z
    .string()
    .min(6, "Account number must be at least 6 characters")
    .max(20, "Account number is too long")
    .regex(/^[0-9]+$/, "Account number must contain only digits"),
});

type AddRecipientFormData = z.infer<typeof addRecipientSchema>;

export default function AddRecipientScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [foundRecipient, setFoundRecipient] = useState<Recipient | null>(null);

  const { control, handleSubmit, reset } = useForm<AddRecipientFormData>({
    resolver: zodResolver(addRecipientSchema),
    defaultValues: {
      accountNumber: "",
    },
  });

  const onSearch = async (data: AddRecipientFormData) => {
    setLoading(true);
    setFoundRecipient(null);

    try {
      const results = await recipientService.searchRecipient(
        data.accountNumber
      );

      console.log(results);

      setFoundRecipient(results);
      toast("Recipient found!");
    } catch (error: any) {
      toast.error(
        error.message || "Recipient not found. Please check the account number."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = async () => {
    try {
      if (foundRecipient && foundRecipient.accountNumber) {
        const results = await recipientService.addRecipient(
          foundRecipient?.accountNumber
        );

        console.log(results);
        toast("Recipient found!");
        toast.success(
          `${foundRecipient.fullName || "John Doe"} added successfully!`
        );
        router.back();
      }
    } catch (error: any) {
      toast.error(
        error.message || "Recipient not found. Please check the account number."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setFoundRecipient(null);
    router.back();
  };

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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Recipient</Text>
              <Text style={styles.subtitle}>
                Enter the account number to search for a recipient
              </Text>
            </View>

            {/* Search Form */}
            <View style={styles.form}>
              <Input
                control={control}
                name="accountNumber"
                label="Account Number"
                placeholder="Enter recipient account number"
                keyboardType="numeric"
                leftIcon="account-search"
              />

              <Button
                mode="contained"
                onPress={handleSubmit(onSearch)}
                loading={loading}
                disabled={loading}
                icon="magnify"
                style={styles.searchButton}
                contentStyle={styles.searchButtonContent}
              >
                Search Recipient
              </Button>
            </View>

            {/* Found Recipient Display */}
            {foundRecipient ? (
              <View style={styles.recipientCard}>
                <View style={styles.recipientHeader}>
                  <Text style={styles.recipientLabel}>Recipient Found</Text>
                </View>

                <View style={styles.recipientInfo}>
                  <View style={styles.recipientAvatar}>
                    <Text style={styles.recipientInitials}>
                      {(foundRecipient.fullName || "john doe")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Text>
                  </View>

                  <View style={styles.recipientDetails}>
                    <Text style={styles.recipientName}>
                      {foundRecipient.fullName || "John Doe"}
                    </Text>
                    <Text style={styles.recipientEmail}>
                      Account Number: {foundRecipient.accountNumber}
                    </Text>
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={handleAddRecipient}
                  icon="check"
                  style={styles.addButton}
                >
                  Add & Continue
                </Button>
              </View>
            ) : null}

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                💡 Tip: You can find the account number on the recipient's
                profile or in your transaction history.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
            labelStyle={{
              color: theme.colors.primary,
            }}
          >
            Cancel
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? 45 : 50,
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
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  searchButton: {
    marginTop: theme.spacing.md,
    borderRadius: 100,
  },
  searchButtonContent: {
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
  },
  recipientCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // ...theme.shadows.medium,
  },
  recipientHeader: {
    marginBottom: theme.spacing.md,
  },
  recipientLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.success,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recipientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  recipientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  recipientInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  recipientEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  recipientPhone: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  addButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.secondary,
  },
  helpContainer: {
    backgroundColor: theme.colors.primary + "15",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: "auto",
  },
  helpText: {
    fontSize: 13,
    color: theme.colors.primary,
    lineHeight: 18,
    textAlign: "center",
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
});
