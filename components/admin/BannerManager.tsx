
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Banner } from '../../types';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { Plus, Edit, Trash2 } from 'lucide-react';

const emptyFormState: Omit<Banner, 'id'> = {
    imageUrl: '',
    altText: '',
    linkUrl: '',
    title: '',
    subtitle: '',
    textColor: '#FFFFFF',
    textPosition: 'center-center',
};

const BannerManager: React.FC = () => {
    const { banners, addBanner, updateBanner, deleteBanner } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState<Omit<Banner, 'id'>>(emptyFormState);

    useEffect(() => {
        setFormData(editingBanner || emptyFormState);
    }, [editingBanner]);
    
    const handleOpenModal = (banner: Banner | null) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = (base64OrUrl: string) => {
        setFormData(prev => ({...prev, imageUrl: base64OrUrl}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave: Omit<Banner, 'id'> = {
            ...formData,
            linkUrl: formData.linkUrl || undefined,
        };
        if (editingBanner) {
            updateBanner(editingBanner.id, dataToSave);
        } else {
            addBanner(dataToSave);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este banner?')) {
            deleteBanner(id);
        }
    };

    const textPositionOptions = {
        'center-center': 'Centro',
        'bottom-left': 'Inferior Esquerdo',
        'bottom-center': 'Inferior Centralizado',
        'top-left': 'Superior Esquerdo',
        'top-center': 'Superior Centralizado',
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Banners</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                    <Plus size={20} className="mr-2"/> Adicionar Banner
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Preview</th>
                            <th className="p-4 font-semibold">Texto Alternativo</th>
                            <th className="p-4 font-semibold">Link</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map(banner => (
                            <tr key={banner.id} className="border-b dark:border-gray-700">
                                <td className="p-2">
                                    <img src={banner.imageUrl} alt={banner.altText} className="h-12 w-24 object-cover rounded"/>
                                </td>
                                <td className="p-4">{banner.altText}</td>
                                <td className="p-4 truncate max-w-xs">
                                    {banner.linkUrl ? <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{banner.linkUrl}</a> : 'Nenhum'}
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(banner)} className="text-primary hover:opacity-75"><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBanner ? 'Editar Banner' : 'Adicionar Banner'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image */}
                    <fieldset><legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Imagem do Banner</legend>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">URL da imagem</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Cole uma URL ou faça upload abaixo" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <ImageUploader onImageUpload={handleImageUpload} />
                             {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-4 max-h-40 mx-auto rounded" />}
                        </div>
                    </fieldset>
                    
                    {/* Content */}
                    <fieldset><legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Conteúdo e Ação</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="block text-sm font-medium">Texto Alternativo (obrigatório)</label><input type="text" name="altText" value={formData.altText} onChange={handleChange} placeholder="Descrição da imagem" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium">Link (opcional)</label><input type="url" name="linkUrl" value={formData.linkUrl || ''} onChange={handleChange} placeholder="https://exemplo.com/oferta" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium">Título</label><input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium">Subtítulo</label><input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                             <div><label className="block text-sm font-medium">Cor do Texto</label><input type="color" name="textColor" value={formData.textColor || '#FFFFFF'} onChange={handleChange} className="w-full h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                             <div><label className="block text-sm font-medium">Posição do Texto</label><select name="textPosition" value={formData.textPosition} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">{Object.entries(textPositionOptions).map(([key, label])=><option key={key} value={key}>{label}</option>)}</select></div>
                        </div>
                    </fieldset>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BannerManager;
