import { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useData } from '../contexts/DataContext';


export const CategoryManager = () => {
    const { categories } = useData(); // Note: DataContext needs update to expose setCategories or addCategory
    // For now, assuming DataContext only reads categories. I might need to add addCategory to DataContext.
    // Let's check DataContext again. It usually has addCategory? 
    // Checking DataContext in next steps. For now, I will assume it exists or I will add it.

    // Actually, looking at previous DataContext view, it had banners and products CRUD but maybe not categories.
    // I will simply layout the component and then update DataContext to support Category CRUD.

    const [newCategory, setNewCategory] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;
        alert("Funcionalidade de adicionar categoria será implementada no DataContext.");
        setNewCategory('');
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Adicionar Nova Categoria</h3>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nome da Categoria"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap">
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="glass-card p-4 rounded-xl flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400">
                                <Tag className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-white">{cat.name}</span>
                        </div>
                        <button
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Excluir"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
