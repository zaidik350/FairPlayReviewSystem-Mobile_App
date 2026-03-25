/**
 * RecordingControls — record / stop button + hint text.
 */

import Colors from '@/constants/colors';
import { Circle, StopCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecordingControlsProps {
  isRecording: boolean;
  bottomInset: number;
  onStart: () => void;
  onStop: () => void;
}

export default function RecordingControls({ isRecording, bottomInset, onStart, onStop }: RecordingControlsProps) {

  return (
    <View style={[styles.controls, { paddingBottom: bottomInset + 20 }]}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.button} onPress={isRecording ? onStop : onStart} activeOpacity={0.8}>
          <View style={styles.buttonOuter}>
            {isRecording ? (
              <StopCircle size={60} color={Colors.destructive} fill={Colors.destructive} />
            ) : (
              <Circle size={60} color={Colors.destructive} fill={Colors.destructive} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.hint}>{isRecording ? 'Tap to stop' : 'Tap to record delivery'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
  inner: { alignItems: 'center' },
  button: { marginBottom: 12 },
  buttonOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: Colors.text, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  hint: { fontSize: 13, color: Colors.textSecondary },
});
