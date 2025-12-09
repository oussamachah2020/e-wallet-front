import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom Drawer Content
function CustomDrawerContent(props: any) {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <SafeAreaView edges={["top"]}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Avatar.Text
            size={64}
            label={getInitials(user?.fullName || "User")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.fullName || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Drawer Items */}
        <DrawerItemList {...props} />

        <Divider style={styles.divider} />

        {/* Additional Menu Items */}
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          )}
          onPress={() => router.push("/(protected)/settings")}
          labelStyle={styles.drawerLabel}
        />

        <DrawerItem
          label="Help & Support"
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="help-circle"
              size={size}
              color={color}
            />
          )}
          onPress={() => router.push("/(protected)/support")}
          labelStyle={styles.drawerLabel}
        />

        <Divider style={styles.divider} />

        {/* Sign Out */}
        <DrawerItem
          label="Sign Out"
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="logout"
              size={size}
              color={theme.colors.error}
            />
          )}
          onPress={handleSignOut}
          labelStyle={[styles.drawerLabel, { color: theme.colors.error }]}
        />

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function ProtectedLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: theme.colors.primary + "15",
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
        },
        drawerStyle: {
          backgroundColor: theme.colors.card,
          width: 280,
        },
      }}
    >
      {/* Main Tab Navigator - Shows as "Home" in drawer */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="send"
        options={{
          drawerLabel: "All Transactions",
          headerShown: true,
          title: "Transactions",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="receipt-text"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="send"
        options={{
          drawerLabel: "Recipients",
          headerShown: true,
          title: "My Recipients",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
              color={color}
            />
          ),
        }}
      /> */}

      <Drawer.Screen
        name="analytics"
        options={{
          drawerLabel: "Analytics",
          headerShown: true,
          title: "Spending Analytics",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden screens (not in drawer) */}
      <Drawer.Screen
        name="new-recipient"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Send Money",
        }}
      />

      <Drawer.Screen
        name="transfer"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Transfer",
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Settings",
        }}
      />

      <Drawer.Screen
        name="support"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Help & Support",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: theme.colors.primary + "10",
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  divider: {
    marginVertical: 8,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: "auto",
  },
  version: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
