import { theme } from "@/constants/theme";
import { walletService } from "@/services/wallet-service";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import { toast } from "sonner-native";

interface PinModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  subtitle?: string;
  mode?: "create" | "verify";
}

export const PinModal: React.FC<PinModalProps> = ({
  visible,
  onDismiss,
  onSuccess,
  title = "Create PIN",
  subtitle = "Enter a 4-digit PIN to secure your transactions",
  mode = "create",
}) => {
  const [pin, setPin] = React.useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = React.useState(["", "", "", ""]);
  const [step, setStep] = React.useState<"enter" | "confirm">("enter");
  const [loading, setLoading] = React.useState(false);

  const inputRefs = React.useRef<(TextInput | null)[]>([]);
  const confirmInputRefs = React.useRef<(TextInput | null)[]>([]);

  // Reset state when modal is opened/closed
  React.useEffect(() => {
    if (visible) {
      resetState();
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  const resetState = () => {
    setPin(["", "", "", ""]);
    setConfirmPin(["", "", "", ""]);
    setStep("enter");
    setLoading(false);
  };

  const handlePinChange = (
    value: string,
    index: number,
    isConfirm: boolean,
  ) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    // Auto-focus next input
    if (value && index < 3) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 3 && value) {
      if (isConfirm) {
        handleConfirmComplete(newPin);
      } else if (mode === "verify") {
        handleVerifyComplete(newPin);
      } else {
        handleEnterComplete(newPin);
      }
    }
  };

  const handleKeyPress = (e: any, index: number, isConfirm: boolean) => {
    if (e.nativeEvent.key === "Backspace") {
      const newPin = isConfirm ? [...confirmPin] : [...pin];

      if (newPin[index] === "" && index > 0) {
        // Move to previous input if current is empty
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        refs.current[index - 1]?.focus();
      } else {
        // Clear current input
        newPin[index] = "";
        if (isConfirm) {
          setConfirmPin(newPin);
        } else {
          setPin(newPin);
        }
      }
    }
  };

  const handleEnterComplete = (enteredPin: string[]) => {
    if (mode === "create") {
      // Move to confirmation step
      Keyboard.dismiss();
      setTimeout(() => {
        setStep("confirm");
        setTimeout(() => {
          confirmInputRefs.current[0]?.focus();
        }, 300);
      }, 100);
    }
  };

  const handleVerifyComplete = async (enteredPin: string[]) => {
    const pinString = enteredPin.join("");
    setLoading(true);

    try {
      onSuccess(pinString);
    } catch (error) {
      toast.error("Invalid PIN. Please try again.");
      console.log("❌ PIN verification failed, resetting inputs");

      setPin(["", "", "", ""]);
      setLoading(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  };

  const handleConfirmComplete = async (confirmedPin: string[]) => {
    const pinString = pin.join("");
    const confirmPinString = confirmedPin.join("");

    if (pinString === confirmPinString) {
      setLoading(true);
      try {
        await walletService.setWalletPin({
          pin: pinString,
          confirmPin: confirmPinString,
        });
        toast.success("PIN created successfully");
        onDismiss();
      } catch (error) {
        toast.error("Failed to create PIN. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      confirmInputRefs.current[0]?.focus();
    }
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("enter");
      setConfirmPin(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleCancel = () => {
    resetState();
    onDismiss();
  };

  const isPinComplete = (currentPin: string[]) => {
    return currentPin.every((digit) => digit !== "");
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        {/* Header */}
        <View style={styles.header}>
          {step === "confirm" && mode === "create" && (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          )}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {step === "enter" ? title : "Confirm PIN"}
        </Text>
        <Text style={styles.subtitle}>
          {step === "enter" ? subtitle : "Re-enter your PIN to confirm"}
        </Text>

        {/* PIN Input */}
        <View style={styles.pinContainer}>
          {(step === "enter" ? pin : confirmPin).map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (step === "enter") {
                  inputRefs.current[index] = ref;
                } else {
                  confirmInputRefs.current[index] = ref;
                }
              }}
              style={[styles.pinInput, digit && styles.pinInputFilled]}
              value={digit}
              onChangeText={(value) =>
                handlePinChange(value, index, step === "confirm")
              }
              onKeyPress={(e) => handleKeyPress(e, index, step === "confirm")}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        {/* Progress Indicator */}
        {mode === "create" && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressDot,
                step === "enter" && styles.progressDotActive,
              ]}
            />
            <View style={styles.progressLine} />
            <View
              style={[
                styles.progressDot,
                step === "confirm" && styles.progressDotActive,
              ]}
            />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleCancel}
            style={styles.cancelButton}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          {step === "enter" && mode === "create" && (
            <Pressable
              onPress={() => handleEnterComplete(pin)}
              style={[
                styles.continueButton,
                !isPinComplete(pin) && styles.continueButtonDisabled,
              ]}
              disabled={!isPinComplete(pin) || loading}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  !isPinComplete(pin) && styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </Pressable>
          )}
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          💡 Use a PIN you can remember but others can't guess
        </Text>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  pinInput: {
    width: 56,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.text,
  },
  pinInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  continueButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  helpText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
