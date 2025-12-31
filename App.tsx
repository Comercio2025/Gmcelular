
import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CustomPage from './pages/CustomPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { StoreConfigProvider } from './contexts/StoreConfigContext';
import { ExchangeRateProvider } from './contexts/ExchangeRateContext';
import DynamicStyles from './components/DynamicStyles';

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
    return (
        <HashRouter>
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
                    <DynamicStyles />
                    <AppContent />
                </DataProvider>
            </ExchangeRateProvider>
        </StoreConfigProvider>
    </AuthProvider>
  );
};

export default App;
