import { router } from "expo-router";
import { Text } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import { Colors } from "../../theme/colors";

export default function Signup() {
  return (
    <ScreenWrapper>
      <Text style={{ color: Colors.text, fontSize: 28, marginBottom: 20 }}>
        Create Account
      </Text>

      <AppInput placeholder="Name" placeholderTextColor={Colors.muted} />
      <AppInput placeholder="Email" placeholderTextColor={Colors.muted} />
      <AppInput placeholder="Password" secureTextEntry placeholderTextColor={Colors.muted} />

      <AppButton title="Sign Up" onPress={() => router.replace("/login")} />
    </ScreenWrapper>
  );
}
