import { useState, type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, Image, Settings, LogOut, FileSpreadsheet, FileText, Filter, ChevronLeft, ChevronRight, LayoutDashboard, List, Zap, Newspaper } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
    activeSection: 'dashboard' | 'products' | 'registrations' | 'banners' | 'promotions' | 'articles' | 'settings' | 'pages' | 'tools' | 'filters';
    onNavigate: (section: 'dashboard' | 'products' | 'registrations' | 'banners' | 'promotions' | 'articles' | 'settings' | 'pages' | 'tools' | 'filters') => void;
}

export const AdminLayout = ({ children, activeSection, onNavigate }: AdminLayoutProps) => {
    const { logout } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'products', label: 'Produtos', icon: Package },
        { id: 'promotions', label: 'Promoções', icon: Zap },
        { id: 'articles', label: 'Artigos', icon: Newspaper },
        { id: 'registrations', label: 'Cadastros', icon: List },
        { id: 'banners', label: 'Banners', icon: Image },
        { id: 'pages', label: 'Páginas', icon: FileText },
        { id: 'filters', label: 'Filtros Pro', icon: Filter },
        { id: 'tools', label: 'Ferramentas', icon: FileSpreadsheet },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ] as const;

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row text-white">
            {/* Sidebar */}
            <aside className={`bg-surface border-r border-white/10 flex-shrink-0 shadow-2xl z-10 transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-full md:w-64'}`}>
                <div className={`p-6 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isSidebarCollapsed && <span className="font-display font-bold text-xl text-blue-400 tracking-tighter">ADMIN <span className="text-[10px] text-blue-500/50">v2</span></span>}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                        title={isSidebarCollapsed ? "Expandir" : "Recolher"}
                    >
                        {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-grow">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} py-3 rounded-none border-l-2 transition-all ${activeSection === item.id
                                ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(0,123,255,0.1)]'
                                : 'border-transparent text-gray-400 hover:bg-surface/5 hover:text-white'
                                }`}
                            title={isSidebarCollapsed ? item.label : ''}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors`}
                        title={isSidebarCollapsed ? "Sair" : ""}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto h-screen relative bg-background">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
