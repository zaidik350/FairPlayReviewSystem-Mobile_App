import { StyleSheet, View } from "react-native";
import { Colors } from "../../theme/colors";

export default function ScreenWrapper({ children }: any) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
  },
});
