/**
 * CameraOverlay — the header (close, match info, flip) + recording indicator
 * rendered over the camera view.
 */

import Colors from '@/constants/colors';
import type { Match } from '@/types';
import { Flag, MapPin, RotateCcw, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraOverlayProps {
  match: Match;
  isRecording: boolean;
  recordingTime: number;
  maxDuration: number;
  topInset: number;
  onClose: () => void;
  onEndMatch?: () => void;
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
  onEndMatch,
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
          <TouchableOpacity style={styles.endMatchButton} activeOpacity={0.85} onPress={onEndMatch}>
            <Flag size={13} color={Colors.destructive} />
            <Text style={styles.endMatchText}>END MATCH</Text>
          </TouchableOpacity>
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
  endMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.55)',
    backgroundColor: 'rgba(20, 20, 20, 0.45)',
    marginBottom: 8,
  },
  endMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffd4d4',
    letterSpacing: 0.5,
  },
  matchName: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  venueText: { fontSize: 12, color: Colors.textSecondary },
  flipButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  recordingIndicator: { position: 'absolute', top: '50%', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.live },
  recordingText: { fontSize: 16, fontWeight: '600', color: Colors.text },
});
