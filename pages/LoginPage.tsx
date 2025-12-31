
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { config } = useStoreConfig();

  const handleLogin = () => {
    if (login()) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <Logo className="h-20 w-auto" src={config.logoUrl} />
          <h2 className="mt-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
            Área do Administrador
          </h2>
        </div>
        <div className="mt-8">
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Acessar Painel
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
