// app/(auth)/onboarding/[step].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onboardingSteps, OnboardingInput } from './question';

import { useOnboarding } from './context/OnboardingContext';

import OnboardingHeader from './components/OnboardingHeader';
import SliderInput from './components/SliderInput';
import CustomDatePicker from './components/DatePicker';
import FlagPicker from './components/FlagPicker';
import SingleSelect from './components/SingleSelect';
import MultiSelect from './components/MultiSelect';
import SingleTextInput from './components/SingleTextInput';
import PillInput from './components/PillInput';
import Note from './components/Note';
import NextButton from './components/NextButton';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitOnboarding } from '@/utils/profile';
import { server } from '@/constants/API';

const OnboardingStepScreen = () => {
  const { step } = useLocalSearchParams();
  const router = useRouter();
  const { formData, updateField } = useOnboarding();

  const stepIndex = onboardingSteps.findIndex((s) => s.key === step);
  const stepData = onboardingSteps[stepIndex];
  
//   console.log('Step:', step);
// console.log('StepData:', stepData);


  if (!stepData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invalid onboarding step.</Text>
      </View>
    );
  }
  
  const allRequiredAnswered = () => {
    if (!stepData.required) return true;

    return stepData.inputs.every((input) => {
      const val = formData[input.key];
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      return val !== undefined && val !== null && val !== '';
    });
  };


  const goToNextStep = async () => {
    if ( stepIndex + 1 < onboardingSteps.length) {
      await AsyncStorage.setItem('onboardingFormData', JSON.stringify(formData));

      const nextStepKey = onboardingSteps[stepIndex + 1].key;
      router.push(`/onboarding/${nextStepKey}`);
    } else {
      try {
        console.log('Final Form Data:', formData);
        Alert.alert('All done!', 'You’ve completed onboarding.');
        //🔄 Replace with actual backend API call
        await submitOnboarding(`${server}/api/profile/`,formData);
  
        Alert.alert('All done!', 'You’ve completed onboarding.');
  
        // Optional: navigate to home or dashboard
        router.replace('/(tabs)');
      } catch (err) {
        Alert.alert('Error', 'Something went wrong during submission.');
        console.error('Submission failed:', err);
      }
    }
  };
  

  const renderInput = (input: OnboardingInput) => {
    const { key } = input;

    switch (input.type) {
      case 'SliderInput':
        return (
          <SliderInput
            key={key}
            label={input.label}
            value={formData[key] ?? input.min} // Initial value
            min={input.min}
            max={input.max}
            step={input.step}
            unit={input.unit}
            onChangeEnd={(val) => updateField(key, val)} // Save to context once done
          />

        );
      

      case 'DatePicker':
        return (
          <CustomDatePicker
            key={key}
            label={input.label}
            value={formData[key] ?? new Date()}
            onChange={(val) => updateField(key, val)}
          />
        );

      case 'FlagPicker':
        return (
          <FlagPicker
            key={key}
            label={input.label}
            value={formData[key] ?? ''}
            onChange={(val) => updateField(key, val)}
          />
        );

      case 'MultiSelect':
        return (
          <MultiSelect
            key={key}
            label={input.label}
            options={input.options}
            value={formData[key] ?? []}
            onChange={(val) => updateField(key, val)}
          />
        );
      
      case 'SingleSelect':
        return (
          <SingleSelect
            key={key}
            label={input.label}
            options={input.options}
            value={formData[key] ?? ''}
            onChange={(val) => updateField(key, val)}
          />
        );
        
      
      case 'SingleTextInput':
        return (
          <SingleTextInput
            key={key}
            label={input.label}
            placeholder={input.placeholder}
            multiline={!!input.multiline}
            value={formData[key] ?? ''}
            onChangeText={(val) => updateField(key, val)}
          />
        );

      case 'PillInput':
        return (
          <PillInput
            key={key}
            label={input.label}
            placeholder={input.placeholder}
            value={formData[key] ?? []}
            onChange={(val) => updateField(key, val)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader currentStep={stepIndex} totalSteps={onboardingSteps.length} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Lets get you started</Text>
        <Text style={styles.question}>{stepData.question}</Text>

        {stepData.inputs.map(renderInput)}

        {stepData.note && <Note text={stepData.note} />}
      </ScrollView>

      <NextButton onPress={goToNextStep} disabled={!allRequiredAnswered()} />

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


/*
https://reactnavigation.org/docs/typescript/?config=dynamic
*/