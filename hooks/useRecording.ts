/**
 * useRecording — recording timer, start/stop with CameraView ref, auto-stop at maxDuration.
 */

import type { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface UseRecordingOptions {
  maxDuration?: number; // seconds, default 5
  cameraRef: React.RefObject<CameraView | null>;
  onRecordingComplete?: (uri: string) => void;
}

export function useRecording({ maxDuration = 5, cameraRef, onRecordingComplete }: UseRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Tick while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) { stop(); return maxDuration; }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const start = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRecording(true);
    setRecordingTime(0);

    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        const video = await cameraRef.current.recordAsync({ maxDuration });
        if (video?.uri) {
          setRecordedUri(video.uri);
          onRecordingComplete?.(video.uri);
        }
      } catch (error) {
        console.log('[useRecording][start] native recording failed:', error);
      }
    } else {
      // Web fallback
      setTimeout(() => {
        const mock = `mock-video-${Date.now()}.mp4`;
        setRecordedUri(mock);
        onRecordingComplete?.(mock);
      }, maxDuration * 1000);
    }
  }, [cameraRef, maxDuration, onRecordingComplete]);

  const stop = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRecording(false);
    if (Platform.OS !== 'web' && cameraRef.current) {
      try { cameraRef.current.stopRecording(); } catch { /* noop */ }
    }
  }, [cameraRef]);

  const reset = useCallback(() => {
    setRecordedUri(null);
    setRecordingTime(0);
    setIsRecording(false);
  }, []);

  return { isRecording, recordingTime, recordedUri, start, stop, reset, maxDuration };
}

export default useRecording;
