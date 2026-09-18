import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Edit, Save, X, Upload } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { processImage, uploadFile } from '../utils/imageUtils'; // Imports
import type { Banner } from '../types';

export const BannerManager = () => {
    const { banners, addBanner, deleteBanner, updateBanner } = useData();

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Banner>>({
        title: '',
        imageUrl: '',
        link: '',
        active: true
    });

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', imageUrl: '', link: '', active: true });
    };

    const handleEdit = (banner: Banner) => {
        setEditingId(banner.id);
        setFormData(banner);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Use new optimized processing
                const processedBlob = await processImage(file, {
                    maxWidth: 2500, // Wide banners
                    maxHeight: 1500,
                    quality: 0.98,
                    maintainAspectRatio: true // Don't add white bars
                });
                const url = await uploadFile(processedBlob);
                setFormData(prev => ({ ...prev, imageUrl: url }));
            } catch (error) {
                alert('Erro ao processar banner');
            }
        }
    };

    // Paste Listener
    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            // Only trigger if we are NOT inside a modal (since BannerManager is usually inline).
            // But if there is no modal open, we can assume user wants to paste into banner form if they are on this page.
            if (document.querySelector('.fixed.inset-0')) return; // Avoid conflict if ProductModal is open

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        e.preventDefault();
                        try {
                            const processedBlob = await processImage(blob, {
                                maxWidth: 2500,
                                maxHeight: 1500,
                                quality: 0.98,
                                maintainAspectRatio: true
                            });
                            const url = await uploadFile(processedBlob);
                            setFormData(prev => ({ ...prev, imageUrl: url }));
                        } catch (error) {
                            console.error('Erro no paste do banner', error);
                        }
                        return;
                    }
                }
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => window.removeEventListener('paste', handleGlobalPaste);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) return;

        if (editingId) {
            updateBanner({ ...formData, id: editingId } as Banner);
        } else {
            addBanner(formData as Banner);
        }
        resetForm();
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {editingId ? 'Editar Banner' : 'Adicionar Novo Banner'}
                    </h3>
                    {editingId && (
                        <button onClick={resetForm} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
                            <X className="w-4 h-4" /> Cancelar
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Título (Opcional)</label>
                            <input
                                type="text"
                                placeholder="Ex: Promoção de Natal"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="input-field w-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Link de Redirecionamento (Opcional)</label>
                            <input
                                type="url"
                                placeholder="Ex: https://meusite.com/ofertas"
                                value={formData.link || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                className="input-field w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 ml-1">Imagem (URL ou Colar)</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Cole a imagem (Ctrl+V) ou URL..."
                                    value={formData.imageUrl || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    className="input-field w-full pr-10"
                                    required
                                />
                                <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-surface/10 rounded-lg cursor-pointer text-gray-400 hover:text-white transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <button type="submit" className={`px-4 md:px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${editingId ? 'bg-blue-600 text-white hover:bg-blue-600-dark' : 'bg-surface/10 text-white hover:bg-surface/20'}`}>
                                {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                <span className="hidden md:inline">{editingId ? 'Salvar' : 'Adicionar'}</span>
                            </button>
                        </div>
                        {formData.imageUrl && (
                            <div className="mt-2 h-32 rounded-lg bg-black/20 overflow-hidden border border-white/5 relative">
                                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className={`glass-card p-4 rounded-2xl group relative overflow-hidden transition-all ${editingId === banner.id ? 'ring-2 ring-primary bg-blue-600/5' : ''}`}>
                        <div className="aspect-video rounded-xl bg-black/20 overflow-hidden mb-4 relative">
                            <img src={banner.imageUrl} alt={banner.title} className={`w-full h-full object-cover transition-opacity ${!banner.active ? 'opacity-50 grayscale' : ''}`} />

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => updateBanner({ ...banner, active: !banner.active })}
                                    className="p-2 bg-surface/10 hover:bg-surface/20 rounded-full text-white backdrop-blur-md transition-transform hover:scale-110"
                                    title={banner.active ? 'Ocultar' : 'Mostrar'}
                                >
                                    {banner.active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => handleEdit(banner)}
                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full backdrop-blur-md transition-transform hover:scale-110"
                                    title="Editar"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => deleteBanner(banner.id)}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md transition-transform hover:scale-110"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-white truncate">{banner.title || 'Sem título'}</h4>
                                {banner.link && (
                                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
                                        {banner.link}
                                    </a>
                                )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${banner.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-background0/10 text-gray-400 border-gray-500/20'}`}>
                                {banner.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
