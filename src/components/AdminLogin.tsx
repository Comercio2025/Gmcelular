import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

export const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setError('');
        } else {
            setError('Senha incorreta. Tente novamente.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 glass-card rounded-2xl border border-white/10">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/40">
                    <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-display">Acesso Restrito</h2>
                <p className="text-gray-400 mt-2 text-sm">Área exclusiva para gerenciamento.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha de administrador"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-primary transition-all text-center tracking-widest"
                    />
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full btn-primary group"
                >
                    <span>Acessar Painel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};
