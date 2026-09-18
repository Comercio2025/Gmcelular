
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ExchangeRateContextType {
  rate: number | null;
  loading: boolean;
  error: string | null;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export const ExchangeRateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
        if (!response.ok) {
          throw new Error('Falha ao buscar a taxa de câmbio');
        }
        const data = await response.json();
        const usdToBrlRate = data.usd?.brl;
        if (typeof usdToBrlRate !== 'number') {
            throw new Error('Formato de taxa inválido na resposta da API');
        }
        setRate(usdToBrlRate);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
        setRate(5.25); 
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return (
    <ExchangeRateContext.Provider value={{ rate, loading, error }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
};
