import { useLocalSearchParams, useRouter } from 'expo-router';
import { onboardingSteps } from './questions';
import SliderInput from './components/SliderInput';
import SingleSelect from './components/SingleSelect';
// ... import others

export default function StepScreen() {
  const { step } = useLocalSearchParams();
  const router = useRouter();

  const index = parseInt(step as string);
  const currentStep = onboardingSteps[index];

  const handleNext = (value: any) => {
    // Save value to context/store
    // navigate to next step or complete onboarding
    if (index + 1 < onboardingSteps.length) {
      router.push(`/onboarding/${index + 1}`);
    } else {
      // Submit profile data to backend
    }
  };

  if (!currentStep) return null;

  const { type } = currentStep;

  switch (type) {
    case 'slider':
      return <SliderInput {...currentStep} onNext={handleNext} />;
    case 'single-select':
      return <SingleSelect {...currentStep} onNext={handleNext} />;
    // etc.
  }

  return null;
}
