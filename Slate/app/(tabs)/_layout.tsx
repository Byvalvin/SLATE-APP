import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native'; // Import Dimensions
import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
//import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SvgProps } from 'react-native-svg';

import DiaryIcon from '../../assets/icons/Diary';
import ProgressIcon from '../../assets/icons/progress';
import ProgramsIcon from '../../assets/icons/Dumbell';
import PremiumIcon from '../../assets/icons/premium';
import ExercisesIcon from '../../assets/icons/Exercises';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

// Calculate relative sizes for icons and labels
const iconSize = screenWidth * 0.06; // Example: Icon size is 7% of screen width
const labelFontSize = screenWidth * 0.025; // Example: Label font size is 3% of screen width
const labelMarginBottom = screenHeight * 0.005; // Example: Margin below label is 0.5% of screen height


// ✅ New .tsx icon components


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const wrapIcon = (IconComponent: React.FC<SvgProps>) => {
    const WrappedIcon = ({ color }: { color: string }) => (
      // Use calculated iconSize
      <IconComponent color={color} width={iconSize} height={iconSize} />
    );
    WrappedIcon.displayName = IconComponent.name || 'WrappedIcon';
    return WrappedIcon;
  };


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground, // Assuming TabBarBackground handles its own styling if needed, or relies on tabBarStyle background
        tabBarActiveTintColor: '#55F358',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Be cautious with absolute positioning for tab bars, it can sometimes overlap content
            height: 85, // Fixed height
            backgroundColor: '#fff',
            borderTopWidth: 0,
            // You might want to add paddingBottom here for safe area on notched devices
             paddingBottom: Platform.OS === 'ios' ? screenHeight > 800 ? 20 : 0 : 0 // Example: Adjust for iPhone notch
          },
          default: { // Android and other platforms
            height: 85, // Fixed height
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 5,
          },
        }),
        tabBarLabelStyle: {
          fontSize: labelFontSize, // Use calculated labelFontSize
          marginBottom: labelMarginBottom, // Use calculated labelMarginBottom
        },
        // Optional: Adjust icon position if needed, often handled by default or with custom tabBarButton/Icon container styles
        // tabBarIconStyle: {
        //   marginTop: 5, // Example: push icon down slightly
        // },
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
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: wrapIcon(ProgressIcon),
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
          title: 'Premium',
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