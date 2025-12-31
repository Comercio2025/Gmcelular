
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Category } from '../../types';
import Modal from './Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', parentId: '' });

    useEffect(() => {
        if (editingCategory) {
            setFormData({ name: editingCategory.name, parentId: editingCategory.parentId || '' });
        } else {
            setFormData({ name: '', parentId: '' });
        }
    }, [editingCategory]);
    
    const handleOpenModal = (category: Category | null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name) return;
        const dataToSave = { name: formData.name, parentId: formData.parentId || undefined };

        if (editingCategory) {
            updateCategory(editingCategory.id, dataToSave);
        } else {
            addCategory(dataToSave);
        }
        handleCloseModal();
    };

    const hierarchicalCategories = useMemo(() => {
        // Fix: Define a recursive type for category nodes to ensure type safety in tree traversal.
        type CategoryNode = Category & { children: CategoryNode[] };

        const categoryMap = new Map<string, CategoryNode>(
            categories.map(c => [c.id, { ...c, children: [] }])
        );
        const tree: CategoryNode[] = [];

        categoryMap.forEach(cat => {
            if (cat.parentId && categoryMap.has(cat.parentId)) {
                categoryMap.get(cat.parentId)!.children.push(cat);
            } else {
                tree.push(cat);
            }
        });

        const flatList: { category: Category, level: number }[] = [];
        const traverse = (nodes: CategoryNode[], level: number) => {
            nodes.forEach(node => {
                flatList.push({ category: node, level });
                if (node.children.length) {
                    traverse(node.children, level + 1);
                }
            });
        };
        traverse(tree, 0);
        return flatList;
    }, [categories]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Plus size={20} className="mr-2"/> Adicionar Categoria
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Nome da Categoria</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hierarchicalCategories.map(({ category, level }) => (
                            <tr key={category.id} className="border-b dark:border-gray-700">
                                <td className="p-4" style={{ paddingLeft: `${1 + level * 2}rem` }}>
                                    {level > 0 && <span className="mr-2">-</span>} {category.name}
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(category)} className="text-primary hover:opacity-75"><Edit size={20} /></button>
                                    <button onClick={() => window.confirm('Tem certeza?') && deleteCategory(category.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Editar Categoria' : 'Adicionar Categoria'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nome da categoria" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                     <select value={formData.parentId} onChange={(e) => setFormData(p => ({...p, parentId: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Nenhuma (Categoria Principal)</option>
                        {categories.filter(c => c.id !== editingCategory?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CategoryManager;
