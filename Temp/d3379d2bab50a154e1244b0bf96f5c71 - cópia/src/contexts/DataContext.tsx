import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DataContextType {
    data: any;
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
        // Placeholder para busca de dados
        setLoading(true);
        try {
            // Simulação ou chamada real deveria estar aqui
            setLoading(false);
        } catch (err) {
            setError("Erro ao carregar dados.");
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <DataContext.Provider value={{ data, loading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
