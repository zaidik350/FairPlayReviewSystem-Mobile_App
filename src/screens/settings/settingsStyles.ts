import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const settingsClassNames = {
  container: "flex-1 px-6 py-8 justify-start relative",
  orbPrimary: "absolute -top-32 left-0 h-48 w-48 rounded-full bg-[#2ED3C6] opacity-10",
  orbSecondary: "absolute -bottom-32 right-0 h-56 w-56 rounded-full bg-[#4F7CFF] opacity-15",
  header: "mb-10",
  title: "text-3xl text-center",
  subtitle: "mt-2 text-center",
  card: "w-full mb-6",
  profileRow: "flex-row items-center p-4",
  profileIcon: "h-12 w-12 items-center justify-center rounded-2xl",
  profileInfo: "ml-4",
  label: "text-sm",
  name: "text-xl",
  email: "text-sm mt-1",
  sectionLabel: "text-sm mb-2",
  divider: "h-px bg-[#1F2937] my-2",
};

export const settingsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  label: {
    color: colors.textMuted,
  },
  name: {
    color: colors.text,
  },
  email: {
    color: colors.textMuted,
  },
  sectionLabel: {
    color: colors.textMuted,
  },
  profileIcon: {
    backgroundColor: "rgba(79,124,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.35)",
  },
});
