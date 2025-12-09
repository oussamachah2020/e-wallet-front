import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Route, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../constants/theme";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  isPrimary?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "1",
    title: "Receive",
    icon: "arrow-bottom-left",
    route: "/(protected)/request",
    isPrimary: false,
  },
  {
    id: "2",
    title: "Send",
    icon: "arrow-top-right",
    route: "/(protected)/send",
    isPrimary: true,
  },
];

export function QuickActions() {
  const router = useRouter();

  const handleActionPress = (route: string) => {
    router.push(route as Route);
  };

  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => handleActionPress(action.route)}
          style={({ pressed }) => [
            styles.actionButton,
            action.isPrimary ? styles.primaryButton : styles.secondaryButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <MaterialCommunityIcons
            name={action.icon as any}
            size={18}
            color={action.isPrimary ? "#FFFFFF" : theme.colors.text}
          />

          <Text
            style={[
              styles.actionText,
              action.isPrimary ? styles.primaryText : styles.secondaryText,
            ]}
          >
            {action.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  primaryButton: {
    backgroundColor: "#000000",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: theme.colors.text,
  },
});
