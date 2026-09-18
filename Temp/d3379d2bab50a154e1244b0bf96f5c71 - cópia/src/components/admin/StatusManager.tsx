
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Status } from '../../types';
import Modal from './Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const StatusManager: React.FC = () => {
    const { statuses, addStatus, updateStatus, deleteStatus } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Status | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (editingItem) {
            setFormData({ name: editingItem.name });
        } else {
            setFormData({ name: '' });
        }
    }, [editingItem]);
    
    const handleOpenModal = (item: Status | null) => {
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
            updateStatus(editingItem.id, formData);
        } else {
            addStatus(formData);
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Status</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Plus size={20} className="mr-2"/> Adicionar Status
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Nome do Status</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((item) => (
                            <tr key={item.id} className="border-b dark:border-gray-700">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(item)} className="text-primary hover:opacity-75"><Edit size={20} /></button>
                                    <button onClick={() => window.confirm('Tem certeza?') && deleteStatus(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Editar Status' : 'Adicionar Status'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} placeholder="Nome do status" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StatusManager;
