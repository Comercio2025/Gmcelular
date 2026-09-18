import { useState } from 'react';
import { Save, Menu, Plus, Trash2, Link as LinkIcon, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { Page } from '../types';

export const SettingsManager = () => {
    const { config, updateConfig, pages, savePage, deletePage } = useData();
    const [activeTab, setActiveTab] = useState<'general' | 'menus'>('general');

    // State for Link Creation in Settings
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkData, setNewLinkData] = useState({ title: '', url: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const updates: any = {};
        formData.forEach((value, key) => {
            if (key.includes('.')) {
                // Handle nested keys like colors.primary
                const [parent, child] = key.split('.');
                // @ts-ignore
                if (!updates[parent]) updates[parent] = { ...config[parent] };
                updates[parent][child] = value;
            } else {
                updates[key] = value;
            }
        });

        updateConfig(updates);
        alert('Configurações salvas com sucesso!');
    };

    // --- MENU ACTIONS ---
    const handleAddLink = async () => {
        if (!newLinkData.title || !newLinkData.url) return alert('Preencha nome e link');

        await savePage({
            title: newLinkData.title,
            externalLink: newLinkData.url,
            active: true,
            orderIndex: pages.length + 1
        });

        setIsAddingLink(false);
        setNewLinkData({ title: '', url: '' });
    };

    const handleUpdatePageTitle = async (id: string, newTitle: string) => {
        await savePage({ id, title: newTitle });
    };

    const handleToggleActive = async (page: Page) => {
        await savePage({ id: page.id, active: !page.active });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza? Se for uma PÁGINA de conteúdo, o conteúdo será perdido.')) {
            await deletePage(id);
        }
    };

    const handleReorder = async (page: Page, direction: 'up' | 'down') => {
        const sortedPages = [...pages].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        const currentIndex = sortedPages.findIndex(p => p.id === page.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= sortedPages.length) return;

        const targetPage = sortedPages[targetIndex];

        // Swap order indexes
        await savePage({ id: page.id, orderIndex: targetPage.orderIndex || 0 });
        await savePage({ id: targetPage.id, orderIndex: page.orderIndex || 0 });
    };

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`text-lg font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'general' ? 'border-blue-500/30 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Configurações Gerais
                </button>
                <button
                    onClick={() => setActiveTab('menus')}
                    className={`text-lg font-bold pb-4 -mb-4 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'menus' ? 'border-blue-500/30 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Menu className="w-4 h-4" />
                    Menus do Site
                </button>
            </div>

            {activeTab === 'general' ? (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Loja</label>
                            <input name="storeName" type="text" defaultValue={config.storeName} className="input-field w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ano de Fundação</label>
                            <input name="foundedYear" type="text" defaultValue={config.foundedYear} className="input-field w-full" placeholder="Ex: 2016" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Endereço da Loja</label>
                        <input name="address" type="text" defaultValue={config.address} className="input-field w-full" placeholder="Av. Barão do Rio Branco..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Horário (Semana)</label>
                            <input name="workingHoursWeek" type="text" defaultValue={config.workingHoursWeek} className="input-field w-full" placeholder="Seg a Sex: 08:00 às 18:00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Horário (Sábado)</label>
                            <input name="workingHoursSat" type="text" defaultValue={config.workingHoursSat} className="input-field w-full" placeholder="Sábado: 07:30 às 13:00" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp (Apenas números)</label>
                            <input name="whatsappNumber" type="text" defaultValue={config.whatsappNumber} className="input-field w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Instagram (Usuário ou URL)</label>
                            <input name="socialMedia.instagram" type="text" defaultValue={config.socialMedia?.instagram} className="input-field w-full" placeholder="@usuario" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Serviços (Separar por vírgula)</label>
                            <input name="servicesList" type="text" defaultValue={config.servicesList} className="input-field w-full" placeholder="Assistência Técnica, Smartphones, Informática..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Logo da Loja (URL)</label>
                        <div className="flex gap-2">
                            <input name="logoUrl" type="text" defaultValue={config.logoUrl} className="input-field w-full" placeholder="/logo.png" />
                            {config.logoUrl && (
                                <div className="w-12 h-12 bg-surface rounded-lg p-1">
                                    <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cor Primária</label>
                            <div className="flex gap-2">
                                <input name="colors.primary" type="color" defaultValue={config.colors.primary} className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border-none" />
                                <input name="colors.primary" type="text" defaultValue={config.colors.primary} className="input-field flex-1" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cor Secundária</label>
                            <div className="flex gap-2">
                                <input name="colors.secondary" type="color" defaultValue={config.colors.secondary} className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border-none" />
                                <input name="colors.secondary" type="text" defaultValue={config.colors.secondary} className="input-field flex-1" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-lg font-bold text-white mb-4">Personalização de Textos e Cores</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Menu Início</label>
                                <input name="menuHomeLabel" type="text" defaultValue={config.menuHomeLabel || 'Início'} className="input-field w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Título Rodapé (Serviços)</label>
                                <input name="footerServicesTitle" type="text" defaultValue={config.footerServicesTitle || 'Atuação'} className="input-field w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Título Rodapé (Horários)</label>
                                <input name="footerHoursTitle" type="text" defaultValue={config.footerHoursTitle || 'Horários'} className="input-field w-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tamanho da Fonte do Menu (px)</label>
                                <input name="menuFontSize" type="text" defaultValue={config.menuFontSize || '16px'} className="input-field w-full" placeholder="Ex: 16px" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Cor do Menu</label>
                                <div className="flex gap-2">
                                    <input name="menuTextColor" type="color" defaultValue={config.menuTextColor || '#d1d5db'} className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border-none" />
                                    <input name="menuTextColor" type="text" defaultValue={config.menuTextColor || '#d1d5db'} className="input-field flex-1" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-white/5 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tamanho Título Banner (Mobile)</label>
                                <input name="bannerFontSizeMobile" type="text" defaultValue={config.bannerFontSizeMobile || '30px'} className="input-field w-full" placeholder="Ex: 24px" />
                                <p className="text-xs text-gray-400 mt-1">Padrão: 30px. Ajuste para telas pequenas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-lg font-bold text-white mb-4">Integrações & Analytics</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Facebook Pixel ID</label>
                            <input name="facebookPixelId" type="text" defaultValue={config.facebookPixelId} className="input-field w-full" placeholder="Ex: 123456789012345" />
                            <p className="text-xs text-gray-400 mt-1">Insira apenas o ID numérico do seu Pixel.</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Google Ads / Analytics ID</label>
                            <input name="googleAdsId" type="text" defaultValue={config.googleAdsId} className="input-field w-full" placeholder="Ex: AW-123456789 ou G-XXXXXXXX" />
                            <p className="text-xs text-gray-400 mt-1">Insira o ID de Acompanhamento (TAG) do Google.</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Gemini API Key (IA para Artigos)</label>
                            <input name="geminiApiKey" type="password" defaultValue={config.geminiApiKey} className="input-field w-full" placeholder="AIza..." />
                            <p className="text-xs text-gray-400 mt-1">Usada no botão de gerar artigos com IA no painel de Artigos.</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Modelo Gemini</label>
                            <input name="geminiModel" type="text" defaultValue={config.geminiModel || 'gemini-2.5-flash'} className="input-field w-full" placeholder="gemini-2.5-flash" />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Prompt da IA para Melhor Celular</label>
                            <textarea
                                name="geminiRecommenderPrompt"
                                defaultValue={config.geminiRecommenderPrompt || ''}
                                className="input-field w-full min-h-[96px]"
                                placeholder="Ex: Priorize bateria para perfil de trabalho e custo-beneficio para faixa intermediaria."
                            />
                            <p className="text-xs text-gray-400 mt-1">Diretriz opcional para personalizar o comportamento da recomendação por perfil.</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-end">
                        <button type="submit" className="btn-primary">
                            <Save className="w-5 h-5 mr-2" />
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center bg-surface/5 p-4 rounded-xl border border-white/10">
                        <div>
                            <h4 className="font-bold text-white">Itens do Menu</h4>
                            <p className="text-sm text-gray-400">Arraste para reordenar (usando setas) ou edite os nomes.</p>
                        </div>
                        <button
                            onClick={() => setIsAddingLink(true)}
                            className="bg-blue-600 hover:bg-blue-600/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar Link
                        </button>
                    </div>

                    {/* Add Link Form */}
                    {isAddingLink && (
                        <div className="bg-surface/10 p-6 rounded-xl border border-white/10 animate-fade-in">
                            <h5 className="font-bold text-white mb-4">Novo Link de Menu</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome no Menu</label>
                                    <input
                                        autoFocus
                                        value={newLinkData.title}
                                        onChange={e => setNewLinkData(d => ({ ...d, title: e.target.value }))}
                                        className="input-field w-full"
                                        placeholder="Ex: WhatsApp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">URL / Link</label>
                                    <input
                                        value={newLinkData.url}
                                        onChange={e => setNewLinkData(d => ({ ...d, url: e.target.value }))}
                                        className="input-field w-full"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsAddingLink(false)} className="text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button onClick={handleAddLink} className="btn-primary">Salvar Link</button>
                            </div>
                        </div>
                    )}

                    {/* Menu List */}
                    <div className="space-y-3">
                        {pages.map((page, index) => (
                            <div key={page.id} className="flex items-center gap-4 p-4 bg-surface/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleReorder(page, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(page, 'down')}
                                        disabled={index === pages.length - 1}
                                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={page.title}
                                        onChange={(e) => handleUpdatePageTitle(page.id, e.target.value)}
                                        className="bg-transparent border-none text-white font-medium p-0 focus:ring-0 w-full"
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        {page.externalLink ? (
                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <LinkIcon className="w-3 h-3" /> Link Externo: {page.externalLink}
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                                                Página de Conteúdo
                                            </span>
                                        )}
                                        {!page.active && <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">Oculto</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggleActive(page)}
                                        className={`p-2 rounded-lg transition-colors ${page.active ? 'text-gray-400 hover:text-white hover:bg-surface/10' : 'text-red-400 bg-red-500/10 hover:bg-red-500/20'}`}
                                        title={page.active ? "Ocultar do Menu" : "Mostrar no Menu"}
                                    >
                                        {page.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(page.id)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {pages.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                Nenhum item de menu criado.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
