import { useRouter } from "expo-router";
import { LogOut, ShieldCheck, Signal, User } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SettingsRow } from "../../components/ui/SettingsRow";
import { colors } from "../../theme/colors";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F14" }}>
      <View className="flex-1 px-6 py-8 justify-start relative">

        {/* Ambient Background Orbs */}
        <View className="absolute -top-32 left-0 h-48 w-48 rounded-full bg-[#2ED3C6] opacity-10" />
        <View className="absolute -bottom-32 right-0 h-56 w-56 rounded-full bg-[#4F7CFF] opacity-15" />

        {/* Header */}
        <View className="mb-10">
          <Text
            className="text-3xl text-center"
            style={{ color: colors.text, fontWeight: "600" }}
          >
            Settings
          </Text>
          <Text
            className="mt-2 text-center"
            style={{ color: colors.textMuted, fontSize: 15 }}
          >
            Manage your account and system preferences
          </Text>
        </View>

        {/* Profile Card */}
        <Card className="w-full mb-6" glass intensity={55}>
          <View className="flex-row items-center p-4">
            <View
              className="h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "rgba(79,124,255,0.15)",
                borderWidth: 1,
                borderColor: "rgba(79,124,255,0.35)",
              }}
            >
              <User color={colors.primary} size={20} strokeWidth={1.8} />
            </View>
            <View className="ml-4">
              <Text className="text-sm" style={{ color: colors.textMuted }}>
                Profile
              </Text>
              <Text className="text-xl" style={{ color: colors.text }}>
                Umpire Account
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.textMuted }}>
                umpire@fairplay.app
              </Text>
            </View>
          </View>
        </Card>

        {/* System Settings Card */}
        <Card className="w-full mb-6" glass intensity={55}>
          <Text className="text-sm mb-2" style={{ color: colors.textMuted }}>
            System
          </Text>
          <SettingsRow Icon={ShieldCheck} title="Review Mode" value="Live" />
          <View className="h-px bg-[#1F2937] my-2" />
          <SettingsRow Icon={Signal} title="Sync Status" value="Online" />
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          variant="destructive"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <LogOut color={color} size={size} strokeWidth={1.8} />
          )}
          containerClassName="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}
