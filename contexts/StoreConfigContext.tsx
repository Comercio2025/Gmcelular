
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StoreConfig } from '../types';
import { initialStoreConfig } from '../data/mockData';

interface StoreConfigContextType {
  config: StoreConfig;
  setConfig: (config: StoreConfig) => void;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'storeConfig';

export const StoreConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<StoreConfig>(() => {
    try {
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedConfig ? JSON.parse(savedConfig) : initialStoreConfig;
    } catch (error) {
      console.error("Failed to parse store config from localStorage", error);
      return initialStoreConfig;
    }
  });

  const setConfig = (newConfig: StoreConfig) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
      setConfigState(newConfig);
    } catch (error) {
      console.error("Failed to save store config to localStorage", error);
    }
  };

  return (
    <StoreConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider');
  }
  return context;
};
