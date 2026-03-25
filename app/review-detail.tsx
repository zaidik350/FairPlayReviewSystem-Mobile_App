import Card from '@/components/Card';
import DecisionBadge from '@/components/DecisionBadge';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { API_CONFIG } from '@/config/env';
import Colors from '@/constants/colors';
import { useReviewContext } from '@/context/ReviewContext';
import { formatDateLong } from '@/utils/formatters';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  CheckCircle,
  Circle,
  Clock,
  Crosshair,
  Target,
  XCircle,
} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ReviewDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReviewById } = useReviewContext();

  const review = getReviewById(id || '');

  if (!review) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Review not found</Text>
      </View>
    );
  }

  const resolveVideoUri = (rawUri?: string) => {
    if (!rawUri) return '';
    if (/^(https?:|file:|content:|ph:)/i.test(rawUri)) return rawUri;

    // If backend stores relative media path, resolve against API host.
    const apiHost = API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');
    const normalizedPath = rawUri.startsWith('/') ? rawUri : `/${rawUri}`;
    return `${apiHost}${normalizedPath}`;
  };

  const videoSource = resolveVideoUri(review.videoUri);

  const renderParameterRow = (
    icon: React.ReactNode,
    label: string,
    value: string,
    isPositive: boolean
  ) => (
    <View style={styles.parameterRow}>
      <View style={styles.parameterLeft}>
        <View style={styles.parameterIcon}>{icon}</View>
        <Text style={styles.parameterLabel}>{label}</Text>
      </View>
      <View style={styles.parameterRight}>
        <Text
          style={[
            styles.parameterValue,
            { color: isPositive ? Colors.out : Colors.notOut },
          ]}
        >
          {value}
        </Text>
        {isPositive ? (
          <CheckCircle size={18} color={Colors.out} />
        ) : (
          <XCircle size={18} color={Colors.notOut} />
        )}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Review Details',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer paddingBottom={40} contentStyle={styles.content}>
          <Card variant="elevated" style={styles.videoCard}>
            {videoSource ? (
              <Video
                source={{ uri: videoSource }}
                style={styles.videoPlayer}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                shouldPlay={false}
                isLooping
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoLabel}>Processed video not available</Text>
              </View>
            )}
          </Card>

          <Card variant="glass" style={styles.infoCard}>
            <Text style={styles.matchName}>{review.matchName}</Text>
            <View style={styles.metaRow}>
              <View style={styles.overBadge}>
                <Text style={styles.overLabel}>Over</Text>
                <Text style={styles.overValue}>{review.over}</Text>
              </View>
              <View style={styles.timestampContainer}>
                <Clock size={14} color={Colors.textSecondary} />
                <Text style={styles.timestamp}>{formatDateLong(review.timestamp)}</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Decision Parameters</Text>

          <Card style={styles.parametersCard}>
            {renderParameterRow(
              <Target size={20} color={Colors.primary} />,
              'Impact',
              review.impact,
              review.impact === 'In-line'
            )}
            <View style={styles.divider} />
            {renderParameterRow(
              <Circle size={20} color={Colors.accent} />,
              'Pitching',
              review.pitch,
              review.pitch === 'In-line'
            )}
            <View style={styles.divider} />
            {renderParameterRow(
              <Crosshair size={20} color={Colors.warning} />,
              'Wickets',
              review.wickets,
              review.wickets === 'Hitting'
            )}
          </Card>

          <Card variant="elevated" style={styles.decisionCard}>
            <Text style={styles.decisionLabel}>FINAL DECISION</Text>
            <DecisionBadge decision={review.decision} size="large" />
            <Text style={styles.originalDecisionText}>
              Original Decision: {review.originalDecision}
            </Text>
            <Text style={styles.decisionExplanation}>
              {review.decision === 'OUT'
                ? 'All conditions met: Ball pitched in-line, impact in-line, and hitting wickets.'
                : 'Decision overturned: One or more conditions not met for OUT.'}
            </Text>
          </Card>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayer: {
    height: 200,
    width: '100%',
    backgroundColor: '#000',
  },
  videoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoCard: {
    padding: 20,
    marginBottom: 24,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  overLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  parametersCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  parameterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  parameterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parameterLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  parameterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  parameterValue: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 16,
  },
  decisionCard: {
    padding: 28,
    alignItems: 'center',
  },
  decisionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  decisionExplanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  originalDecisionText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600' as const,
  },
});
