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

import LoginIcon from "@/assets/icons/login-screen-icon.png";
import { theme } from "@/constants/theme";
import { Image } from "expo-image";
import { toast } from "sonner-native";
import { Input } from "../../components/ui/input";
import { SignInFormData, signInSchema } from "../../schemas/authSchemas";
import { useAuthStore } from "../../store/auth-store";

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    toast.loading("Signing you in...", { id: "signin" });
    try {
      await signIn(data);
      router.replace("/(protected)");
    } catch (err) {
      toast.error("Sign In Failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      toast.dismiss("signin");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View>
          <Image style={styles.image} source={LoginIcon} contentFit="cover" />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to continue
            </Text>
          </View>

          <View style={styles.form}>
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
              secureTextEntry
              leftIcon="lock"
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              className="bg-green-400 h-20"
            >
              Sign In
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Text variant="bodyMedium" style={styles.link}>
                  Sign Up
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 1.2, // adjust based on your PNG ratio
    resizeMode: "contain",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
  },
  form: {
    width: "100%",
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
