/**
 * VideoCard — the video preview / placeholder with play button.
 */

import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { Play } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VideoCardProps {
  matchName: string;
}

export default function VideoCard({ matchName }: VideoCardProps) {
  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.placeholder}>
        <View style={styles.playButton}>
          <Play size={32} color={Colors.text} fill={Colors.text} />
        </View>
        <Text style={styles.label}>Delivery Recording</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.matchName}>{matchName}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden', marginBottom: 24 },
  placeholder: { height: 180, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,255,136,0.2)', borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  label: { fontSize: 13, color: Colors.textSecondary },
  info: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchName: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
});
