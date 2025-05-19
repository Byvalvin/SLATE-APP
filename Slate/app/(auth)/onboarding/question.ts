// config file for questions

export type QuestionType = 
  | 'slider'
  | 'single-select'
  | 'flag-picker'
  | 'text-input'
  | 'pill-input';

export interface OnboardingStep {
  key: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for select
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  isNumeric?: boolean;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    key: 'height',
    question: 'What is your height (cm)?',
    type: 'slider',
    min: 100,
    max: 220,
    step: 1,
  },
  {
    key: 'weight',
    question: 'What is your weight (kg)?',
    type: 'slider',
    min: 30,
    max: 200,
    step: 1,
  },
  {
    key: 'age',
    question: 'What is your age?',
    type: 'slider',
    min: 13,
    max: 100,
    step: 1,
  },
  {
    key: 'goal',
    question: 'What is your primary goal?',
    type: 'single-select',
    options: ['Gain Muscle', 'Lose Weight', 'Improve Cardio'],
  },
  {
    key: 'gender',
    question: 'What is your gender?',
    type: 'single-select',
    options: ['Male', 'Female', 'Other'],
  },
  {
    key: 'experience',
    question: 'What is your fitness level?',
    type: 'single-select',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    key: 'intensity',
    question: 'Preferred workout intensity?',
    type: 'single-select',
    options: ['Low', 'Medium', 'High'],
  },
  {
    key: 'nation',
    question: 'What is your nationality?',
    type: 'flag-picker',
  },
  {
    key: 'budget',
    question: 'What is your fitness budget (monthly)?',
    type: 'text-input',
    placeholder: '$50, $0, etc.',
    isNumeric: true,
  },
  {
    key: 'statement',
    question: 'What is your motivation or goal?',
    type: 'text-input',
    placeholder: 'e.g. Get stronger for football...',
  },
  {
    key: 'conditions',
    question: 'Any notable health conditions?',
    type: 'pill-input',
  },
];
