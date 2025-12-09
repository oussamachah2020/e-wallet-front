import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: "toggle" | "navigate" | "action";
  value?: boolean;
  onPress?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Settings State
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pin, setPin] = useState("");

  const handleChangePin = () => {
    setShowPinModal(true);
  };

  const handleSavePin = () => {
    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    setShowPinModal(false);
    setPin("");
    toast.success("PIN updated successfully");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: Implement account deletion
    toast.success("Account deletion request submitted");
    router.replace("/(auth)/sign-in");
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          id: "personal-info",
          title: "Personal Information",
          subtitle: user?.email,
          icon: "account-edit",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
        {
          id: "change-password",
          title: "Change Password",
          icon: "lock-reset",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
        {
          id: "change-pin",
          title: "Change PIN",
          subtitle: "Update your transaction PIN",
          icon: "dialpad",
          type: "action" as const,
          onPress: handleChangePin,
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          id: "biometric",
          title: "Biometric Authentication",
          subtitle: "Use fingerprint or face ID",
          icon: "fingerprint",
          type: "toggle" as const,
          value: biometric,
          onPress: () => setBiometric(!biometric),
        },
        {
          id: "two-factor",
          title: "Two-Factor Authentication",
          subtitle: "Add extra security layer",
          icon: "shield-check",
          type: "toggle" as const,
          value: twoFactor,
          onPress: () => setTwoFactor(!twoFactor),
        },
        {
          id: "devices",
          title: "Manage Devices",
          subtitle: "See where you're logged in",
          icon: "devices",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Push Notifications",
          subtitle: "Receive transaction alerts",
          icon: "bell",
          type: "toggle" as const,
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
        {
          id: "dark-mode",
          title: "Dark Mode",
          subtitle: "Use dark theme",
          icon: "theme-light-dark",
          type: "toggle" as const,
          value: darkMode,
          onPress: () => setDarkMode(!darkMode),
        },
        {
          id: "language",
          title: "Language",
          subtitle: "English",
          icon: "translate",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
        {
          id: "currency",
          title: "Currency",
          subtitle: "USD ($)",
          icon: "currency-usd",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          id: "privacy-policy",
          title: "Privacy Policy",
          icon: "shield-account",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
        {
          id: "terms",
          title: "Terms of Service",
          icon: "file-document",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
        {
          id: "data",
          title: "Download My Data",
          subtitle: "Export your account data",
          icon: "download",
          type: "navigate" as const,
          onPress: () => toast.info("Coming soon!"),
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          id: "delete-account",
          title: "Delete Account",
          subtitle: "Permanently delete your account",
          icon: "delete-forever",
          type: "action" as const,
          onPress: handleDeleteAccount,
          danger: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Pressable
        key={item.id}
        onPress={item.onPress}
        style={({ pressed }) => [
          styles.settingItem,
          pressed && styles.settingItemPressed,
        ]}
      >
        <View style={styles.settingItemLeft}>
          <MaterialCommunityIcons
            name={item.icon as any}
            size={24}
            color={item.danger ? theme.colors.error : theme.colors.primary}
          />
          <View style={styles.settingItemText}>
            <Text
              style={[
                styles.settingTitle,
                item.danger && { color: theme.colors.error },
              ]}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>

        {item.type === "toggle" ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            color={theme.colors.primary}
          />
        ) : (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.textSecondary}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {settingsSections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>E-Wallet</Text>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Change PIN Modal */}
      <Portal>
        <Modal
          visible={showPinModal}
          onDismiss={() => setShowPinModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name="dialpad"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={styles.modalTitle}>Change PIN</Text>
            <Text style={styles.modalSubtitle}>Enter your new 4-digit PIN</Text>

            <TextInput
              mode="outlined"
              label="New PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowPinModal(false);
                  setPin("");
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSavePin}
                style={styles.modalButton}
              >
                Save PIN
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Delete Account Modal */}
      <Portal>
        <Modal
          visible={showDeleteModal}
          onDismiss={() => setShowDeleteModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={64}
              color={theme.colors.error}
            />
            <Text style={styles.modalTitle}>Delete Account?</Text>
            <Text style={styles.modalSubtitle}>
              This action cannot be undone. All your data will be permanently
              deleted.
            </Text>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmDeleteAccount}
                style={[styles.modalButton, styles.dangerButton]}
                buttonColor={theme.colors.error}
              >
                Delete
              </Button>
            </View>
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
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  settingItemPressed: {
    backgroundColor: theme.colors.background,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.md,
  },
  settingItemText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  appInfo: {
    padding: theme.spacing.xl,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  appInfoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  input: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
  },
  modalButton: {
    flex: 1,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },
});
