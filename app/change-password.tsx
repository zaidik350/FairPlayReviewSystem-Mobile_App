import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { Lock, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const passwordsDoNotMatch = !!confirmPassword && newPassword !== confirmPassword;

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await changePassword(currentPassword, newPassword);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Password changed successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.log('Change password error:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Change Password',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer contentStyle={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Shield size={32} color={Colors.warning} />
            </View>
            <Text style={styles.headerTitle}>Update Your Password</Text>
            <Text style={styles.headerSubtitle}>
              Keep your account secure with a strong password
            </Text>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
              icon={<Lock size={20} color={Colors.textMuted} />}
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              icon={<Lock size={20} color={Colors.textMuted} />}
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              icon={<Lock size={20} color={Colors.textMuted} />}
            />

            {passwordsDoNotMatch ? (
              <Text style={styles.validationText}>New password does not match.</Text>
            ) : null}
          </Card>

          <Button
            title="Change Password"
            onPress={handleChangePassword}
            loading={saving}
            disabled={passwordsDoNotMatch}
            icon={<Lock size={18} color={Colors.background} />}
            style={styles.saveButton}
          />

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Password Tips</Text>
            <Text style={styles.tipItem}>• Use at least 6 characters</Text>
            <Text style={styles.tipItem}>• Mix letters, numbers, and symbols</Text>
            <Text style={styles.tipItem}>• Avoid common words or patterns</Text>
          </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    padding: 20,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 24,
  },
  validationText: {
    fontSize: 12,
    color: Colors.destructive,
    marginTop: -8,
    marginBottom: 8,
  },
  tipsCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
});
