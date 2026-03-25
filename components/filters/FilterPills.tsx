/**
 * FilterPills — horizontal scrollable pill buttons (used in matches + reviews screens).
 */

import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface FilterItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface FilterPillsProps<T extends string = string> {
  filters: FilterItem<T>[];
  active: T;
  onChange: (key: T) => void;
}

export default function FilterPills<T extends string = string>({ filters, active, onChange }: FilterPillsProps<T>) {
  const handlePress = (key: T) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(key);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {filters.map(f => {
        const isActive = f.key === active;
        return (
          <TouchableOpacity key={f.key} onPress={() => handlePress(f.key)} style={[styles.pill, isActive && styles.pillActive]}>
            {f.icon && <View style={styles.icon}>{f.icon}</View>}
            <Text style={[styles.text, isActive && styles.textActive]}>
              {f.label}{f.count !== undefined ? ` (${f.count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, gap: 6 },
  pillActive: { backgroundColor: 'rgba(0,255,136,0.15)', borderColor: Colors.primary },
  icon: {},
  text: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  textActive: { color: Colors.primary },
});
