/**
 * useCamera — encapsulates CameraView permission + facing logic.
 */

import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

export function useCamera() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  const toggleFacing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  }, []);

  return {
    cameraRef,
    permission,
    requestPermission,
    facing,
    toggleFacing,
  };
}

export default useCamera;
