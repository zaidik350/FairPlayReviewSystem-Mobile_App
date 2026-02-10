import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import type { CameraType } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    CheckCircle,
    Circle,
    MapPin,
    Radio,
    RotateCcw,
    StopCircle,
    X,
    XCircle,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LiveMatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getMatchById } = useApp();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [wantsReview, setWantsReview] = useState<boolean | null>(null);

  const match = getMatchById(id || '');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 5) {
            stopRecording();
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRecording(true);
    setRecordingTime(0);

    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 5,
        });
        if (video?.uri) {
          setRecordedVideoUri(video.uri);
        }
      } catch (error) {
        console.log('Recording error:', error);
        setRecordedVideoUri(`mock-video-${Date.now()}.mp4`);
      }
    } else {
      setTimeout(() => {
        setRecordedVideoUri(`mock-video-${Date.now()}.mp4`);
      }, 5000);
    }
  };

  const stopRecording = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRecording(false);

    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
      } catch (error) {
        console.log('Stop recording error:', error);
      }
    }

    setTimeout(() => {
      setShowReviewModal(true);
    }, 500);
  };

  const toggleCameraFacing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const handleRequestReview = (decision: 'OUT' | 'NOT OUT') => {
    setShowReviewModal(false);
    setWantsReview(null);
    router.push({
      pathname: '/review-analysis',
      params: {
        matchId: id,
        matchName: match?.name || 'Unknown Match',
        videoUri: recordedVideoUri || 'mock-video.mp4',
        originalDecision: decision,
      },
    });
  };

  const handleDismissReview = () => {
    setShowReviewModal(false);
    setRecordedVideoUri(null);
    setWantsReview(null);
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
          <View style={[styles.overlay, { paddingTop: insets.top }]}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>

              <View style={styles.matchInfo}>
                <View style={styles.liveIndicator}>
                  <Radio size={14} color={Colors.live} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.matchName} numberOfLines={1}>
                  {match.name}
                </Text>
                <View style={styles.venueRow}>
                  <MapPin size={12} color={Colors.textSecondary} />
                  <Text style={styles.venueText}>{match.venue}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <RotateCcw size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>
                  Recording {recordingTime}s / 5s
                </Text>
              </View>
            )}

            <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.controlsInner}>
                {!isRecording ? (
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={startRecording}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recordButtonOuter}>
                      <Circle
                        size={60}
                        color={Colors.destructive}
                        fill={Colors.destructive}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={stopRecording}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recordButtonOuter}>
                      <StopCircle
                        size={60}
                        color={Colors.destructive}
                        fill={Colors.destructive}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <Text style={styles.recordHint}>
                  {isRecording ? 'Tap to stop' : 'Tap to record delivery'}
                </Text>
              </View>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.webCameraPlaceholder}>
          <View style={[styles.overlay, { paddingTop: insets.top }]}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>

              <View style={styles.matchInfo}>
                <View style={styles.liveIndicator}>
                  <Radio size={14} color={Colors.live} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.matchName} numberOfLines={1}>
                  {match.name}
                </Text>
                <View style={styles.venueRow}>
                  <MapPin size={12} color={Colors.textSecondary} />
                  <Text style={styles.venueText}>{match.venue}</Text>
                </View>
              </View>

              <View style={styles.flipButton}>
                <RotateCcw size={22} color={Colors.textMuted} />
              </View>
            </View>

            <View style={styles.webCameraMessage}>
              <Text style={styles.webCameraTitle}>Camera Preview</Text>
              <Text style={styles.webCameraSubtitle}>
                Camera recording is optimized for mobile devices
              </Text>
            </View>

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>
                  Recording {recordingTime}s / 5s
                </Text>
              </View>
            )}

            <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.controlsInner}>
                {!isRecording ? (
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={startRecording}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recordButtonOuter}>
                      <Circle
                        size={60}
                        color={Colors.destructive}
                        fill={Colors.destructive}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={stopRecording}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recordButtonOuter}>
                      <StopCircle
                        size={60}
                        color={Colors.destructive}
                        fill={Colors.destructive}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <Text style={styles.recordHint}>
                  {isRecording ? 'Tap to stop' : 'Tap to record delivery'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal
        visible={showReviewModal}
        transparent
        animationType="fade"
        onRequestClose={handleDismissReview}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.modalCard}>
            {wantsReview === null ? (
              <>
                <Text style={styles.modalTitle}>Delivery Recorded</Text>
                <Text style={styles.modalSubtitle}>
                  Would you like to request a DRS review for this delivery?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.dismissButton]}
                    onPress={handleDismissReview}
                  >
                    <X size={24} color={Colors.textSecondary} />
                    <Text style={styles.dismissText}>No</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.reviewButton]}
                    onPress={() => setWantsReview(true)}
                  >
                    <CheckCircle size={24} color={Colors.primary} />
                    <Text style={styles.reviewText}>Yes, Review</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Your Original Decision</Text>
                <Text style={styles.modalSubtitle}>
                  What was your decision for this delivery before requesting the review?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.outButton]}
                    onPress={() => handleRequestReview('OUT')}
                  >
                    <CheckCircle size={24} color={Colors.out} />
                    <Text style={styles.outText}>OUT</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.notOutButton]}
                    onPress={() => handleRequestReview('NOT OUT')}
                  >
                    <XCircle size={24} color={Colors.notOut} />
                    <Text style={styles.notOutText}>NOT OUT</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setWantsReview(null)}
                >
                  <Text style={styles.cancelText}>Go Back</Text>
                </TouchableOpacity>
              </>
            )}
          </Card>
        </View>
      </Modal>
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
  webCameraMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webCameraTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  webCameraSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.live,
    letterSpacing: 0.5,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.live,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsInner: {
    alignItems: 'center',
  },
  recordButton: {
    marginBottom: 12,
  },
  recordButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  recordHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dismissButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: Colors.destructive,
  },
  reviewButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  reviewText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  outButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1,
    borderColor: Colors.out,
  },
  notOutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: Colors.notOut,
  },
  outText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.out,
  },
  notOutText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.notOut,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
