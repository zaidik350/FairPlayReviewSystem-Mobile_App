import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const authClassNames = {
  container: "flex-1 px-6 items-center",
  orbPrimary: "absolute -top-20 right-0 h-44 w-44 rounded-full bg-[#4F7CFF] opacity-15",
  orbSecondary: "absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-[#2ED3C6] opacity-10",
  orbPrimaryAlt: "absolute -top-24 left-0 h-48 w-48 rounded-full bg-[#2ED3C6] opacity-10",
  orbSecondaryAlt: "absolute -bottom-32 right-0 h-56 w-56 rounded-full bg-[#4F7CFF] opacity-15",
  header: "mb-10 items-center",
  badgeRow: "flex-row items-center",
  badge: "h-11 w-11 items-center justify-center rounded-2xl",
  badgeText: "ml-3 text-xs tracking-[3px]",
  title: "mt-6 text-3xl text-center",
  subtitle: "mt-2 text-center",
  cardWrap: "flex-1 w-full justify-end pb-6",
  card: "w-full",
  footerRow: "flex-row justify-center items-center",
  footerText: "text-sm",
  footerLink: "ml-1 text-sm",
};

export const authStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  badge: {
    backgroundColor: "rgba(79,124,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.35)",
  },
  badgeText: {
    color: colors.textMuted,
  },
  title: {
    color: colors.text,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  footerText: {
    color: colors.textMuted,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "500",
  },
});
