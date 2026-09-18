import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from '../components/AdminLogin';
import { useData } from '../contexts/DataContext';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import { BannerManager } from '../components/BannerManager';
import { SettingsManager } from '../components/SettingsManager';
import { PagesManager } from '../components/PagesManager';
import { ArticlesManager } from '../components/ArticlesManager';
import FiltersManager from '../components/FiltersManager';
import { ImportExport } from '../components/ImportExport';
import { Registrations } from '../components/Registrations'; // New import
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { PromotionsManager } from '../components/PromotionsManager';
import { Plus, Package, ShoppingBag, Users, Zap } from 'lucide-react'; // Icons
import type { Product } from '../types';

export const AdminPage = () => {
    const { isAuthenticated } = useAuth();
    const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'registrations' | 'banners' | 'promotions' | 'articles' | 'settings' | 'pages' | 'tools' | 'filters'>('dashboard'); // Updated type
    const { products, addProduct, updateProduct, deleteProduct } = useData();

    // Product Form State
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background pt-20 px-4 relative">
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                </div>
                <AdminLogin />
            </div>
        );
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsProductFormOpen(true);
    };

    const handleDuplicateProduct = (product: Product) => {
        const duplicatedProduct = {
            ...product,
            id: '', // Clear ID to create new
            name: `${product.name} (Cópia)`,
            active: false // Default to inactive so user can review
        };
        setEditingProduct(duplicatedProduct);
        setIsProductFormOpen(true);
    };

    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            updateProduct(product);
        } else {
            addProduct({ ...product, id: Date.now().toString() });
        }
        setIsProductFormOpen(false);
        setEditingProduct(null);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-surface p-6 border border-white/10 flex items-center gap-4 shadow-2xl">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{products.length}</h3>
                                    <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Produtos Cadastrados</p>
                                </div>
                            </div>
                            <div className="bg-surface p-6 border border-white/10 flex items-center gap-4 shadow-2xl">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{products.filter(p => p.status === 'por_encomenda').length}</h3>
                                    <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Sob Encomenda</p>
                                </div>
                            </div>
                            <div className="bg-surface p-6 border border-white/10 flex items-center gap-4 shadow-2xl">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Admin</h3>
                                    <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Usuário Logado</p>
                                </div>
                            </div>
                        </div>

                        <AnalyticsDashboard />

                        <div>
                            <h3 className="text-sm font-mono font-bold text-blue-400 mb-6 uppercase tracking-[0.3em]">Ações Rápidas_</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleCreateProduct}
                                    className="bg-surface p-6 border border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-4 text-left group"
                                >
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg shadow-blue-500/10">
                                        <Plus className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Adicionar Produto</h4>
                                        <p className="text-xs text-gray-400 font-mono uppercase">Cadastre um novo item</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveSection('promotions')}
                                    className="bg-surface p-6 border border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-4 text-left group"
                                >
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg shadow-blue-500/10">
                                        <Zap className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Gerenciar Promoções</h4>
                                        <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Atualizar encarte digital</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {isProductFormOpen && (
                            <ProductForm
                                onClose={() => setIsProductFormOpen(false)}
                                onSave={handleSaveProduct}
                                initialProduct={editingProduct}
                            />
                        )}
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white font-display tracking-tight uppercase">Gerenciar Produtos_</h2>
                            <button onClick={handleCreateProduct} className="btn-primary border-2 border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all rounded-none uppercase font-mono font-bold tracking-widest text-xs px-6 py-3">
                                [ + Novo Produto ]
                            </button>
                        </div>
                        <div className="bg-surface p-6 border border-white/10 shadow-2xl">
                            <ProductTable
                                products={products}
                                onEdit={handleEditProduct}
                                onDuplicate={handleDuplicateProduct}
                                onDelete={deleteProduct}
                            />
                        </div>
                        {isProductFormOpen && (
                            <ProductForm
                                onClose={() => setIsProductFormOpen(false)}
                                onSave={handleSaveProduct}
                                initialProduct={editingProduct}
                            />
                        )}
                    </div>
                );
            case 'registrations': // Renamed
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Gerenciar Cadastros_</h2>
                        <Registrations />
                    </div>
                );
            case 'banners':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Gerenciar Banners_</h2>
                        <BannerManager />
                    </div>
                );
            case 'promotions':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Promoções_</h2>
                        <PromotionsManager />
                    </div>
                );
            case 'articles':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Artigos_</h2>
                        <ArticlesManager />
                    </div>
                );
            case 'tools':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Ferramentas_</h2>
                        <ImportExport />
                    </div>
                );
            case 'settings':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Configurações da Loja_</h2>
                        <SettingsManager />
                    </div>
                );
            case 'pages':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-white font-display mb-8 uppercase tracking-tight">Páginas do Site_</h2>
                        <PagesManager />
                    </div>
                );
            case 'filters':
                return (
                    <div className="animate-in fade-in duration-700">
                        <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tighter uppercase flex items-center gap-4">
                            Filtros Inteligentes_
                            <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                        </h2>
                        <FiltersManager />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout activeSection={activeSection} onNavigate={(section) => setActiveSection(section)}>
            {renderContent()}
        </AdminLayout>
    );
};
