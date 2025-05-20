import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import onboardingSteps  from './question';

import OnboardingHeader from './components/OnboardingHeader';
import SliderInput from './components/SliderInput';
import DatePicker from './components/DatePicker';
import FlagPicker from './components/FlagPicker';
import SingleSelect from './components/SingleSelect';
import MultiSelect from './components/MultiSelect';
import TextField from './components/TextInput';
import PillInput from './components/PillInput';
import Note from './components/Note';
import NextButton from './components/NextButton';

const OnboardingStepScreen = () => {
  const { step } = useLocalSearchParams();
  const router = useRouter();

  const stepIndex = onboardingSteps.findIndex((s) => s.key === step);
  const stepData = onboardingSteps[stepIndex];

  if (!stepData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invalid onboarding step.</Text>
      </View>
    );
  }

  const goToNextStep = () => {
    if (stepIndex + 1 < onboardingSteps.length) {
      const nextStepKey = onboardingSteps[stepIndex + 1].key;
      // Use the correct path to handle dynamic step routing
      router.push(`/onboarding/${nextStepKey}`);
      
    } else {
      Alert.alert('All done!', 'You’ve completed onboarding.');
      // Navigate to main app or home screen
      // router.replace('/home');
    }
  };

  const renderInput = (input: any) => {
    switch (input.type) {
      case 'SliderInput':
        return <SliderInput key={input.key} {...input} />;
      case 'DatePicker':
        return <DatePicker key={input.key} {...input} />;
      case 'FlagPicker':
        return <FlagPicker key={input.key} {...input} />;
      case 'SingleSelect':
        return <SingleSelect key={input.key} {...input} />;
      case 'MultiSelect':
        return <MultiSelect key={input.key} {...input} />;
      case 'TextInput':
        return <TextField key={input.key} {...input} />;
      case 'PillInput':
        return <PillInput key={input.key} {...input} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        currentStep={stepIndex}
        totalSteps={onboardingSteps.length}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Let's get you started</Text>
        <Text style={styles.question}>{stepData.question}</Text>

        {stepData.inputs.map(renderInput)}

        {stepData.note && <Note text={stepData.note} />}
      </ScrollView>

      <NextButton onPress={goToNextStep} />
    </View>
  );
};

export default OnboardingStepScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  intro: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    marginBottom: 6,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
