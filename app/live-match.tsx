import Button from '@/components/Button';
import Card from '@/components/Card';
import CameraOverlay from '@/components/camera/CameraOverlay';
import RecordingControls from '@/components/camera/RecordingControls';
import ReviewPromptModal from '@/components/camera/ReviewPromptModal';
import WebCameraFallback from '@/components/camera/WebCameraFallback';
import Colors from '@/constants/colors';
import { useMatchContext } from '@/context/MatchContext';
import { useCamera } from '@/hooks/useCamera';
import { useRecording } from '@/hooks/useRecording';
import { CameraView } from 'expo-camera';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LiveMatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getMatchById } = useMatchContext();

  const { cameraRef, permission, requestPermission, facing, toggleFacing } = useCamera();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const match = getMatchById(id || '');

  const { isRecording, recordingTime, recordedUri, start, stop, reset, maxDuration } = useRecording({
    cameraRef,
    onRecordingComplete: () => {
      setTimeout(() => setShowReviewModal(true), 500);
    },
  });

  const handleRequestReview = (decision: 'OUT' | 'NOT OUT') => {
    setShowReviewModal(false);
    router.push({
      pathname: '/review-analysis',
      params: {
        matchId: id,
        matchName: match?.name || 'Unknown Match',
        videoUri: recordedUri || 'mock-video.mp4',
        originalDecision: decision,
      },
    });
  };

  const handleDismissReview = () => {
    setShowReviewModal(false);
    reset();
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Card variant="glass" style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to record deliveries for DRS review.
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
        </Card>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {Platform.OS !== 'web' ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="video"
        >
          <CameraOverlay
            match={match}
            isRecording={isRecording}
            recordingTime={recordingTime}
            maxDuration={maxDuration}
            topInset={insets.top}
            onClose={() => router.back()}
            onFlip={toggleFacing}
          />
          <RecordingControls
            isRecording={isRecording}
            bottomInset={insets.bottom}
            onStart={start}
            onStop={stop}
          />
        </CameraView>
      ) : (
        <View style={styles.webCameraPlaceholder}>
          <CameraOverlay
            match={match}
            isRecording={isRecording}
            recordingTime={recordingTime}
            maxDuration={maxDuration}
            topInset={insets.top}
            onClose={() => router.back()}
            flipDisabled
          />
          <WebCameraFallback />
          <RecordingControls
            isRecording={isRecording}
            bottomInset={insets.bottom}
            onStart={start}
            onStop={stop}
          />
        </View>
      )}

      <ReviewPromptModal
        visible={showReviewModal}
        onDismiss={handleDismissReview}
        onSubmit={handleRequestReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  permissionCard: {
    padding: 24,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    width: '100%',
    marginBottom: 12,
  },
  backButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 20,
    gap: 16,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
