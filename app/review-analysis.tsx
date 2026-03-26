import Button from '@/components/Button';
import ScreenContainer from '@/components/layout/ScreenContainer';
import AnalyzingProgress from '@/components/review/AnalyzingProgress';
import DecisionResult from '@/components/review/DecisionResult';
import ParameterCard from '@/components/review/ParameterCard';
import VideoCard from '@/components/review/VideoCard';
import Colors from '@/constants/colors';
import { reviewService } from '@/services/review/reviewService';
import { DecisionType, ImpactType, PitchType, WicketsType } from '@/types';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Circle,
  Crosshair,
  Target,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ReviewAnalysisScreen() {
  const { matchId, matchName, videoUri, originalDecision } = useLocalSearchParams<{
    matchId: string;
    matchName: string;
    videoUri: string;
    originalDecision: 'OUT' | 'NOT OUT';
  }>();
  const router = useRouter();

  const [analyzing, setAnalyzing] = useState(true);
  const [impact, setImpact] = useState<ImpactType>('In-line');
  const [pitch, setPitch] = useState<PitchType>('In-line');
  const [wickets, setWickets] = useState<WicketsType>('Hitting');
  const [decision, setDecision] = useState<DecisionType>('OUT');
  const [saving, setSaving] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
      { resetBeforeIteration: true }
    );

    const runAnalysis = async () => {
      setAnalyzing(true);
      setAnalysisError('');
      progressAnim.setValue(0);
      animation.start();

      try {
        if (!videoUri || videoUri.startsWith('mock-video-')) {
          throw new Error('No valid recorded video found. Please record again and retry review.');
        }

        const result = await reviewService.analyzeVideo(
          videoUri,
          matchId || '',
          originalDecision || 'OUT'
        );

        setImpact(result.impact);
        setPitch(result.pitch);
        setWickets(result.wickets);
        setDecision(result.decision);

        Haptics.notificationAsync(
          result.decision === 'OUT'
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );
      } catch (error: any) {
        console.log('[ReviewAnalysis][runAnalysis] error:', error);
        setAnalysisError(error?.message || 'Failed to analyze video. Please try again.');
      } finally {
        animation.stop();
        setAnalyzing(false);
      }
    };

    runAnalysis();

    return () => {
      animation.stop();
    };
  }, []);

  const handleReturnToMatch = async () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      router.replace(`/live-match?id=${matchId}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'DRS Review',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer contentStyle={styles.content}>
          <VideoCard matchName={matchName || ''} />

          {analyzing ? (
            <AnalyzingProgress progress={progressAnim} />
          ) : (
            <>
              {analysisError ? <Text style={styles.errorText}>{analysisError}</Text> : null}

              <Text style={styles.sectionTitle}>Decision Parameters</Text>

              <View style={styles.parametersContainer}>
                <ParameterCard
                  icon={<Target size={24} color={Colors.primary} />}
                  label="Impact"
                  value={impact}
                  isPositive={impact === 'In-line'}
                />
                <ParameterCard
                  icon={<Circle size={24} color={Colors.accent} />}
                  label="Pitching"
                  value={pitch}
                  isPositive={pitch === 'In-line'}
                />
                <ParameterCard
                  icon={<Crosshair size={24} color={Colors.warning} />}
                  label="Wickets"
                  value={wickets}
                  isPositive={wickets === 'Hitting'}
                />
              </View>

              <DecisionResult
                decision={decision}
                originalDecision={originalDecision || 'OUT'}
              />

              <Button
                title="Return to Match"
                onPress={handleReturnToMatch}
                loading={saving}
                style={styles.saveButton}
              />
            </>
          )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  parametersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 8,
  },
});
