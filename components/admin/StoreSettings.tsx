
import React, { useState } from 'react';
import { useStoreConfig } from '../../contexts/StoreConfigContext';
import { StoreConfig, MenuItem } from '../../types';
import ImageUploader from './ImageUploader';
import { useData } from '../../contexts/DataContext';
import { Plus, Trash2 } from 'lucide-react';

const StoreSettings: React.FC = () => {
    const { config, setConfig } = useStoreConfig();
    const { pages } = useData();
    const [formData, setFormData] = useState<StoreConfig>(config);
    const [feedback, setFeedback] = useState('');

    const [newMenuItem, setNewMenuItem] = useState({ label: '', type: 'page', value: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            
            // FIX: The original implementation had type errors with checkbox handling and spreading non-object types.
            // This revised logic correctly handles checkbox state and ensures that we only spread object types.
            setFormData(prev => {
                const parentState = prev[parent as keyof StoreConfig];

                if (typeof parentState !== 'object' || parentState === null || Array.isArray(parentState)) {
                    return prev; // Should not happen with current usage but good for type safety
                }
    
                let finalValue;
                if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
                    finalValue = e.target.checked;
                } else {
                    finalValue = value;
                }
    
                return {
                    ...prev,
                    [parent]: {
                        ...parentState,
                        [child]: finalValue,
                    },
                };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoUpload = (base64: string) => {
        setFormData(prev => ({ ...prev, logoUrl: base64 }));
    }

    const handleUpdateMenuItem = (id: string, field: keyof MenuItem, value: string) => {
        setFormData(prev => ({
            ...prev,
            headerMenu: prev.headerMenu.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const handleRemoveMenuItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            headerMenu: prev.headerMenu.filter(item => item.id !== id)
        }));
    };

    const handleAddMenuItem = () => {
        if (!newMenuItem.label.trim() || !newMenuItem.value.trim()) return;

        const newItem: MenuItem = {
            id: `menu_${Date.now()}`,
            label: newMenuItem.label,
            type: newMenuItem.type as 'home' | 'page' | 'link',
            value: newMenuItem.value,
        };
        setFormData(prev => ({
            ...prev,
            headerMenu: [...prev.headerMenu, newItem]
        }));
        setNewMenuItem({ label: '', type: 'page', value: '' });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setConfig(formData);
        setFeedback('Configurações salvas com sucesso!');
        setTimeout(() => setFeedback(''), 3000);
    };

    const fontOptions = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Configurações da Loja</h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-8">
                
                {/* Store Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Identidade da Loja</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nome da Loja</label>
                                <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Slogan</label>
                                <input type="text" name="slogan" value={formData.slogan} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                    </div>
                    <div>
                         <h2 className="text-xl font-semibold mb-4 border-b pb-2">Logomarca</h2>
                         <div className="flex items-center gap-4">
                            <img src={formData.logoUrl} alt="Logo preview" className="h-20 w-20 object-contain bg-gray-100 dark:bg-gray-700 rounded"/>
                            <ImageUploader onImageUpload={handleLogoUpload} />
                         </div>
                    </div>
                </div>

                 {/* Header & Navigation */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Cabeçalho e Navegação</h2>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="announcementBar.enabled" checked={formData.announcementBar.enabled} onChange={handleChange} className="h-4 w-4 rounded" />
                            <span>Ativar barra de anúncio</span>
                        </label>
                        {formData.announcementBar.enabled && (
                        <div>
                            <label className="block text-sm font-medium">Texto da Barra de Anúncio</label>
                            <input type="text" name="announcementBar.text" value={formData.announcementBar.text} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        )}

                        <h3 className="text-lg font-semibold pt-4">Menu Principal</h3>
                        <div className="space-y-2">
                            {formData.headerMenu.map(item => (
                                <div key={item.id} className="flex items-center gap-2 p-2 border rounded dark:border-gray-600">
                                    <input type="text" value={item.label} onChange={e => handleUpdateMenuItem(item.id, 'label', e.target.value)} className="p-1 border rounded dark:bg-gray-700 dark:border-gray-500 flex-grow" placeholder="Rótulo"/>
                                    <span className="text-sm">{item.type === 'home' ? 'Página Inicial' : (item.type === 'page' ? 'Página' : 'Link')}</span>
                                    <button type="button" onClick={() => handleRemoveMenuItem(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>
                         <div className="flex items-end gap-2 p-2 border-t dark:border-gray-600 pt-4">
                                <input type="text" value={newMenuItem.label} onChange={e => setNewMenuItem(p => ({...p, label: e.target.value}))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 flex-grow" placeholder="Rótulo do novo item"/>
                                <select value={newMenuItem.type} onChange={e => setNewMenuItem(p => ({...p, type: e.target.value, value: ''}))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                    <option value="page">Página</option>
                                    <option value="link">Link Externo</option>
                                    <option value="home">Página Inicial</option>
                                </select>
                                {newMenuItem.type === 'page' && <select value={newMenuItem.value} onChange={e => setNewMenuItem(p => ({...p, value: e.target.value}))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Selecione a página</option>{pages.filter(p => p.isVisible).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>}
                                {newMenuItem.type === 'link' && <input type="url" value={newMenuItem.value} onChange={e => setNewMenuItem(p => ({...p, value: e.target.value}))} placeholder="https://..." className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>}
                                {newMenuItem.type === 'home' && <input type="text" value="/" disabled className="p-2 border rounded dark:bg-gray-600 dark:border-gray-500"/>}
                                <button type="button" onClick={handleAddMenuItem} className="p-2 bg-primary text-white rounded hover:opacity-90"><Plus size={20}/></button>
                         </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informações de Contato</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium">Endereço</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Número do WhatsApp (somente números)</label>
                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Usuário do Instagram (sem @)</label>
                            <input type="text" name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Visual Customization */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personalização Visual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Cor Primária</label>
                            <input type="color" name="colors.primary" value={formData.colors.primary} onChange={handleChange} className="w-full mt-1 h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cor Secundária</label>
                            <input type="color" name="colors.secondary" value={formData.colors.secondary} onChange={handleChange} className="w-full mt-1 h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fonte Principal</label>
                            <select name="font" value={formData.font} onChange={handleChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end items-center gap-4 pt-4">
                    {feedback && <span className="text-green-600 dark:text-green-400 text-sm">{feedback}</span>}
                    <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-90">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreSettings;
