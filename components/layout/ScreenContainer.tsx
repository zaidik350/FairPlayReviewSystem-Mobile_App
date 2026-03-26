/**
 * ScreenContainer — the "chrome" shared by almost every screen:
 *   LinearGradient → SafeArea padding → optional KeyboardAvoidingView → ScrollView.
 *
 * Props let callers turn each layer on/off.
 */

import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    type ScrollViewProps,
    type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Wrap content in KeyboardAvoidingView (default false) */
  keyboard?: boolean;
  /** Wrap content in ScrollView (default true) */
  scroll?: boolean;
  /** Extra padding at top (in addition to safe area) */
  paddingTop?: number;
  /** Extra padding at bottom (in addition to safe area) */
  paddingBottom?: number;
  /** Style applied to the inner content wrapper / ScrollView contentContainer */
  contentStyle?: ViewStyle;
  /** Props forwarded to the inner ScrollView */
  scrollViewProps?: ScrollViewProps;
  /** Whether to apply safe area insets (default true) */
  safeArea?: boolean;
  /** Skip gradient background */
  noGradient?: boolean;
}

export default function ScreenContainer({
  children,
  keyboard = false,
  scroll = true,
  paddingTop = 0,
  paddingBottom = 20,
  contentStyle,
  scrollViewProps,
  safeArea = true,
  noGradient = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const top = safeArea ? insets.top + paddingTop : paddingTop;
  const bottom = safeArea ? insets.bottom + paddingBottom : paddingBottom;

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[{ paddingTop: top, paddingBottom: bottom }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.plain, { paddingTop: top, paddingBottom: bottom }, contentStyle]}>
      {children}
    </View>
  );

  const wrapped = keyboard ? (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {inner}
    </KeyboardAvoidingView>
  ) : inner;

  if (noGradient) {
    return <View style={styles.flex}>{wrapped}</View>;
  }

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.flex}
    >
      {wrapped}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  plain: { flex: 1 },
});
