// context/OnboardingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


// Define context type
type OnboardingContextType = {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
};

// Create context with correct type, but default as undefined
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Define props for provider (to fix "children: any" error)
type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
  
    useEffect(() => {
      const loadFormData = async () => {
        const stored = await AsyncStorage.getItem('onboardingFormData');
        if (stored) {
          setFormData(JSON.parse(stored));
        }
      };
      loadFormData();
    }, []);
  
    const updateField = (key: string, value: any) => {
      setFormData((prev) => {
        const updated = { ...prev, [key]: value };
        AsyncStorage.setItem('onboardingFormData', JSON.stringify(updated)); // persist on update
        return updated;
      });
    };
  
    return (
      <OnboardingContext.Provider value={{ formData, updateField }}>
        {children}
      </OnboardingContext.Provider>
    );
  };

// Safely consume context (throws error if used outside provider)
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return context;
};

export default OnboardingProvider;
