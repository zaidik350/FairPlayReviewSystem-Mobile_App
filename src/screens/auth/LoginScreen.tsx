import { Link, useRouter } from "expo-router";
import { Lock, Mail, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { colors } from "../../theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // later: auth logic
    router.push("/settings");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F14" }}>
      <View className="flex-1 px-6 justify-center">

        {/* Ambient Background Orbs */}
        <View className="absolute -top-20 right-0 h-44 w-44 rounded-full bg-[#4F7CFF] opacity-15" />
        <View className="absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-[#2ED3C6] opacity-10" />

        {/* Header */}
        <View className="mb-10 items-center">
          <View className="flex-row items-center">
            <View
              className="h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "rgba(79,124,255,0.15)",
                borderWidth: 1,
                borderColor: "rgba(79,124,255,0.35)",
              }}
            >
              <Sparkles
                color={colors.primary}
                size={18}
                strokeWidth={1.8}
              />
            </View>
            <Text
              className="ml-3 text-xs tracking-[3px]"
              style={{ color: colors.textMuted }}
            >
              DRS CONSOLE
            </Text>
          </View>

          <Text
            className="mt-6 text-3xl text-center"
            style={{
              color: colors.text,
              fontWeight: "600",
            }}
          >
            FairPlay Review System
          </Text>

          <Text
            className="mt-2 text-center"
            style={{
              color: colors.textMuted,
              fontSize: 15,
            }}
          >
            Precision officiating intelligence
          </Text>
        </View>

        {/* Login Card */}
        <Card className="w-full mb-6" glass intensity={55}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="umpire@fairplay.app"
            icon={({ color, size }) => (
              <Mail color={color} size={size} strokeWidth={1.8} />
            )}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            icon={({ color, size }) => (
              <Lock color={color} size={size} strokeWidth={1.8} />
            )}
          />

          <Button
            title="Enter Review Room"
            onPress={handleLogin}
            containerClassName="mt-4"
          />
        </Card>

        {/* Footer */}
        <View className="flex-row justify-center items-center">
          <Text
            className="text-sm"
            style={{ color: colors.textMuted }}
          >
            Don’t have access?
          </Text>

          <Link href="/signup" asChild>
            <Text
              className="ml-1 text-sm"
              style={{
                color: colors.primary,
                fontWeight: "500",
              }}
            >
              Request account
            </Text>
          </Link>
        </View>

      </View>
    </SafeAreaView>
  );
}
