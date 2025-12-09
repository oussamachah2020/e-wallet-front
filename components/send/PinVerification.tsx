import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import { theme } from "../../constants/theme";

interface PinVerificationProps {
  visible: boolean;
  onDismiss: () => void;
  onVerify: (pin: string) => void;
  loading?: boolean;
  error?: string;
}

export function PinVerification({
  visible,
  onDismiss,
  onVerify,
  loading,
  error,
}: PinVerificationProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (index === 3 && value) {
      const completePin = newPin.join("");
      onVerify(completePin);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClear = () => {
    setPin(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={48}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>Enter PIN</Text>
          <Text style={styles.subtitle}>
            Verify your transaction PIN to continue
          </Text>
        </View>

        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <RNTextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handlePinChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              style={[styles.pinInput, digit && styles.pinInputFilled]}
              editable={!loading}
            />
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={16}
              color={theme.colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
          <Pressable onPress={onDismiss} disabled={loading}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  pinInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.text,
  },
  pinInputFilled: {
    borderColor: theme.colors.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  cancelButton: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    padding: theme.spacing.sm,
  },
});
