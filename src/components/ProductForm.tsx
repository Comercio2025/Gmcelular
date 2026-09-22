import { useState, useEffect } from 'react';
import { X, Calculator, Upload, Sparkles, RotateCcw, Eye, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import { useData } from '../contexts/DataContext';
import { processImage, uploadFile } from '../utils/imageUtils';

interface ProductFormProps {
    initialProduct?: Product | null;
    onClose: () => void;
    onSave: (product: Product) => void;
}

export const ProductForm = ({ initialProduct, onClose, onSave }: ProductFormProps) => {
    const { categories, brands, conditions, statuses, enhanceProductDescriptionAI } = useData();
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        imageUrl: '',
        category: '',
        brand: '',
        model: '',
        condition: 'Novo',
        status: 'em_estoque',
        active: true,
        stock: 1,
        featured: false
    });

    // Calculator State
    const [showCalculator, setShowCalculator] = useState(false);
    const [markup, setMarkup] = useState(30); // 30% default

    // AI Description Assistant State
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
    const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);
    const [previousDescription, setPreviousDescription] = useState<string | null>(null);
    const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);

    useEffect(() => {
        if (initialProduct) {
            setFormData(initialProduct);
        }
    }, [initialProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let finalValue: any = value;
        if (type === 'number') {
            finalValue = parseFloat(value);
        } else if (type === 'checkbox') {
            // @ts-ignore
            finalValue = e.target.checked;
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Show loading state or optimized preview?
                // For now, let's just process and upload
                const processedBlob = await processImage(file);
                const url = await uploadFile(processedBlob);
                setFormData(prev => ({ ...prev, imageUrl: url }));
            } catch (error) {
                alert('Erro ao processar imagem');
            }
        }
    };

    // Global Paste Listener
    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        e.preventDefault();
                        try {
                            const processedBlob = await processImage(blob);
                            const url = await uploadFile(processedBlob);
                            setFormData(prev => ({ ...prev, imageUrl: url }));
                        } catch (error) {
                            alert('Erro ao colar imagem');
                        }
                        return;
                    }
                }
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => window.removeEventListener('paste', handleGlobalPaste);
    }, []);

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                if (blob) {
                    try {
                        const processedBlob = await processImage(blob);
                        const url = await uploadFile(processedBlob);
                        setFormData(prev => ({ ...prev, imageUrl: url }));
                    } catch (error) {
                        alert('Erro ao colar imagem');
                    }
                    return;
                }
            }
        }
    };

    const calculatePrice = () => {
        const cost = formData.costPrice || 0;
        const price = cost * (1 + markup / 100);
        setFormData(prev => ({ ...prev, price: Math.ceil(price) })); // Round up
    };

    const handleEnhanceDescription = async (mode: 'format' | 'generate' | 'bullets' = 'format') => {
        if (!formData.name && !formData.description) {
            setAiErrorMsg('Preencha o Nome do produto ou uma descrição antes de acionar a IA.');
            setTimeout(() => setAiErrorMsg(null), 4000);
            return;
        }

        try {
            setIsEnhancing(true);
            setAiErrorMsg(null);
            setAiSuccessMsg(null);

            setPreviousDescription(formData.description || '');

            const formatted = await enhanceProductDescriptionAI({
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                model: formData.model,
                condition: formData.condition,
                category: formData.category,
                mode,
            });

            if (formatted) {
                setFormData(prev => ({ ...prev, description: formatted }));
                setAiSuccessMsg(
                    mode === 'generate'
                        ? '✨ Descrição criada com sucesso pelo Gemini!'
                        : '✨ Descrição formatada e quebras de linha ajustadas com sucesso!'
                );
                setTimeout(() => setAiSuccessMsg(null), 4000);
            }
        } catch (error: any) {
            console.error(error);
            setAiErrorMsg(error?.message || 'Erro ao comunicar com a IA do Gemini.');
            setTimeout(() => setAiErrorMsg(null), 5000);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleUndoDescription = () => {
        if (previousDescription !== null) {
            setFormData(prev => ({ ...prev, description: previousDescription }));
            setPreviousDescription(null);
            setAiSuccessMsg('↩ Descrição anterior restaurada.');
            setTimeout(() => setAiSuccessMsg(null), 3000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation could go here
        onSave(formData as Product);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className={`bg-background w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border border-white/10 flex flex-col md:flex-row shadow-2xl transition-all duration-300 ${showCalculator ? 'md:max-w-6xl' : ''}`}>
 
                {/* Main Form */}
                <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">
                            {initialProduct ? 'Editar_Produto' : 'Novo_Produto'}
                        </h2>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-surface/5 rounded-none transition-colors text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Nome do Produto</label>
                                <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="Ex: iPhone 15 Pro Max" required />
                            </div>
 
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Marca</label>
                                    <select name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all">
                                        <option value="" className="bg-background">Selecione...</option>
                                        {brands.map(b => <option key={b.id} value={b.name} className="bg-background text-white">{b.name}</option>)}
                                    </select>
                                </div>
                            </div>
 
                            <div>
                                <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Categoria</label>
                                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all">
                                    <option value="" className="bg-background">Selecione...</option>
                                    {categories.map(c => <option key={c.id} value={c.name} className="bg-background text-white">{c.name}</option>)}
                                </select>
                            </div>
 
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Condição</label>
                                    <select name="condition" value={formData.condition || ''} onChange={handleChange} className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all">
                                        {conditions.map(c => <option key={c.id} value={c.name} className="bg-background text-white">{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Disponibilidade</label>
                                    <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all">
                                        {statuses.map(s => <option key={s.id} value={s.slug} className="bg-background text-white">{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="active" 
                                        checked={formData.active} 
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-400 focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-400 transition-colors">Disponível no Site</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="featured" 
                                        checked={formData.featured} 
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-400 focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-400 transition-colors">Destaque</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Custo (R$)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" name="costPrice" value={formData.costPrice || ''} onChange={handleChange} className="input-field w-full border-gray-300" />
                                    <button
                                        type="button"
                                        onClick={() => setShowCalculator(!showCalculator)}
                                        className={`p-3 rounded-xl border transition-colors ${showCalculator ? 'bg-blue-600 text-white border-blue-500/30' : 'border-white/10 hover:bg-background text-blue-400'}`}
                                        title="Abrir Calculadora"
                                    >
                                        <Calculator className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-400 font-bold mb-1">Preço de Venda (R$)</label>
                                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="input-field w-full border-blue-500/30/50 text-xl font-bold" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            name="imageUrl"
                                            value={formData.imageUrl || ''}
                                            onChange={handleChange}
                                            className="input-field w-full border-gray-300"
                                            placeholder="URL da imagem ou Cole aqui (Ctrl+V)"
                                            onPaste={handlePaste}
                                        />
                                        <label className="p-3 hover:bg-background rounded-xl border border-white/10 text-gray-400 cursor-pointer transition-colors block">
                                            <Upload className="w-5 h-5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Dica: O sistema ajustará automaticamente a imagem (fundo branco).
                                    </p>
                                </div>
                            </div>

                            {formData.imageUrl && (
                                <div className="h-48 rounded-xl bg-background overflow-hidden flex items-center justify-center border border-white/10 relative group">
                                    <img src={formData.imageUrl} alt="Preview" className="h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrição com Assistente Gemini IA */}
                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="block text-[10px] font-mono font-bold text-blue-300/80 uppercase tracking-widest">
                                Descrição do Produto
                            </label>

                            {/* Botões de Ação com IA */}
                            <div className="flex items-center flex-wrap gap-2">
                                {previousDescription !== null && (
                                    <button
                                        type="button"
                                        onClick={handleUndoDescription}
                                        className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                                        title="Restaurar a descrição anterior antes da alteração da IA"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Desfazer</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsPreviewingDescription(!isPreviewingDescription)}
                                    className={`text-xs px-2.5 py-1.5 rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                        isPreviewingDescription 
                                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                    }`}
                                    title="Alternar entre editar e visualizar como o cliente vê no site"
                                >
                                    {isPreviewingDescription ? <FileText className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{isPreviewingDescription ? 'Voltar para Editor' : 'Pré-visualizar na Loja'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleEnhanceDescription('format')}
                                    disabled={isEnhancing}
                                    className="text-xs font-semibold px-3 py-1.5 rounded bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                                    title="Corrige pontuação, quebra em linhas limpas e organiza tópicos com Gemini"
                                >
                                    {isEnhancing ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                                    )}
                                    <span>{isEnhancing ? 'Formatando com Gemini...' : '✨ Formatar & Quebrar Linhas (IA)'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleEnhanceDescription('generate')}
                                    disabled={isEnhancing}
                                    className="text-xs px-2.5 py-1.5 rounded bg-surface hover:bg-surface/80 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                                    title="Cria uma descrição persuasiva completa do zero usando o nome e categoria"
                                >
                                    <span>🪄 Criar Descrição</span>
                                </button>
                            </div>
                        </div>

                        {/* Avisos e Feedbacks */}
                        {aiSuccessMsg && (
                            <div className="flex items-center gap-2 p-2.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-xs animate-fade-in">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{aiSuccessMsg}</span>
                            </div>
                        )}
                        {aiErrorMsg && (
                            <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-fade-in">
                                {aiErrorMsg}
                            </div>
                        )}

                        {/* Editor de Texto vs Visualizador Prévia */}
                        {isPreviewingDescription ? (
                            <div className="w-full bg-[#071322] border border-blue-500/30 p-4 rounded min-h-[160px] text-gray-300 whitespace-pre-line text-sm leading-relaxed shadow-inner font-sans">
                                {formData.description ? (
                                    formData.description
                                ) : (
                                    <span className="text-gray-500 italic">Nenhuma descrição informada para pré-visualizar.</span>
                                )}
                            </div>
                        ) : (
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Digite ou cole a descrição. Clique em '✨ Formatar & Quebrar Linhas (IA)' para organizar em tópicos limpos!"
                                className="w-full bg-surface border border-white/10 p-3 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm leading-relaxed"
                            />
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-400 px-1">
                            <span>💡 A IA quebra em tópicos com marcadores (•) e destaca observações de bateria/trocas (Swap).</span>
                            <span>{formData.description ? `${formData.description.length} caracteres` : 'Vazio'}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl hover:bg-background text-gray-400 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary px-8">
                            Salvar Produto
                        </button>
                    </div>
                </form>

                {/* Calculator Sidebar */}
                {showCalculator && (
                    <div className="w-full md:w-80 bg-background border-l border-white/10 p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-400" />
                            Calculadora de Preço
                        </h3>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-surface border border-white/10 shadow-sm">
                                <p className="text-sm text-gray-400 mb-1">Preço de Custo</p>
                                <p className="text-xl font-bold text-white">R$ {formData.costPrice?.toFixed(2)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Margem de Lucro: {markup}%</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={markup}
                                    onChange={(e) => setMarkup(Number(e.target.value))}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Lucro Estimado:</span>
                                    <span className="text-green-600 font-bold">
                                        R$ {((formData.costPrice || 0) * (markup / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Preço Sugerido:</span>
                                    <span className="text-white font-bold">
                                        R$ {((formData.costPrice || 0) * (1 + markup / 100)).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={calculatePrice}
                                className="w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl font-bold transition-colors border border-blue-500/30/20"
                            >
                                Aplicar Sugestão
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Esta ferramenta ajuda a calcular o preço de venda com base no markup simples.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
