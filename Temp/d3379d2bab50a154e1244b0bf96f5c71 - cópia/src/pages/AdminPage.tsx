import React, { useState } from 'react';
import { mockStoreConfig } from '../../data/mockData';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        // Implement logout logic here
        window.location.hash = '/login';
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-wider">Painel GM</h2>
                </div>

                <nav className="flex-grow py-6">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 border-r-4 border-blue-500' : ''}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'products' ? 'bg-slate-800 border-r-4 border-blue-500' : ''}`}
                    >
                        <Package className="w-5 h-5 mr-3" />
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'settings' ? 'bg-slate-800 border-r-4 border-blue-500' : ''}`}
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        Configurações
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-semibold"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                    <div className="text-gray-500 text-sm">Bem-vindo, Admin</div>
                </header>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                    {activeTab === 'dashboard' && (
                        <div className="text-center py-12">
                            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                                <LayoutDashboard className="w-12 h-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Visão Geral</h3>
                            <p className="text-gray-500">Selecione uma opção no menu lateral para começar a gerenciar sua loja.</p>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Gerenciar Produtos</h3>
                            <p className="text-gray-500 mb-4">Lista de produtos cadastrados (integração futura com backend).</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="p-4 font-semibold text-gray-600">Nome</th>
                                            <th className="p-4 font-semibold text-gray-600">Preço</th>
                                            <th className="p-4 font-semibold text-gray-600">Status</th>
                                            <th className="p-4 font-semibold text-gray-600">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="p-4">Exemplo de Produto</td>
                                            <td className="p-4">R$ 1.000,00</td>
                                            <td className="p-4"><span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativo</span></td>
                                            <td className="p-4 text-blue-600 hover:underline cursor-pointer">Editar</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-md">
                            <h3 className="text-lg font-semibold mb-6">Configurações da Loja</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={mockStoreConfig.storeName} readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={mockStoreConfig.whatsappNumber} readOnly />
                                </div>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Salvar Alterações</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
