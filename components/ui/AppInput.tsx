import { StyleSheet, TextInput } from "react-native";
import { Colors } from "../../theme/colors";

export default function AppInput(props: any) {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
  },
});
