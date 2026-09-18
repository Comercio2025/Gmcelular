import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit, Save, Eye, Settings, Layout, Type } from 'lucide-react';
import type { Page } from '../types';
import { RichTextEditor } from './RichTextEditor';

export const PagesManager = () => {
    const { pages, savePage, deletePage } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingType, setEditingType] = useState<'page' | 'link'>('page');
    const [activeTab, setActiveTab] = useState<'content' | 'visual'>('content');

    const [formData, setFormData] = useState<Partial<Page>>({
        title: '',
        content: '',
        active: true,
        orderIndex: 0,
        backgroundColor: '#020c1b', // Default to Dark Blue
        fontFamily: 'sans',
        fontSize: 'md',
        containerWidth: 'contained',
        padding: 'md',
        externalLink: ''
    });

    const handleEdit = (page: Page) => {
        setEditingId(page.id);
        setEditingType(page.externalLink ? 'link' : 'page');
        setFormData({
            ...page,
            backgroundColor: page.backgroundColor || '#020c1b',
            fontFamily: page.fontFamily || 'sans',
            fontSize: page.fontSize || 'md',
            containerWidth: page.containerWidth || 'contained',
            padding: page.padding || 'md',
            externalLink: page.externalLink || ''
        });
    };

    const handleNewPage = () => {
        setEditingId('new');
        setEditingType('page');
        setFormData({
            title: '',
            content: '',
            active: true,
            orderIndex: pages.length + 1,
            backgroundColor: '#020c1b',
            fontFamily: 'sans',
            fontSize: 'md',
            containerWidth: 'contained',
            padding: 'md',
            externalLink: ''
        });
    };



    const handleSave = async () => {
        if (!formData.title) return alert('Título é obrigatório');
        if (editingType === 'link' && !formData.externalLink) return alert('Link é obrigatório');

        await savePage({
            ...formData,
            id: editingId === 'new' ? undefined : editingId || undefined
        } as Page);

        setEditingId(null);
        setFormData({});
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta página/link?')) {
            await deletePage(id);
        }
    };

    if (editingId) {
        // --- LINK EDITOR MODAL (Moved to Settings) ---
        if (false && editingType === 'link') {
            return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in text-left">
                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingId === 'new' ? 'Adicionar Link no Menu' : 'Editar Link'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Menu</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="input-field w-full border-gray-300"
                                    placeholder="Ex: WhatsApp, Instagram..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino</label>
                                <input
                                    type="text"
                                    value={formData.externalLink}
                                    onChange={(e) => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                                    className="input-field w-full border-gray-300"
                                    placeholder="Ex: https://instagram.com/gmcelular"
                                />
                                <p className="text-xs text-gray-400 mt-1">O link abrirá em uma nova aba.</p>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-400 focus:ring-primary"
                                />
                                <span className="text-gray-700">Ativo no Menu</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 mt-8">
                            <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 text-gray-400 hover:bg-background rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-primary px-6"
                            >
                                Salvar Link
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // --- PAGE EDITOR (Standard) ---
        return (
            <div className="bg-surface rounded-2xl shadow-sm border border-white/10 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {editingId === 'new' ? 'Nova Página' : 'Editar Página'}
                        </h3>
                        <p className="text-sm text-gray-400">Personalize o conteúdo e o visual da sua página.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-background text-gray-400 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary px-6 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Página
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Visual Settings Sidebar */}
                    <div className="w-80 bg-background border-r border-white/10 p-6 overflow-y-auto hidden md:block">
                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-400" />
                            Configurações Visuais
                        </h4>

                        <div className="space-y-6">
                            {/* General Info */}
                            <div className="space-y-4 pb-6 border-b border-white/10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título da Página</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="input-field w-full border-gray-300"
                                        placeholder="Ex: Sobre Nós"
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-400 focus:ring-primary"
                                    />
                                    <span className="text-gray-700">Página Ativa</span>
                                </label>
                            </div>

                            {/* Appearance */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Layout className="w-4 h-4" /> Cor de Fundo
                                    </label>
                                    <div className="flex items-center gap-2 border border-gray-300 p-1.5 rounded-lg bg-surface">
                                        <input
                                            type="color"
                                            value={formData.backgroundColor}
                                            onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-sm font-mono text-gray-400 uppercase">{formData.backgroundColor}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Fonte
                                    </label>
                                    <select
                                        value={formData.fontFamily}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fontFamily: e.target.value }))}
                                        className="input-field w-full border-gray-300 bg-surface"
                                    >
                                        <option value="sans">Sans-Serif (Padrão)</option>
                                        <option value="serif">Serif (Elegante)</option>
                                        <option value="mono">Monospace (Técnico)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho da Fonte</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['sm', 'md', 'lg', 'xl'].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setFormData(prev => ({ ...prev, fontSize: size as any }))}
                                                className={`py-2 rounded-lg border text-sm transition-colors ${formData.fontSize === size
                                                    ? 'bg-blue-600 text-white border-blue-500/30'
                                                    : 'bg-surface border-white/10 text-gray-600 hover:bg-background'
                                                    }`}
                                            >
                                                {size.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Largura do Conteúdo</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, containerWidth: 'contained' }))}
                                            className={`py-2 rounded-lg border text-sm transition-colors ${formData.containerWidth === 'contained'
                                                ? 'bg-blue-600 text-white border-blue-500/30'
                                                : 'bg-surface border-white/10 text-gray-600 hover:bg-background'
                                                }`}
                                        >
                                            Centralizado
                                        </button>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, containerWidth: 'full' }))}
                                            className={`py-2 rounded-lg border text-sm transition-colors ${formData.containerWidth === 'full'
                                                ? 'bg-blue-600 text-white border-blue-500/30'
                                                : 'bg-surface border-white/10 text-gray-600 hover:bg-background'
                                                }`}
                                        >
                                            Largura Total
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Espaçamento Interno</label>
                                    <select
                                        value={formData.padding}
                                        onChange={(e) => setFormData(prev => ({ ...prev, padding: e.target.value as any }))}
                                        className="input-field w-full border-gray-300 bg-surface"
                                    >
                                        <option value="none">Nenhum</option>
                                        <option value="sm">Pequeno</option>
                                        <option value="md">Médio</option>
                                        <option value="lg">Grande</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col bg-background overflow-hidden">
                        {/* Mobile Tabs */}
                        <div className="md:hidden flex border-b border-white/10 bg-surface">
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'content' ? 'border-blue-500/30 text-blue-400' : 'border-transparent text-gray-400'}`}
                            >
                                Conteúdo
                            </button>
                            <button
                                onClick={() => setActiveTab('visual')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'visual' ? 'border-blue-500/30 text-blue-400' : 'border-transparent text-gray-400'}`}
                            >
                                Visual
                            </button>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-6 md:p-8 ${activeTab === 'visual' ? 'block md:hidden' : ''}`}>
                            {activeTab === 'visual' && (
                                <div className="md:hidden space-y-6">
                                    <p className="text-gray-400 italic">Configure as opções visuais na barra lateral (Desktop).</p>
                                </div>
                            )}

                            <div className={`${activeTab === 'visual' ? 'hidden md:block' : 'block'}`}>
                                <div className="bg-surface rounded-xl shadow-sm border border-white/10 overflow-hidden min-h-[500px] flex flex-col">
                                    <RichTextEditor
                                        value={formData.content || ''}
                                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Menus e Páginas</h3>
                    <p className="text-sm text-gray-400">Gerencie o conteúdo do site e links externos do menu.</p>
                </div>
                <div className="flex items-center gap-3">

                    <button onClick={handleNewPage} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Nova Página
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {pages.filter(p => !p.externalLink).map(page => (
                    <div key={page.id} className="p-4 rounded-xl bg-background border border-white/5 flex items-center justify-between group hover:border-blue-500/30/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${page.active ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                                <h4 className="font-bold text-white">{page.title}</h4>
                                <div className="flex items-center gap-2">
                                    {page.externalLink ? (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Link Externo</span>
                                    ) : (
                                        <span className="text-xs bg-surface text-gray-600 px-2 py-0.5 rounded-full font-medium">Página</span>
                                    )}
                                    <span className="text-xs text-gray-400">{page.externalLink ? page.externalLink : `/${page.slug}`}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={page.externalLink || `/#/pages/${page.slug}`}
                                target="_blank"
                                rel={page.externalLink ? "noopener noreferrer" : ""}
                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                title="Visualizar"
                            >
                                <Eye className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => handleEdit(page)}
                                className="p-2 hover:bg-background text-gray-400 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(page.id)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Excluir"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {pages.filter(p => !p.externalLink).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        Nenhuma página de conteúdo criada.
                    </div>
                )}
            </div>
        </div>
    );
};
