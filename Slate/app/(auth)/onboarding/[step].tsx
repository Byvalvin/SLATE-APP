import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OnboardingInput, StepKey, onboardingSteps } from './question';

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
import { useState } from 'react';


// Define a structure to hold values by input key
type FormValues = Record<string, any>;

const OnboardingStepScreen = () => {
  const { step } = useLocalSearchParams();
  const router = useRouter();

  const stepIndex = onboardingSteps.findIndex((s) => s.key === step);
  const stepData = onboardingSteps[stepIndex];

  const [formValues, setFormValues] = useState<FormValues>({});

  if (!stepData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invalid onboarding step.</Text>
      </View>
    );
  }

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const goToNextStep = () => {
    if (stepIndex + 1 < onboardingSteps.length) {
      const nextStepKey = onboardingSteps[stepIndex + 1].key;
      router.push(`/onboarding/${nextStepKey}`);
    } else {
      Alert.alert('All done!', 'You’ve completed onboarding.');
    }
  };

  const renderInput = (input: OnboardingInput) => {
    const { key, ...rest } = input;
    const commonProps = {
      key,
      value: formValues[key] ?? '', // Defaults for different types can be handled here
      onChange: (val: any) => handleInputChange(key, val),
    };

    switch (input.type) {
      case 'SliderInput':
        return (
          <SliderInput
            key={key}
            label={input.label}
            value={formValues[key] ?? input.min}
            min={input.min}
            max={input.max}
            step={input.step}
            unit={input.unit}
            onChange={(val) => setFormValues((prev) => ({ ...prev, [key]: val }))}
          />
        );
      case 'DatePicker':
        return (
          <CustomDatePicker
            key={key}
            label={input.label}
            value={formValues[key] ?? new Date()}
            onChange={(val) => setFormValues((prev) => ({...prev, [key]: val}))}
          />
        );

      case 'FlagPicker':
        return (
          <FlagPicker
            key={key}
            label={input.label}
            value={formValues[key] ?? ''}
            onChange={(val) => setFormValues((prev) => ({ ...prev, [key]: val }))}
          />
        );
      case 'SingleSelect':
        return (
          <SingleSelect
            key={key}
            label={input.label}
            options={input.options}
            value={formValues[key] ?? ''}
            onChange={(val) => handleInputChange(key, val)}
          />
        );

      case 'MultiSelect':
        return (
          <MultiSelect
            key={key}
            label={input.label}
            options={input.options}
            value={formValues[key] ?? []} // Default to empty array
            onChange={(val) => handleInputChange(key, val)}
          />
        );

      case 'SingleTextInput':
        return (
          <SingleTextInput
            key={key}
            label={input.label}
            placeholder={input.placeholder}
            value={formValues[key] ?? ''}
            onChangeText={(val) => handleInputChange(key, val)}
            multiline={!!input.multiline} // Pass this if supported in your input schema
          />
        );
      
      case 'PillInput':
        return (
          <PillInput
            key={key}
            label={input.label}
            placeholder={input.placeholder}
            value={formValues[key] ?? []}
            onChange={(val) => handleInputChange(key, val)}
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
