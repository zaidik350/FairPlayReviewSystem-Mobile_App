import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useMatchContext } from '@/context/MatchContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { Calendar, Clock3, FileText, MapPin, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateMatchScreen() {
  const router = useRouter();
  const { addMatch } = useMatchContext();

  const [name, setName] = useState('');
  const [teams, setTeams] = useState('');
  const [venue, setVenue] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const closePickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const openDatePicker = () => {
    setShowTimePicker(false);
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const formatDateTime = (value: Date) => {
    const datePart = value.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const timePart = value.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} - ${timePart}`;
  };

  const dateLabel = selectedDateTime
    ? selectedDateTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : 'Select date';

  const timeLabel = selectedDateTime
    ? selectedDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : 'Select time';

  const onDateChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type !== 'set' || !picked) return;

    const next = selectedDateTime ? new Date(selectedDateTime) : new Date();
    next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
    setSelectedDateTime(next);
  };

  const onTimeChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (event.type !== 'set' || !picked) return;

    const next = selectedDateTime ? new Date(selectedDateTime) : new Date();
    next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    setSelectedDateTime(next);
  };

  const handleCreate = async () => {
    if (!name || !teams || !venue || !selectedDateTime) {
      setError('Please fill in all fields');
      return;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDayStart = new Date(
      selectedDateTime.getFullYear(),
      selectedDateTime.getMonth(),
      selectedDateTime.getDate()
    );

    if (selectedDayStart < todayStart) {
      setError('Match date cannot be before today.');
      return;
    }

    if (selectedDayStart.getTime() === todayStart.getTime() && selectedDateTime < now) {
      setError('For today, match time cannot be before current time.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addMatch({
        name,
        teams,
        venue,
        date: formatDateTime(selectedDateTime),
        status: 'upcoming',
      });
      router.back();
    } catch (err) {
      console.log('[CreateMatchScreen][handleCreate] error:', err);
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
      <ScreenContainer keyboard contentStyle={styles.content}>
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
                onFocus={closePickers}
                icon={<FileText size={20} color={Colors.textSecondary} />}
              />

              <Input
                label="Teams"
                placeholder="e.g., Team A vs Team B"
                value={teams}
                onChangeText={setTeams}
                onFocus={closePickers}
                icon={<Users size={20} color={Colors.textSecondary} />}
              />

              <Input
                label="Venue"
                placeholder="e.g., Wankhede Stadium, Mumbai"
                value={venue}
                onChangeText={setVenue}
                onFocus={closePickers}
                icon={<MapPin size={20} color={Colors.textSecondary} />}
              />

              <Text style={styles.label}>Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={styles.dateTimeButton}
                  activeOpacity={0.85}
                >
                  <Calendar size={18} color={Colors.textSecondary} />
                  <Text style={styles.dateTimeText}>{dateLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={openTimePicker}
                  style={styles.dateTimeButton}
                  activeOpacity={0.85}
                >
                  <Clock3 size={18} color={Colors.textSecondary} />
                  <Text style={styles.dateTimeText}>{timeLabel}</Text>
                </TouchableOpacity>
              </View>

              {selectedDateTime ? (
                <Text style={styles.selectedDateTime}>Selected: {formatDateTime(selectedDateTime)}</Text>
              ) : null}

              {showDatePicker ? (
                <DateTimePicker
                  value={selectedDateTime ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              ) : null}

              {showTimePicker ? (
                <DateTimePicker
                  value={selectedDateTime ?? new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              ) : null}

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
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
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
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDateTime: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 12,
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
