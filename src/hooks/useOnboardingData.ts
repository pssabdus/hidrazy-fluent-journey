import { useState, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { initialOnboardingData } from '@/utils/onboardingData';

const STORAGE_KEY = 'hidrazy_onboarding_data';

export function useOnboardingData() {
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData({ ...initialOnboardingData, ...parsedData });
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
      }
    }
  }, [data, isLoaded]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const clearData = () => {
    setData(initialOnboardingData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    updateData,
    clearData,
    isLoaded,
  };
}