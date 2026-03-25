/**
 * useCamera — encapsulates CameraView permission + facing logic.
 */

import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';
import { State } from 'react-native-gesture-handler';

export function useCamera() {
  const cameraRef = useRef<CameraView>(null);
  const pinchStartZoom = useRef(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [zoom, setZoom] = useState(0);

  const clampZoom = useCallback((value: number) => Math.max(0, Math.min(1, value)), []);

  const toggleFacing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(0);
  }, []);

  const onPinchGesture = useCallback((event: any) => {
    const scale = event?.nativeEvent?.scale ?? 1;
    const nextZoom = pinchStartZoom.current + (scale - 1) * 0.25;
    setZoom(clampZoom(nextZoom));
  }, [clampZoom]);

  const onPinchStateChange = useCallback((event: any) => {
    const state = event?.nativeEvent?.state;
    const oldState = event?.nativeEvent?.oldState;

    if (state === State.BEGAN) {
      pinchStartZoom.current = zoom;
      return;
    }

    if (oldState === State.ACTIVE || state === State.END || state === State.CANCELLED || state === State.FAILED) {
      pinchStartZoom.current = zoom;
    }
  }, [zoom]);

  return {
    cameraRef,
    permission,
    requestPermission,
    facing,
    zoom,
    toggleFacing,
    resetZoom,
    onPinchGesture,
    onPinchStateChange,
  };
}

export default useCamera;
