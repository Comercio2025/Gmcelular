
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Brand } from '../../types';
import Modal from './Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BrandManager: React.FC = () => {
    const { brands, addBrand, updateBrand, deleteBrand } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (editingItem) {
            setFormData({ name: editingItem.name });
        } else {
            setFormData({ name: '' });
        }
    }, [editingItem]);
    
    const handleOpenModal = (item: Brand | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name) return;

        if (editingItem) {
            updateBrand(editingItem.id, formData);
        } else {
            addBrand(formData);
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Marcas</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Plus size={20} className="mr-2"/> Adicionar Marca
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Nome da Marca</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((item) => (
                            <tr key={item.id} className="border-b dark:border-gray-700">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(item)} className="text-primary hover:opacity-75"><Edit size={20} /></button>
                                    <button onClick={() => window.confirm('Tem certeza?') && deleteBrand(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Editar Marca' : 'Adicionar Marca'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} placeholder="Nome da marca" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BrandManager;
