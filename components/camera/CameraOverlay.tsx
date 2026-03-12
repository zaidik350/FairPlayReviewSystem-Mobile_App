/**
 * CameraOverlay — the header (close, match info, flip) + recording indicator
 * rendered over the camera view.
 */

import Colors from '@/constants/colors';
import type { Match } from '@/types';
import { MapPin, Radio, RotateCcw, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraOverlayProps {
  match: Match;
  isRecording: boolean;
  recordingTime: number;
  maxDuration: number;
  topInset: number;
  onClose: () => void;
  onFlip?: () => void;
  /** true when camera flip is disabled (e.g. web) */
  flipDisabled?: boolean;
}

export default function CameraOverlay({
  match,
  isRecording,
  recordingTime,
  maxDuration,
  topInset,
  onClose,
  onFlip,
  flipDisabled,
}: CameraOverlayProps) {
  return (
    <View style={[styles.overlay, { paddingTop: topInset }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.matchInfo}>
          <View style={styles.liveIndicator}>
            <Radio size={14} color={Colors.live} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.matchName} numberOfLines={1}>{match.name}</Text>
          <View style={styles.venueRow}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.venueText}>{match.venue}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.flipButton} onPress={onFlip} disabled={flipDisabled}>
          <RotateCcw size={22} color={flipDisabled ? Colors.textMuted : Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Recording indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>
            Recording {recordingTime}s / {maxDuration}s
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16 },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  matchInfo: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6, marginBottom: 8 },
  liveText: { fontSize: 11, fontWeight: '700', color: Colors.live, letterSpacing: 0.5 },
  matchName: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  venueText: { fontSize: 12, color: Colors.textSecondary },
  flipButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  recordingIndicator: { position: 'absolute', top: '50%', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.live },
  recordingText: { fontSize: 16, fontWeight: '600', color: Colors.text },
});
