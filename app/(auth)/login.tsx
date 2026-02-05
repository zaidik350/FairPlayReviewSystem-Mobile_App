import { router } from "expo-router";
import { Text } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../theme/colors";

export default function Login() {
  const { login } = useAuth();

  return (
    <ScreenWrapper>
      <Text style={{ color: Colors.text, fontSize: 28, marginBottom: 20 }}>
        FairPlay Review
      </Text>

      <AppInput placeholder="Email" placeholderTextColor={Colors.muted} />
      <AppInput placeholder="Password" secureTextEntry placeholderTextColor={Colors.muted} />

      <AppButton title="Login" onPress={login} />

      <Text
        onPress={() => router.push("/signup")}
        style={{ color: Colors.accent, marginTop: 10 }}
      >
        Create an account
      </Text>
    </ScreenWrapper>
  );
}
