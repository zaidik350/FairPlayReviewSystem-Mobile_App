import Button from '@/components/Button';
import Card from '@/components/Card';
import DecisionBadge from '@/components/DecisionBadge';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { DecisionType, ImpactType, PitchType, WicketsType } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    CheckCircle,
    Circle,
    Crosshair,
    Play,
    Target,
    XCircle,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewAnalysisScreen() {
  const { matchId, matchName, videoUri, originalDecision } = useLocalSearchParams<{
    matchId: string;
    matchName: string;
    videoUri: string;
    originalDecision: 'OUT' | 'NOT OUT';
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addReview } = useApp();

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

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderParameterCard = (
    icon: React.ReactNode,
    label: string,
    value: string,
    isPositive: boolean
  ) => (
    <View style={styles.parameterCard}>
      <View style={styles.parameterIcon}>{icon}</View>
      <View style={styles.parameterContent}>
        <Text style={styles.parameterLabel}>{label}</Text>
        <View style={styles.parameterValueRow}>
          <Text
            style={[
              styles.parameterValue,
              { color: isPositive ? Colors.out : Colors.notOut },
            ]}
          >
            {value}
          </Text>
          {isPositive ? (
            <CheckCircle size={16} color={Colors.out} />
          ) : (
            <XCircle size={16} color={Colors.notOut} />
          )}
        </View>
      </View>
    </View>
  );

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
      <LinearGradient
        colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Card variant="elevated" style={styles.videoCard}>
            <View style={styles.videoPlaceholder}>
              <View style={styles.playButton}>
                <Play size={32} color={Colors.text} fill={Colors.text} />
              </View>
              <Text style={styles.videoLabel}>Delivery Recording</Text>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.matchNameText}>{matchName}</Text>
              <Text style={styles.overText}>Over: {over}</Text>
            </View>
          </Card>

          {analyzing ? (
            <Card variant="glass" style={styles.analyzingCard}>
              <Text style={styles.analyzingTitle}>Analyzing Delivery...</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[styles.progressBar, { width: progressWidth }]}
                  />
                </View>
              </View>
              <Text style={styles.analyzingSubtitle}>
                Processing ball tracking data
              </Text>
            </Card>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Decision Parameters</Text>

              <View style={styles.parametersContainer}>
                {renderParameterCard(
                  <Target size={24} color={Colors.primary} />,
                  'Impact',
                  impact,
                  impact === 'In-line'
                )}
                {renderParameterCard(
                  <Circle size={24} color={Colors.accent} />,
                  'Pitching',
                  pitch,
                  pitch === 'In-line'
                )}
                {renderParameterCard(
                  <Crosshair size={24} color={Colors.warning} />,
                  'Wickets',
                  wickets,
                  wickets === 'Hitting'
                )}
              </View>

              <Card variant="elevated" style={styles.decisionCard}>
                <Text style={styles.decisionTitle}>Final Decision</Text>
                <DecisionBadge decision={decision} size="large" />
                <Text style={styles.decisionExplanation}>
                  {decision === 'OUT'
                    ? 'Ball pitched in-line, impact in-line, hitting wickets.'
                    : 'One or more conditions not met for OUT decision.'}
                </Text>
                
                <View style={styles.comparisonContainer}>
                  <Text style={styles.comparisonLabel}>Your Decision:</Text>
                  <Text style={[
                    styles.comparisonValue,
                    { color: originalDecision === decision ? Colors.out : Colors.notOut }
                  ]}>
                    {originalDecision} {originalDecision === decision ? '✓' : '✗'}
                  </Text>
                </View>
              </Card>

              <Button
                title="Save & Return to Match"
                onPress={handleSaveDecision}
                loading={saving}
                style={styles.saveButton}
              />
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  videoInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchNameText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  overText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  analyzingCard: {
    padding: 32,
    alignItems: 'center',
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  analyzingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  parameterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
  },
  parameterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  parameterContent: {
    flex: 1,
  },
  parameterLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  parameterValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parameterValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  decisionCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  decisionTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  decisionExplanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  saveButton: {
    marginTop: 8,
  },
});
