import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F1F15', '#050A07']} // Deep Forest to Black
        style={StyleSheet.absoluteFill}
      />
      {/* Ensure you have a diamond pattern tile in your assets */}
      <ImageBackground 
        source={require('../../../assets/diamond-pattern.png')} 
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: 0.1, resizeMode: 'repeat' }}
      />
      <SafeAreaView className="flex-1 px-6">
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A07' },
});