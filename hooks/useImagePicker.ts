/**
 * useImagePicker — wraps expo-image-picker for avatar / photo selection.
 */

import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface UseImagePickerOptions {
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
}

export function useImagePicker(opts: UseImagePickerOptions = {}) {
  const { aspect = [1, 1], quality = 0.8, allowsEditing = true } = opts;
  const [uri, setUri] = useState<string | null>(null);

  const pick = useCallback(async (): Promise<string | null> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library.');
        return null;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        const selected = result.assets[0].uri;
        setUri(selected);
        return selected;
      }
      return null;
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  }, [aspect, quality, allowsEditing]);

  const clear = useCallback(() => setUri(null), []);

  return { uri, setUri, pick, clear };
}

export default useImagePicker;
