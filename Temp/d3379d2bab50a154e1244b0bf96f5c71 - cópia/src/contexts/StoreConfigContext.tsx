import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { StoreConfig } from '../types';
import { mockStoreConfig } from '../data/mockData';

const fallbackConfig: StoreConfig = {
    storeName: "GM Celular", slogan: "Carregando...", logoUrl: '', address: "",
    whatsappNumber: "", instagramHandle: "",
    colors: { primary: '#007BFF', secondary: '#0A192F' }, font: 'Inter',
    announcementBar: { text: '', enabled: false }, headerMenu: [],
};

interface StoreConfigContextType {
  config: StoreConfig;
  setConfig: (config: StoreConfig) => Promise<void>;
  loading: boolean;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export const StoreConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<StoreConfig>(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = () => {
        setLoading(true);
        // Simulate fetching config from an API
        setTimeout(() => {
            try {
                setConfigState(mockStoreConfig);
            } catch (error) {
                console.error("Failed to load store config from mock data", error);
            } finally {
                setLoading(false);
            }
        }, 300); // Simulate network delay
    };
    fetchConfig();
  }, []);


  const setConfig = async (newConfig: StoreConfig) => {
    // Optimistic update for UI responsiveness
    setConfigState(newConfig);
    
    // Simulate saving to a backend
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("Mock config saved:", newConfig);
            // In a real app, this would be an API call.
            // For a better mock experience, you could persist to localStorage.
            resolve();
        }, 200);
    });
  };

  return (
    <StoreConfigContext.Provider value={{ config, setConfig, loading }}>
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
