
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { LayoutDashboard, Package, Tag, Image as ImageIcon, LogOut, Sheet, Settings, Bookmark, ShieldCheck, ToggleRight, Briefcase, FileText } from 'lucide-react';
import { useStoreConfig } from '../contexts/StoreConfigContext';

import Dashboard from '../components/admin/Dashboard';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import BannerManager from '../components/admin/BannerManager';
import BulkManager from '../components/admin/BulkManager';
import StoreSettings from '../components/admin/StoreSettings';
import BrandManager from '../components/admin/BrandManager';
import ConditionManager from '../components/admin/ConditionManager';
import StatusManager from '../components/admin/StatusManager';
import SupplierManager from '../components/admin/SupplierManager';
import PageManager from '../components/admin/PageManager';

const AdminPage: React.FC = () => {
    const { logout } = useAuth();
    const { config } = useStoreConfig();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Produtos', icon: Package },
        { path: '/admin/categories', label: 'Categorias', icon: Tag },
        { path: '/admin/brands', label: 'Marcas', icon: Bookmark },
        { path: '/admin/conditions', label: 'Condições', icon: ShieldCheck },
        { path: '/admin/statuses', label: 'Status', icon: ToggleRight },
        { path: '/admin/suppliers', label: 'Fornecedores', icon: Briefcase },
        { path: '/admin/banners', label: 'Banners', icon: ImageIcon },
        { path: '/admin/pages', label: 'Páginas', icon: FileText },
        { path: '/admin/bulk', label: 'Gerenciar em Lote', icon: Sheet },
        { path: '/admin/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-md flex flex-col">
                <div className="h-20 flex items-center justify-center border-b dark:border-gray-700">
                    <Link to="/"><Logo className="h-12" src={config.logoUrl} /></Link>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {navItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white' 
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t dark:border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                     <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductManager />} />
                        <Route path="/categories" element={<CategoryManager />} />
                        <Route path="/brands" element={<BrandManager />} />
                        <Route path="/conditions" element={<ConditionManager />} />
                        <Route path="/statuses" element={<StatusManager />} />
                        <Route path="/suppliers" element={<SupplierManager />} />
                        <Route path="/banners" element={<BannerManager />} />
                        <Route path="/pages" element={<PageManager />} />
                        <Route path="/bulk" element={<BulkManager />} />
                        <Route path="/settings" element={<StoreSettings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;