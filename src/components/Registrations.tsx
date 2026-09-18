import { useState } from 'react';
import { Tag, Book, Heart, Layers } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { GenericManager } from './GenericManager';

export const Registrations = () => {
    const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'conditions' | 'statuses'>('categories');
    const {
        categories, addCategory, updateCategory, deleteCategory,
        brands, addBrand, updateBrand, deleteBrand,
        conditions, addCondition, updateCondition, deleteCondition,
        statuses, addStatus, updateStatus, deleteStatus
    } = useData();

    const tabs = [
        { id: 'categories', label: 'Categorias', icon: Tag },
        { id: 'brands', label: 'Marcas', icon: Heart },
        { id: 'conditions', label: 'Condições', icon: Layers },
        { id: 'statuses', label: 'Status', icon: Book },
    ] as const;

    const renderContent = () => {
        switch (activeTab) {
            case 'categories':
                return (
                    <GenericManager
                        title="Categoria"
                        placeholder="Nome da Categoria"
                        items={categories}
                        onAdd={addCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                    />
                );
            case 'brands':
                return (
                    <GenericManager
                        title="Marca"
                        placeholder="Nome da Marca"
                        items={brands}
                        onAdd={addBrand}
                        onUpdate={updateBrand}
                        onDelete={deleteBrand}
                    />
                );
            case 'conditions':
                return (
                    <GenericManager
                        title="Condição"
                        placeholder="Ex: Novo, Usado..."
                        items={conditions}
                        onAdd={addCondition}
                        onUpdate={updateCondition}
                        onDelete={deleteCondition}
                    />
                );
            case 'statuses':
                return (
                    <GenericManager
                        title="Status"
                        placeholder="Ex: Ativo, Inativo..."
                        items={statuses}
                        onAdd={addStatus}
                        onUpdate={updateStatus}
                        onDelete={deleteStatus}
                        type="status"
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white font-display mb-4">Cadastros Gerais</h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-t-xl flex items-center gap-2 transition-colors ${activeTab === tab.id
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-surface/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {renderContent()}
            </div>
        </div>
    );
};
