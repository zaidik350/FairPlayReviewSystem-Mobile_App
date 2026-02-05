import { Text } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { Colors } from "../../theme/colors";

export default function Home() {
  return (
    <ScreenWrapper>
      <Text style={{ color: Colors.text, fontSize: 22 }}>
        Match Dashboard (Coming Next)
      </Text>
    </ScreenWrapper>
  );
}
