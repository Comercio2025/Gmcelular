
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Page } from '../../types';
import Modal from './Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const emptyFormState: Omit<Page, 'id'> = {
    title: '',
    slug: '',
    content: '',
    isVisible: true,
};

const PageManager: React.FC = () => {
    const { pages, addPage, updatePage, deletePage } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [formData, setFormData] = useState<Omit<Page, 'id'>>(emptyFormState);

    useEffect(() => {
        setFormData(editingPage || emptyFormState);
    }, [editingPage]);

    const handleOpenModal = (page: Page | null) => {
        setEditingPage(page);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPage(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // FIX: The original implementation caused a TypeScript error when accessing `e.target.checked`.
        // This has been refactored to safely handle the 'checked' property for checkboxes.
        setFormData(prev => {
            let newValue: string | boolean;
            if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
                newValue = e.target.checked;
            } else {
                newValue = value;
            }
    
            const newTitle = name === 'title' ? value : prev.title;
            return {
                ...prev,
                [name]: newValue,
                slug: name === 'title' ? slugify(newTitle) : (name === 'slug' ? value : prev.slug),
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPage) {
            updatePage(editingPage.id, formData);
        } else {
            addPage(formData);
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Páginas</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Plus size={20} className="mr-2" /> Adicionar Página
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Título</th>
                            <th className="p-4 font-semibold">Link (Slug)</th>
                            <th className="p-4 font-semibold">Visível no Menu</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(page => (
                            <tr key={page.id} className="border-b dark:border-gray-700">
                                <td className="p-4">{page.title}</td>
                                <td className="p-4 text-gray-500">/page/{page.slug}</td>
                                <td className="p-4">{page.isVisible ? 'Sim' : 'Não'}</td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(page)} className="text-primary hover:opacity-75"><Edit size={20} /></button>
                                    <button onClick={() => window.confirm('Tem certeza?') && deletePage(page.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPage ? 'Editar Página' : 'Adicionar Página'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Título</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Link (Slug)</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Conteúdo (HTML permitido)</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} id="isVisible" className="h-4 w-4 rounded" />
                        <label htmlFor="isVisible" className="ml-2 text-sm">Visível (para seleção no menu de configurações)</label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PageManager;
