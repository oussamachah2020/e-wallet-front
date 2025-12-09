import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

interface SupportItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function SupportScreen() {
  const { user } = useAuthStore();
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const supportOptions: SupportItem[] = [
    {
      id: "chat",
      title: "Live Chat",
      subtitle: "Chat with our support team",
      icon: "message-text",
      action: () => toast.info("Live chat coming soon!"),
    },
    {
      id: "email",
      title: "Email Us",
      subtitle: "support@ewallet.com",
      icon: "email",
      action: () => setShowContactModal(true),
    },
    {
      id: "phone",
      title: "Call Us",
      subtitle: "+1 (800) 123-4567",
      icon: "phone",
      action: () => Linking.openURL("tel:+18001234567"),
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      subtitle: "Message us on WhatsApp",
      icon: "whatsapp",
      action: () => Linking.openURL("https://wa.me/18001234567"),
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "How do I send money?",
      answer:
        "To send money, go to the Home screen, tap on 'Send', select a recipient, enter the amount, and confirm the transaction.",
    },
    {
      id: "2",
      question: "What are the transaction limits?",
      answer:
        "Daily limit: $5,000\nPer transaction: $2,500\nMonthly limit: $50,000\n\nYou can request higher limits by contacting support.",
    },
    {
      id: "3",
      question: "How long do transfers take?",
      answer:
        "Instant transfers: Less than 1 minute\nStandard transfers: 1-3 business days\nInternational: 3-5 business days",
    },
    {
      id: "4",
      question: "Are there any fees?",
      answer:
        "Sending money to other E-Wallet users is FREE.\nBank transfers: $0.99\nInternational: 2.9% + $0.30",
    },
    {
      id: "5",
      question: "How do I add money to my wallet?",
      answer:
        "You can add money using:\n• Bank transfer\n• Debit card\n• Credit card\n• Direct deposit",
    },
    {
      id: "6",
      question: "Is my money safe?",
      answer:
        "Yes! We use bank-level encryption, two-factor authentication, and your funds are FDIC insured up to $250,000.",
    },
    {
      id: "7",
      question: "How do I report a problem?",
      answer:
        "Go to Settings → Help & Support → Email Us or use the 'Report Issue' button at the bottom of this screen.",
    },
    {
      id: "8",
      question: "Can I cancel a transaction?",
      answer:
        "Once a transaction is completed, it cannot be cancelled. However, you can request a refund from the recipient or contact support for assistance.",
    },
  ];

  const handleSendMessage = () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setShowContactModal(false);
    setSubject("");
    setMessage("");
    toast.success("Your message has been sent. We'll respond within 24 hours.");
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.optionsGrid}>
            {supportOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={option.action}
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionCardPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: theme.colors.primary + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={32}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleFAQ(item.id)}
                style={styles.faqItem}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <MaterialCommunityIcons
                    name={
                      expandedFAQ === item.id ? "chevron-up" : "chevron-down"
                    }
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
                {expandedFAQ === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.linksContainer}>
            <Pressable
              style={styles.linkItem}
              onPress={() => toast.info("Coming soon!")}
            >
              <MaterialCommunityIcons
                name="book-open-variant"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.linkText}>User Guide</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Pressable>

            <Pressable
              style={styles.linkItem}
              onPress={() => toast.info("Coming soon!")}
            >
              <MaterialCommunityIcons
                name="video"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.linkText}>Video Tutorials</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Pressable>

            <Pressable
              style={styles.linkItem}
              onPress={() => toast.info("Coming soon!")}
            >
              <MaterialCommunityIcons
                name="forum"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.linkText}>Community Forum</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Report Issue Button */}
        <View style={styles.reportContainer}>
          <Button
            mode="outlined"
            icon="alert-circle"
            onPress={() => setShowContactModal(true)}
            style={styles.reportButton}
          >
            Report an Issue
          </Button>
        </View>
      </ScrollView>

      {/* Contact Modal */}
      <Portal>
        <Modal
          visible={showContactModal}
          onDismiss={() => setShowContactModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name="email"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={styles.modalTitle}>Contact Support</Text>
            <Text style={styles.modalSubtitle}>
              We'll get back to you within 24 hours
            </Text>

            <TextInput
              mode="outlined"
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowContactModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSendMessage}
                style={styles.modalButton}
              >
                Send Message
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
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  optionCard: {
    width: "47%",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    ...theme.shadows.small,
  },
  optionCardPressed: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  optionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  faqContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  faqItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    lineHeight: 22,
  },
  linksContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  reportContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  reportButton: {
    width: "100%",
  },
  modal: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    maxHeight: "80%",
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
    marginBottom: theme.spacing.md,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
    marginTop: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
