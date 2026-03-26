import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useMatchContext } from '@/context/MatchContext';
import type { Match } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PitchConfigModalProps {
  visible: boolean;
  match: Match | null;
  mandatory?: boolean;
  onClose: () => void;
  onConfigured?: (updated: Match) => void;
}

export default function PitchConfigModal({
  visible,
  match,
  mandatory = false,
  onClose,
  onConfigured,
}: PitchConfigModalProps) {
  const { configurePitch, syncPitchConfig } = useMatchContext();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const previewUri = useMemo(() => localImageUri || match?.pitchImageUri || null, [localImageUri, match?.pitchImageUri]);

  const handleTakePitchPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera Permission Required', 'Please allow camera access to configure pitch.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleSavePitchConfig = async () => {
    if (!match?.id) return;
    if (!localImageUri) {
      Alert.alert('Pitch Photo Required', 'Please capture a pitch photo before saving configuration.');
      return;
    }

    setUploading(true);
    try {
      await configurePitch(match.id, localImageUri);

      // Backend may process asynchronously; wait until configured=true is reflected.
      let configured = false;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const latest = await syncPitchConfig(match.id);
        if (latest?.pitchConfigured) {
          configured = true;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      if (!configured) {
        Alert.alert(
          'Configuration Not Ready',
          'Wickets were not detected yet. Please retake the pitch photo from a clearer angle and try again.'
        );
        return;
      }

      const updated = await syncPitchConfig(match.id);
      if (!updated?.pitchConfigured) {
        Alert.alert('Configuration Failed', 'Wicket configuration is still pending. Please retake the photo.');
        return;
      }

      Alert.alert('Pitch Configured', 'Pitch configuration has been saved successfully.');
      setLocalImageUri(null);
      onConfigured?.(updated);
      onClose();
    } catch (error) {
      console.log('[PitchConfigModal][handleSavePitchConfig] error:', error);
      Alert.alert('Error', 'Failed to upload pitch configuration. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (mandatory && !(match?.pitchConfigured || localImageUri)) {
      onClose();
      return;
    }
    setLocalImageUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Card variant="elevated" style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{match?.pitchConfigured ? 'Update Pitch Configuration' : 'Configure Pitch'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.85}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Capture a pitch photo from the same angle you will record deliveries.
            The backend will process and store wicket coordinates for this match.
          </Text>

          <View style={styles.previewBox}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.previewPlaceholder}>
                <ImageIcon size={26} color={Colors.textMuted} />
                <Text style={styles.previewPlaceholderText}>No pitch photo captured yet</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={handleTakePitchPhoto} activeOpacity={0.85}>
            <Camera size={18} color={Colors.background} />
            <Text style={styles.captureButtonText}>Take Pitch Photo</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            {!mandatory && (
              <Button title="Configure Later" onPress={handleClose} variant="outline" style={styles.actionBtn} />
            )}
            <Button
              title={match?.pitchConfigured ? 'Update Pitch' : 'Save Configuration'}
              onPress={handleSavePitchConfig}
              loading={uploading}
              style={styles.actionBtn}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  previewBox: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  previewPlaceholderText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  captureButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  captureButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
});
