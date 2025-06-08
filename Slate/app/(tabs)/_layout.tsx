import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Dimensions } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { SvgProps } from 'react-native-svg';
import * as Font from 'expo-font'; // Import expo-font

// Import your SVG icon components
import DiaryIcon from '../../assets/icons/Diary';
import ProgramsIcon from '../../assets/icons/Dumbell';
import PremiumIcon from '../../assets/icons/premium';
import ExercisesIcon from '../../assets/icons/Exercises';

// Get screen dimensions once
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate relative sizes for icons and labels based on screen dimensions
const iconSize = screenWidth * 0.065;
const labelFontSize = screenWidth * 0.028;
const labelMarginBottom = screenHeight * 0.008;
const tabBarHeight = screenHeight * 0.09;

const NOTCH_DEVICE_HEIGHT_THRESHOLD = 800;

export default function TabLayout() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  // Helper function to wrap SVG icon components, passing color and calculated size
  const wrapIcon = (IconComponent: React.FC<SvgProps>) => {
    const WrappedIcon = ({ color }: { color: string }) => (
      <IconComponent color={color} width={iconSize} height={iconSize} />
    );
    WrappedIcon.displayName = IconComponent.name || 'WrappedIcon';
    return WrappedIcon;
  };

  if (!fontLoaded) {
    // You might want to render a loading screen or null while the font is loading
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: '#55F358',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: tabBarHeight,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            paddingBottom: screenHeight > NOTCH_DEVICE_HEIGHT_THRESHOLD ? screenHeight * 0.025 : 0,
          },
          default: {
            height: tabBarHeight,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 5,
          },
        }),
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          marginBottom: labelMarginBottom,
          fontFamily: 'Poppins-Regular', // Apply the font family here
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Diary',
          tabBarIcon: wrapIcon(DiaryIcon),
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: 'Programs',
          tabBarIcon: wrapIcon(ProgramsIcon),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: 'Support',
          tabBarIcon: wrapIcon(PremiumIcon),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: wrapIcon(ExercisesIcon),
        }}
      />
    </Tabs>
  );
}