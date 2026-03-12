import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Camera, Mail, Save, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { pick: pickImage } = useImagePicker();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setAvatar(uri);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateUser({ name: name.trim(), email: email.trim(), avatar });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer contentStyle={styles.content}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDim]}
                style={styles.avatarRing}
              >
                <View style={styles.avatarInner}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  )}
                </View>
              </LinearGradient>
              <View style={styles.cameraButton}>
                <Camera size={16} color={Colors.background} />
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>Tap to change photo</Text>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              icon={<User size={20} color={Colors.textMuted} />}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={Colors.textMuted} />}
            />
          </Card>

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            icon={<Save size={18} color={Colors.background} />}
            style={styles.saveButton}
          />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 57,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 57,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  uploadHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  formCard: {
    padding: 20,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 8,
  },
});
