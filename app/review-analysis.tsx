import Button from '@/components/Button';
import ScreenContainer from '@/components/layout/ScreenContainer';
import AnalyzingProgress from '@/components/review/AnalyzingProgress';
import DecisionResult from '@/components/review/DecisionResult';
import ParameterCard from '@/components/review/ParameterCard';
import VideoCard from '@/components/review/VideoCard';
import Colors from '@/constants/colors';
import { useReviewContext } from '@/context/ReviewContext';
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
  const { addReview } = useReviewContext();

  const [analyzing, setAnalyzing] = useState(true);
  const [impact, setImpact] = useState<ImpactType>('In-line');
  const [pitch, setPitch] = useState<PitchType>('In-line');
  const [wickets, setWickets] = useState<WicketsType>('Hitting');
  const [decision, setDecision] = useState<DecisionType>('OUT');
  const [over, setOver] = useState('12.4');
  const [saving, setSaving] = useState(false);

  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      setAnalyzing(false);
      simulateAnalysis();
    });
  }, []);

  const simulateAnalysis = () => {
    const impacts: ImpactType[] = ['In-line', 'Outside'];
    const pitches: PitchType[] = ['In-line', 'Outside'];
    const wicketsOptions: WicketsType[] = ['Hitting', 'Missing'];

    const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
    const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
    const randomWickets = wicketsOptions[Math.floor(Math.random() * wicketsOptions.length)];

    setImpact(randomImpact);
    setPitch(randomPitch);
    setWickets(randomWickets);

    const isOut =
      randomImpact === 'In-line' &&
      randomPitch === 'In-line' &&
      randomWickets === 'Hitting';

    setDecision(isOut ? 'OUT' : 'NOT OUT');

    const overNum = Math.floor(Math.random() * 20) + 1;
    const ballNum = Math.floor(Math.random() * 6) + 1;
    setOver(`${overNum}.${ballNum}`);

    Haptics.notificationAsync(
      isOut
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
  };

  const handleSaveDecision = async () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await addReview({
        matchId: matchId || '',
        matchName: matchName || 'Unknown Match',
        over,
        originalDecision: originalDecision || 'OUT',
        decision,
        impact,
        pitch,
        wickets,
        videoUri: videoUri || 'mock-video.mp4',
      });

      router.replace(`/live-match?id=${matchId}`);
    } catch (error) {
      console.log('Error saving review:', error);
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
          <VideoCard matchName={matchName || ''} over={over} />

          {analyzing ? (
            <AnalyzingProgress progress={progressAnim} />
          ) : (
            <>
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
                title="Save & Return to Match"
                onPress={handleSaveDecision}
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
  parametersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 8,
  },
});
