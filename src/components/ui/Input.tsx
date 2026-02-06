import type { ReactNode } from "react";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { colors } from "../../theme/colors";

export type InputType = "text" | "email" | "password";

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: InputType;
  placeholder?: string;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  containerClassName?: string;
  icon?: (props: { color: string; size: number }) => ReactNode;
}

const keyboardByType: Record<InputType, KeyboardTypeOptions> = {
  text: "default",
  email: "email-address",
  password: "default",
};

export function Input({
  label,
  value,
  onChangeText,
  type = "text",
  placeholder,
  autoCapitalize = "none",
  containerClassName,
  icon,
}: InputProps) {
  return (
    <View className={containerClassName ?? "mb-4"}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardByType[type]}
        secureTextEntry={type === "password"}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        dense={false}
        style={styles.input}
        outlineStyle={styles.outline}
        contentStyle={styles.content}
        textColor={colors.text}
        selectionColor={colors.primary}
        activeOutlineColor={colors.primary}
        outlineColor={colors.border}
        placeholderTextColor={colors.textMuted}
        theme={{
          roundness: 14,
          colors: {
            primary: colors.primary,
            background: "transparent",
            text: colors.text,
            placeholder: colors.textMuted,
          },
        }}
        left={
          icon ? (
            <TextInput.Icon
              icon={(props) =>
                icon({
                  color: props.color,
                  size: props.size,
                })
              }
            />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.85)", // dark glass input
  },
  outline: {
    borderRadius: 14,
    borderWidth: 1,
  },
  content: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
