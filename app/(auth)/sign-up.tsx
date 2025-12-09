import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
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

import { theme } from "@/constants/theme";
// import { toast } from "sonner-native";
import { toast } from "sonner-native";
import { Input } from "../../components/ui/input";
import { SignUpFormData, signUpSchema } from "../../schemas/authSchemas";
import { useAuthStore } from "../../store/auth-store";

export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);

  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    toast.loading("Creating your account...", { id: "signup" });
    try {
      await signUp(data);
      toast.success("Account created successfully ! You can now sign in.");
      setTimeout(() => {
        router.replace("/(auth)/sign-in");
      }, 1000);
    } catch (err) {
      toast.error(error as string);
    } finally {
      toast.dismiss("signup");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyLarge">Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <Input
              control={control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              leftIcon="account"
            />

            <Input
              control={control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              leftIcon="email"
            />

            <Input
              control={control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              // secureTextEntry
              leftIcon="lock"
            />

            <Input
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              // secureTextEntry
              leftIcon="lock-check"
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Sign Up
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium">Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Text variant="bodyMedium" style={styles.link}>
                  Sign In
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.colors.primary,
  },

  form: {
    width: "100%",
    gap: 3,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
