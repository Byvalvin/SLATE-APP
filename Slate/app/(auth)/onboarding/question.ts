// app/(auth)/onboarding/questions.ts

export type InputComponentType =
  | 'SliderInput'
  | 'DatePicker'
  | 'FlagPicker'
  | 'SingleSelect'
  | 'MultiSelect'
  | 'TextInput'
  | 'PillInput';

type BaseInput = {
  type: InputComponentType;
  key: string;
  label: string;
  note?: string;
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

type TextInput = BaseInput & {
  type: 'TextInput';
  placeholder?: string;
};

type PillInput = BaseInput & {
  type: 'PillInput';
};

export type OnboardingInput =
  | SliderInput
  | SingleSelectInput
  | FlagPickerInput
  | DatePickerInput
  | TextInput
  | PillInput;

  export type OnboardingStep = {
    key: StepKey;
    question: string; // Replaces 'title'
    inputs: OnboardingInput[];
    note?: string; // Optional global note if it applies to the whole step
  };
  

export const onboardingSteps: OnboardingStep[] = [
    {
      key: 'height_weight',
      question: 'What are your height and weight?',
      inputs: [
        {
          type: 'SliderInput',
          key: 'height',
          label: 'Height',
          min: 100,
          max: 250,
          step: 1,
          unit: 'cm',
        },
        {
          type: 'SliderInput',
          key: 'weight',
          label: 'Weight',
          min: 30,
          max: 200,
          step: 1,
          unit: 'kg',
        },
      ],
    },
    {
      key: 'dob',
      question: 'When were you born?',
      inputs: [
        {
          type: 'DatePicker',
          key: 'dob',
          label: 'Date of Birth',
        },
      ],
    },
    {
      key: 'ethnicity',
      question: 'Where are you from?',
      inputs: [
        {
          type: 'FlagPicker',
          key: 'ethnicity',
          label: 'Nationality or Ethnicity',
          note: 'This helps us tailor plans based on your background.',
        },
      ],
    },
    {
      key: 'goal',
      question: 'What’s your main fitness goal?',
      inputs: [
        {
          type: 'SingleSelect',
          key: 'goal',
          label: 'Choose one',
          options: ['Gain Muscle', 'Lose Fat', 'Improve Cardio'],
        },
      ],
    },
    {
      key: 'gender',
      question: 'What’s your gender?',
      inputs: [
        {
          type: 'SingleSelect',
          key: 'gender',
          label: 'Choose one',
          options: ['Male', 'Female', 'Other'],
        },
      ],
    },
    {
      key: 'statement_budget',
      question: 'Tell us a bit more about your goals',
      inputs: [
        {
          type: 'TextInput',
          key: 'motivation',
          label: 'What motivates you?',
        },
        {
          type: 'TextInput',
          key: 'budget',
          label: 'What’s your budget?',
        },
      ],
    },
    {
      key: 'health_conditions',
      question: 'Any notable health conditions?',
      inputs: [
        {
          type: 'PillInput',
          key: 'health_conditions',
          label: 'Enter each condition',
          note: 'This helps us avoid recommending harmful exercises.',
        },
      ],
    },
    {
      key: 'experience_level',
      question: 'What’s your fitness experience level?',
      inputs: [
        {
          type: 'SingleSelect',
          key: 'experience',
          label: 'Choose one',
          options: ['Beginner', 'Intermediate', 'Advanced'],
        },
      ],
    },
    {
      key: 'intensity_preference',
      question: 'How intense do you prefer your workouts?',
      inputs: [
        {
          type: 'SingleSelect',
          key: 'intensity',
          label: 'Choose one',
          options: ['Light', 'Moderate', 'High'],
        },
      ],
    },
    {
      key: 'final_notes',
      question: 'Is there anything else we should know?',
      inputs: [
        {
          type: 'TextInput',
          key: 'notes',
          label: 'Final thoughts',
        },
      ],
    },
  ];
  
  // manual route tyes
export const stepKeys = [
  'height_weight',
  'dob',
  'ethnicity',
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
