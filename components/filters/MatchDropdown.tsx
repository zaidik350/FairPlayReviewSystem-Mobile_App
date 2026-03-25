/**
 * MatchDropdown — filter-by-match dropdown used in reviews screen.
 */

import Colors from '@/constants/colors';
import { Filter } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MatchDropdownProps {
  /** Currently selected match id or 'all' */
  value: string;
  /** { id, name } pairs for each match that has reviews */
  options: { id: string; name: string }[];
  onChange: (matchId: string) => void;
}

export default function MatchDropdown({ value, options, onChange }: MatchDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = value === 'all' ? 'All Matches' : options.find(o => o.id === value)?.name ?? 'Unknown';

  const select = (id: string) => { onChange(id); setOpen(false); };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
        <Filter size={16} color={Colors.primary} />
        <Text style={styles.label} numberOfLines={1}>{currentLabel}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={[styles.option, value === 'all' && styles.optionActive]} onPress={() => select('all')}>
            <Text style={[styles.optionText, value === 'all' && styles.optionTextActive]}>All Matches</Text>
          </TouchableOpacity>
          {options.map(o => (
            <TouchableOpacity key={o.id} style={[styles.option, value === o.id && styles.optionActive]} onPress={() => select(o.id)}>
              <Text style={[styles.optionText, value === o.id && styles.optionTextActive]} numberOfLines={1}>{o.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, marginBottom: 12 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  label: { fontSize: 14, color: Colors.text, flex: 1 },
  dropdown: { marginTop: 8, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden' },
  option: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  optionActive: { backgroundColor: 'rgba(0,255,136,0.1)' },
  optionText: { fontSize: 14, color: Colors.textSecondary },
  optionTextActive: { color: Colors.primary, fontWeight: '600' },
});
