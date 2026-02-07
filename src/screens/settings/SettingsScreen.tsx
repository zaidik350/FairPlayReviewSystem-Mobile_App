import { useRouter } from 'expo-router';
import { Bell, Settings, Shield, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Reusable Setting Row
const SettingRow = ({ icon: Icon, label }: any) => (
  <View className="flex-row items-center py-4 border-b border-gray-800">
    <Icon size={20} color="#4F7CFF" className="mr-4" />
    <Text className="text-white text-lg flex-1">{label}</Text>
  </View>
);

export const SettingsScreen = () => {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl font-bold mt-12 mb-6">Profile Settings</Text>

        <Card className="mb-6 bg-[#161B22]/50 border-[#2D333B]">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-[#4F7CFF] rounded-full items-center justify-center mb-2">
              <Text className="text-white text-2xl font-bold">JD</Text>
            </View>
            <Text className="text-white text-xl font-bold">John Doe</Text>
            <Text className="text-gray-500">Official Umpire • Grade A</Text>
          </View>
        </Card>

        <Card className="bg-[#161B22]/50 border-[#2D333B] mb-8">
          <SettingRow icon={User} label="Account Information" />
          <SettingRow icon={Bell} label="Push Notifications" />
          <SettingRow icon={Shield} label="Privacy & Security" />
          <SettingRow icon={Settings} label="Match Preferences" />
        </Card>

        <Button 
          variant="destructive" 
          title="Logout" 
          onPress={() => router.replace('/login')} 
        />
        <Text className="text-center text-gray-600 text-xs mt-4 pb-10">FairPlay System v1.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
};