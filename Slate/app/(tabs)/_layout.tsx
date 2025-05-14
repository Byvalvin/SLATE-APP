import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SvgProps } from 'react-native-svg';


// ✅ New .tsx icon components
import DiaryIcon from '../../assets/icons/Diary';
import ProgressIcon from '../../assets/icons/progress';
import ProgramsIcon from '../../assets/icons/Dumbell';
import PremiumIcon from '../../assets/icons/premium';
import ExercisesIcon from '../../assets/icons/Exercises';

export default function TabLayout() {
  const colorScheme = useColorScheme();

 const wrapIcon = (IconComponent: React.FC<SvgProps>) => {
  const WrappedIcon = ({ color }: { color: string }) => (
    <IconComponent color={color} width={30} height={30} />
  );
  WrappedIcon.displayName = IconComponent.name || 'WrappedIcon';
  return WrappedIcon;
};


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
            height: 85,
            backgroundColor: '#fff',
            borderTopWidth: 0,
          },
          default: {
            height: 85,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 5,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
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
