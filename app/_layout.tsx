import { theme } from "@/constants/theme";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { Toaster } from "sonner-native";
import "../global.css";
import { useAuthStore } from "../store/auth-store";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    console.log("📍 Navigation check:", {
      isAuthenticated,
      segments,
    });

    if (!isAuthenticated) {
      // Not authenticated and not in auth group -> redirect to sign-in
      console.log("→ Redirecting to sign-in");
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated) {
      // Authenticated but in auth group -> redirect to main app
      console.log("→ Redirecting to main app");
      router.replace("/(protected)");
    }
  }, [isAuthenticated, isInitialized]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    async function initializeAuth() {
      try {
        console.log("🔐 Checking authentication...");
        await checkAuth();
      } catch (error) {
        console.error("❌ Auth check error:", error);
      } finally {
        console.log("✅ Auth check complete");
        // Hide splash screen after auth check
        SplashScreen.hideAsync();
      }
    }

    initializeAuth();
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <RootLayoutContent />
        <Toaster />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
