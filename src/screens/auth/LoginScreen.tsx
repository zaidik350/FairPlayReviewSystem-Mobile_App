import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";

export const LoginScreen = () => {
  const router = useRouter();
  const [role, setRole] = useState("Umpire");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center">
        {/* Branding */}
        <View className="items-center mb-10">
          <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
            <Image
              source={require("../../../assets/logo-icon.png")}
              className="w-10 h-10"
            />
          </View>
          <Text className="text-white text-3xl font-bold text-center">Cricket Fair Play</Text>
          <Text className="text-white text-3xl font-bold text-center">Review System</Text>
        </View>

        {/* Form */}
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          type="email"
          icon={({ color, size }) => (
            <Mail color={color} size={size} strokeWidth={1.8} />
          )}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          type="password"
          icon={({ color, size }) => (
            <Lock color={color} size={size} strokeWidth={1.8} />
          )}
        />

        <RoleSelector selectedRole={role} onSelect={setRole} />

        <View className="mt-8">
          <Button title="Login" onPress={() => router.replace("/settings")} />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/signup")}
          className="mt-6 items-center"
        >
          <Text className="text-gray-400">
            Don't have an account? <Text className="text-white font-bold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};