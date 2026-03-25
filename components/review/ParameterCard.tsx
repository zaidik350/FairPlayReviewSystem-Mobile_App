/**
 * ParameterCard — displays a single DRS parameter (Impact / Pitching / Wickets).
 */

import Colors from '@/constants/colors';
import { CheckCircle, XCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ParameterCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPositive: boolean;
}

export default function ParameterCard({ icon, label, value, isPositive }: ParameterCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: isPositive ? Colors.out : Colors.notOut }]}>{value}</Text>
          {isPositive ? <CheckCircle size={16} color={Colors.out} /> : <XCircle size={16} color={Colors.notOut} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder, padding: 16 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,255,136,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  content: { flex: 1 },
  label: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 18, fontWeight: '700' },
});
