import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../theme/colors";

export default function AppButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: "center",
  },
  text: {
    color: Colors.text,
    fontWeight: "600",
  },
});
