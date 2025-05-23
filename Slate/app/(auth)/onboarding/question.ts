// app/(auth)/onboarding/questions.ts

export type InputComponentType =
  | 'SliderInput'
  | 'DatePicker'
  | 'FlagPicker'
  | 'SingleSelect'
  | 'MultiSelect'
  | 'SingleTextInput'
  | 'PillInput';

type BaseInput = {
  type: InputComponentType;
  key: string;
  label: string;
  note?: string;
  required?: boolean;
};

type SliderInput = BaseInput & {
  type: 'SliderInput';
  min: number;
  max: number;
  unit: string;
  step?: number;
};

type SingleSelectInput = BaseInput & {
  type: 'SingleSelect' | 'MultiSelect';
  options: string[];
};

type FlagPickerInput = BaseInput & {
  type: 'FlagPicker';
};

type DatePickerInput = BaseInput & {
  type: 'DatePicker';
};

type SingleTextInput = BaseInput & {
  type: 'SingleTextInput';
  placeholder?: string;
  multiline?: boolean;
};

type PillInput = BaseInput & {
  type: 'PillInput';
  placeholder?: string;
};

export type OnboardingInput =
  | SliderInput
  | SingleSelectInput
  | FlagPickerInput
  | DatePickerInput
  | SingleTextInput
  | PillInput;

  export type OnboardingStep = {
    key: StepKey;
    question: string; // Replaces 'title'
    inputs: OnboardingInput[];
    note?: string; // Optional global note if it applies to the whole step
    required?: boolean;
  };
  

  export const onboardingSteps: OnboardingStep[] = [
    {
      key: 'height_weight',
      question: 'What are your height and weight?',
      inputs: [
        { type: 'SliderInput', key: 'height', label: 'Height', min: 100, max: 250, step: 1, unit: 'cm' },
        { type: 'SliderInput', key: 'weight', label: 'Weight', min: 30, max: 200, step: 1, unit: 'kg' },
      ],
      required: true,
    },
    {
      key: 'dob',
      question: 'When were you born?',
      inputs: [
        { type: 'DatePicker', key: 'dob', label: 'Date of Birth' },
      ],
      required: true,
    },
    {
      key: 'nation',
      question: 'Where are you from?',
      inputs: [
        { type: 'FlagPicker', key: 'nation', label: 'Nationality or Ethnicity' },
      ],
    },
    {
      key: 'goal',
      question: 'What’s your main fitness goal?',
      inputs: [
        { type: 'SingleSelect', key: 'goal', label: 'Choose one', options: ['gain muscle', 'lose weight', 'cardio', 'general fitness'] },
      ],
      required: true,
    },
    {
      key: 'gender',
      question: 'What’s your gender?',
      inputs: [
        { type: 'SingleSelect', key: 'gender', label: 'Choose one', options: ['male', 'female'] },
      ],
      required: true,
    },
    {
      key: 'statement_budget',
      question: 'Tell us a bit more about your goals',
      inputs: [
        { type: 'SingleTextInput', key: 'motivationStatement', label: 'What motivates you?', multiline:true },
        { type: 'SingleTextInput', key: 'budget', label: 'What’s your budget?' },
      ],
    },
    {
      key: 'health_conditions',
      question: 'Any notable health conditions?',
      inputs: [
        { type: 'PillInput', key: 'healthConditions', label: 'Enter each condition', placeholder: 'e.g. knee pain' },
      ],
    },
    {
      key: 'experience_level',
      question: 'What’s your fitness experience level?',
      inputs: [
        { type: 'SingleSelect', key: 'experienceLevel', label: 'Choose one', options: ['beginner', 'intermediate', 'advanced'] },
      ],
      required: true,
    },
    {
      key: 'intensity_preference',
      question: 'How intense do you prefer your workouts?',
      inputs: [
        { type: 'SingleSelect', key: 'intensityPreference', label: 'Choose one', options: ['low', 'medium', 'high'] },
      ],
      required: true,
    },
  ];
  
  // manual route tyes
export const stepKeys = [
  'height_weight',
  'dob',
  'nation',
  'goal',
  'gender',
  'statement_budget',
  'health_conditions',
  'experience_level',
  'intensity_preference',
  'final_notes',
] as const;

export type StepKey = typeof stepKeys[number];

export default onboardingSteps;
