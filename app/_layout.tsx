import Colors from "@/constants/colors";
import { AppProvider } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "signup";

    if (!isLoggedIn && !inAuthGroup) {
      // Not logged in and not on auth screen → redirect to login
      router.replace("/login");
    } else if (isLoggedIn && inAuthGroup) {
      // Logged in but on auth screen → redirect to home
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, isLoading, segments]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ paddingVertical: 4, paddingRight: 8 }}
            >
              <Text style={{ color: Colors.primary, fontSize: 30, fontWeight: "700", lineHeight: 28 }}>{" <"}</Text>
            </TouchableOpacity>
          ) : undefined,
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="live-match" options={{ headerShown: false }} />
      <Stack.Screen name="create-match" options={{ presentation: "modal" }} />
      <Stack.Screen name="match-details" options={{ title: "Match Details" }} />
      <Stack.Screen name="review-analysis" options={{ title: "DRS Review" }} />
      <Stack.Screen name="review-detail" options={{ title: "Review Details" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="change-password" options={{ title: "Change Password" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
