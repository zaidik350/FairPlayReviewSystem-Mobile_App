import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Calendar, FileText, MapPin, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateMatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addMatch } = useApp();

  const [name, setName] = useState('');
  const [teams, setTeams] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name || !teams || !venue || !date) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addMatch({
        name,
        teams,
        venue,
        date,
        status: 'upcoming',
      });
      router.back();
    } catch (err) {
      setError('Failed to create match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Schedule Match',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Create New Match</Text>
            <Text style={styles.subtitle}>
              Fill in the match details to schedule a new game
            </Text>

            <Card variant="glass" style={styles.formCard}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Input
                label="Match Name"
                placeholder="e.g., IPL 2024 - Match 5"
                value={name}
                onChangeText={setName}
                icon={<FileText size={20} color={Colors.textSecondary} />}
              />

              <Input
                label="Teams"
                placeholder="e.g., Team A vs Team B"
                value={teams}
                onChangeText={setTeams}
                icon={<Users size={20} color={Colors.textSecondary} />}
              />

              <Input
                label="Venue"
                placeholder="e.g., Wankhede Stadium, Mumbai"
                value={venue}
                onChangeText={setVenue}
                icon={<MapPin size={20} color={Colors.textSecondary} />}
              />

              <Input
                label="Date & Time"
                placeholder="e.g., Feb 15, 2026 - 7:30 PM"
                value={date}
                onChangeText={setDate}
                icon={<Calendar size={20} color={Colors.textSecondary} />}
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={() => router.back()}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Create Match"
                  onPress={handleCreate}
                  loading={loading}
                  style={styles.createButton}
                />
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  formCard: {
    padding: 24,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});
