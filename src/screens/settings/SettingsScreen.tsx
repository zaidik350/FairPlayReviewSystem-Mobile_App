import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Settings, Shield, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const SettingItem = ({ icon: Icon, label, sublabel }: any) => (
  <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-[#2D333B]">
    <div className="flex-row items-center">
      <View className="bg-[#1c222a] p-2 rounded-lg mr-4">
        <Icon size={20} color="#4F7CFF" />
      </View>
      <View>
        <Text className="text-[#EAEAEA] font-medium text-base">{label}</Text>
        <Text className="text-gray-500 text-xs">{sublabel}</Text>
      </View>
    </div>
    <ChevronRight size={18} color="#444" />
  </TouchableOpacity>
);

export const SettingsScreen = () => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#0B0F14] p-6">
      <Text className="text-white text-3xl font-bold mt-12 mb-6">Settings</Text>

      {/* Profile Section */}
      <Card className="mb-6 flex-row items-center">
        <View className="h-16 w-16 rounded-full bg-[#4F7CFF] items-center justify-center">
          <Text className="text-white text-2xl font-bold">JD</Text>
        </View>
        <View className="ml-4">
          <Text className="text-white text-xl font-semibold">John Doe</Text>
          <Text className="text-gray-500 text-sm">Senior Official • ID #8829</Text>
        </View>
      </Card>

      {/* General Settings */}
      <Card className="mb-6">
        <SettingItem icon={User} label="Personal Info" sublabel="Manage your account data" />
        <SettingItem icon={Bell} label="Notifications" sublabel="System alerts and updates" />
        <SettingItem icon={Shield} label="Security" sublabel="Biometrics and 2FA" />
        <SettingItem icon={Settings} label="System Calibration" sublabel="Hardware sync settings" />
      </Card>

      <Button 
        variant="destructive" 
        title="LOGOUT SYSTEM" 
        onPress={() => router.replace('/login')} 
      />
      
      <Text className="text-center text-gray-600 text-xs mt-4">Version 1.0.4-Alpha Build</Text>
    </ScrollView>
  );
};