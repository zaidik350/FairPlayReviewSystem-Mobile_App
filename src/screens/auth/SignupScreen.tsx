import { Link, useRouter } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthHeader } from "../../components/ui/AuthHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { authClassNames, authStyles } from "./authStyles";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // later: signup / approval flow
    router.replace("/login");
  };

  return (
    <SafeAreaView style={authStyles.screen}>
      <View className={authClassNames.container}>
        <View className={authClassNames.orbPrimaryAlt} />
        <View className={authClassNames.orbSecondaryAlt} />

        <AuthHeader
          badgeLabel="ACCESS REQUEST"
          title="Create Your Access"
          subtitle="Join the FairPlay review console"
        />

        <View className={authClassNames.cardWrap}>
          <Card className={authClassNames.card} glass intensity={55}>
            <Input
              label="Full name"
              type="text"
              value={name}
              onChangeText={setName}
              placeholder="Official name"
              autoCapitalize="words"
              icon={({ color, size }) => (
                <User color={color} size={size} strokeWidth={1.8} />
              )}
            />

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
              placeholder="Create a strong password"
              icon={({ color, size }) => (
                <Lock color={color} size={size} strokeWidth={1.8} />
              )}
            />

            <Button
              title="Request Access"
              onPress={handleSignup}
              containerClassName="mt-4"
            />
          </Card>
        </View>

        <View className={authClassNames.footerRow}>
          <Text className={authClassNames.footerText} style={authStyles.footerText}>
            Already have access?
          </Text>
          <Link href="/login" asChild>
            <Text className={authClassNames.footerLink} style={authStyles.footerLink}>
              Sign in
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
