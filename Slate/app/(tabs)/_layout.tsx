import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
//import { Colors } from '../../constants/Colors'; // Assuming Colors is not used in this snippet
//import { useColorScheme } from '../../hooks/useColorScheme'; // Assuming useColorScheme is a valid hook
import { SvgProps } from 'react-native-svg';

// Import your SVG icon components
import DiaryIcon from '../../assets/icons/Diary';
//import ProgressIcon from '../../assets/icons/progress';
import ProgramsIcon from '../../assets/icons/Dumbell';
import PremiumIcon from '../../assets/icons/premium';
import ExercisesIcon from '../../assets/icons/Exercises';

// Get screen dimensions once
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate relative sizes for icons and labels based on screen dimensions
// These values are examples and can be adjusted for optimal appearance
const iconSize = screenWidth * 0.065; // Icon size is 6.5% of screen width
const labelFontSize = screenWidth * 0.028; // Label font size is 2.8% of screen width
const labelMarginBottom = screenHeight * 0.008; // Margin below label is 0.8% of screen height
const tabBarHeight = screenHeight * 0.09; // Tab bar height is 10% of screen height

// Define a threshold for "notched" devices, e.g., iPhones with a notch
// This is an approximation; a more robust solution might involve `react-native-safe-area-context`
const NOTCH_DEVICE_HEIGHT_THRESHOLD = 800;

export default function TabLayout() {
  //const colorScheme = useColorScheme(); // Assuming this hook provides 'light' or 'dark'

  // Helper function to wrap SVG icon components, passing color and calculated size
  const wrapIcon = (IconComponent: React.FC<SvgProps>) => {
    const WrappedIcon = ({ color }: { color: string }) => (
      <IconComponent color={color} width={iconSize} height={iconSize} />
    );
    WrappedIcon.displayName = IconComponent.name || 'WrappedIcon'; // Set displayName for better debugging
    return WrappedIcon;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all tab screens
        tabBarButton: HapticTab, // Use a custom HapticTab component for tab buttons
        tabBarBackground: TabBarBackground, // Use a custom TabBarBackground component
        tabBarActiveTintColor: '#55F358', // Color for active tab icons and labels
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Absolute positioning for iOS tab bar
            height: tabBarHeight, // Use calculated height
            backgroundColor: '#fff', // White background
            borderTopWidth: 0, // No top border
            // Adjust paddingBottom for safe area on notched iOS devices
            paddingBottom: screenHeight > NOTCH_DEVICE_HEIGHT_THRESHOLD ? screenHeight * 0.025 : 0, // 2.5% of screen height for notch padding
          },
          default: { // Styles for Android and other platforms
            height: tabBarHeight, // Use calculated height
            backgroundColor: '#fff', // White background
            borderTopWidth: 0, // No top border
            elevation: 5, // Shadow for Android
          },
        }),
        tabBarLabelStyle: {
          fontSize: labelFontSize, // Use calculated label font size
          marginBottom: labelMarginBottom, // Use calculated label margin bottom
        },
        // tabBarIconStyle can be used here if you need to adjust icon positioning within its container
        // For example:
        // tabBarIconStyle: {
        //   marginTop: screenHeight * 0.005, // Example: push icon down slightly by 0.5% of screen height
        // },
      }}
    >
      {/* Define each tab screen */}
      <Tabs.Screen
        name="index" // Route name for the tab
        options={{
          title: 'Diary', // Title displayed below the icon
          tabBarIcon: wrapIcon(DiaryIcon), // Wrapped icon component
        }}
      />
      {/*
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: wrapIcon(ProgressIcon),
        }}
      />
      */}
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
