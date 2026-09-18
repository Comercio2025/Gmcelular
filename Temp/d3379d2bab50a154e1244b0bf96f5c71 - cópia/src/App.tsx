
import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CustomPage from './pages/CustomPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { StoreConfigProvider, useStoreConfig } from './contexts/StoreConfigContext';
import { ExchangeRateProvider } from './contexts/ExchangeRateContext';
import DynamicStyles from './components/DynamicStyles';
import { LoaderCircle } from 'lucide-react';

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
    const { loading: isDataLoading, error: dataError } = useData();
    const { loading: isConfigLoading } = useStoreConfig();

    if (isDataLoading || isConfigLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background text-slate-200">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-4 text-lg">Carregando informações...</p>
            </div>
        );
    }
    
    if(dataError) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background text-red-400">
                <p className="text-lg">Erro ao carregar os dados do site.</p>
                <p className="text-sm mt-2">{dataError}</p>
            </div>
        )
    }

    return (
        <HashRouter>
            <DynamicStyles />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/page/:slug" element={<CustomPage />} />
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </HashRouter>
    )
}


const App: React.FC = () => {
  return (
    <AuthProvider>
        <StoreConfigProvider>
            <ExchangeRateProvider>
                <DataProvider>
                    <AppContent />
                </DataProvider>
            </ExchangeRateProvider>
        </StoreConfigProvider>
    </AuthProvider>
  );
};

export default App;
