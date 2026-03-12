/**
 * AnalyzingProgress — animated progress bar shown while DRS is analysing.
 */

import Card from '@/components/Card';
import Colors from '@/constants/colors';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface AnalyzingProgressProps {
  /** Animated.Value going from 0 → 1 */
  progress: Animated.Value;
  title?: string;
  subtitle?: string;
}

export default function AnalyzingProgress({ progress, title = 'Analyzing Delivery...', subtitle = 'Processing ball tracking data' }: AnalyzingProgressProps) {
  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Card variant="glass" style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.bar, { width }]} />
        </View>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 32, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 20 },
  progressContainer: { width: '100%', marginBottom: 16 },
  track: { height: 6, backgroundColor: Colors.cardBorder, borderRadius: 3, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
});
