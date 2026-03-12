/**
 * WebCameraFallback — placeholder shown on web where CameraView isn't available.
 */

import Colors from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WebCameraFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Preview</Text>
      <Text style={styles.subtitle}>Camera recording is optimized for mobile devices</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
