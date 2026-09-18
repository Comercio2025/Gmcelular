import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit2, Save, Filter } from 'lucide-react';
import type { CustomFilter, FilterCriteria } from '../types';

export default function FiltersManager() {
    const { customFilters, saveCustomFilter, deleteCustomFilter, categories, brands, statuses, conditions } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<CustomFilter>>({
        name: '',
        criteria: {} as FilterCriteria,
        active: true,
        orderIndex: 0
    });

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            criteria: {} as FilterCriteria,
            active: true,
            orderIndex: customFilters.length
        });
    };

    const handleEdit = (filter: CustomFilter) => {
        setEditingId(filter.id);
        setFormData({ ...filter });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este filtro?')) {
            await deleteCustomFilter(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveCustomFilter({
                ...formData,
                id: editingId || undefined
            });
            resetForm();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar filtro');
        }
    };

    const updateCriteria = (key: keyof FilterCriteria, value: any) => {
        setFormData(prev => ({
            ...prev,
            criteria: {
                ...prev.criteria,
                [key]: value === '' ? undefined : value
            }
        }));
    };

    return (
        <div className="glass-card !bg-[#020c1b] border-2 border-blue-500/30 rounded-none p-8 mb-12 shadow-2xl relative overflow-hidden group/manager">
            {/* Background Accent */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none group-hover/manager:bg-blue-500/20 transition-colors duration-700"></div>

            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                    <Filter className="w-6 h-6 text-blue-400" strokeWidth={2.5} />
                </div>
                GERENCIAR FILTROS INTELIGENTES
                <span className="text-[10px] font-mono font-normal text-blue-400/50 bg-blue-500/5 px-2 py-1 border border-blue-500/10 ml-auto tracking-widest uppercase">
                    v2.0 Beta
                </span>
            </h2>

            {/* List - Tech Style Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                {customFilters.map((filter, index) => (
                    <div
                        key={filter.id}
                        className="glass-card bg-[#0a192f] border border-blue-500/20 p-6 flex items-center gap-6 hover:border-blue-500/50 hover:bg-[#0d1e3a] transition-all duration-300 group relative rounded-none animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                            <Filter className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                {filter.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filter.criteria?.category_id && (
                                    <span className="text-[10px] font-mono text-blue-300/60 uppercase tracking-tight border border-blue-500/10 px-2 py-0.5 bg-blue-500/5">
                                        CAT: {categories.find(c => c.id === filter.criteria!.category_id)?.name}
                                    </span>
                                )}
                                {filter.criteria?.brand_id && (
                                    <span className="text-[10px] font-mono text-blue-300/60 uppercase tracking-tight border border-blue-500/10 px-2 py-0.5 bg-blue-500/5">
                                        MARCA: {brands.find(b => b.id === filter.criteria!.brand_id)?.name}
                                    </span>
                                )}
                                {filter.criteria?.status_id && (
                                    <span className="text-[10px] font-mono text-blue-300/60 uppercase tracking-tight border border-blue-500/10 px-2 py-0.5 bg-blue-500/5">
                                        STATUS: {statuses.find(s => s.id === filter.criteria!.status_id)?.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleEdit(filter)}
                                title="Editar"
                                className="p-2.5 hover:bg-blue-500/20 text-blue-400/60 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(filter.id)}
                                title="Excluir"
                                className="p-2.5 hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {customFilters.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-white/5 bg-surface/2">
                        <p className="font-mono text-xs uppercase tracking-[0.2em]">Nenhum filtro personalizado detectado</p>
                    </div>
                )}
            </div>

            {/* Form - Layered Glass Panel */}
            <form onSubmit={handleSubmit} className="bg-surface/2 border border-white/10 p-8 relative animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                
                <h3 className="text-sm font-mono font-bold text-blue-400 mb-8 flex items-center gap-2 uppercase tracking-[0.3em]">
                    {editingId ? <><Edit2 className="w-4 h-4" /> / Editar_Parâmetros</> : <><Plus className="w-4 h-4" /> / Criar_Filtro</>}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Etiqueta Visual do Filtro</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#0a192f] border border-blue-500/30 p-4 text-white focus:outline-none focus:border-blue-400 focus:bg-[#0d1e3a] transition-all font-display text-lg placeholder:text-gray-600 shadow-inner"
                            placeholder="EX: IPHONES SEMINOVOS"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-blue-300/80 mb-2 uppercase tracking-widest">Peso / Ordem</label>
                        <input
                            type="number"
                            value={formData.orderIndex}
                            onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
                            className="w-full bg-[#0a192f] border border-blue-500/30 p-4 text-white focus:outline-none focus:border-blue-400 focus:bg-[#0d1e3a] transition-all font-mono text-lg shadow-inner"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-4 uppercase tracking-widest text-center border-b border-white/5 pb-2">Configurações de Critério (Lógica AND)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-blue-400/60 ml-1">CATEGORIA</span>
                            <select
                                value={formData.criteria?.category_id || ''}
                                onChange={(e) => updateCriteria('category_id', e.target.value)}
                                className="w-full bg-surface/5 border border-white/10 p-3 text-sm text-gray-300 focus:border-blue-500 outline-none hover:bg-surface/10 transition-all cursor-pointer"
                            >
                                <option value="" className="bg-[#020c1b]">Todas</option>
                                {categories.map(c => <option key={c.id} value={c.id} className="bg-[#020c1b]">{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-blue-400/60 ml-1">MARCA</span>
                            <select
                                value={formData.criteria?.brand_id || ''}
                                onChange={(e) => updateCriteria('brand_id', e.target.value)}
                                className="w-full bg-surface/5 border border-white/10 p-3 text-sm text-gray-300 focus:border-blue-500 outline-none hover:bg-surface/10 transition-all cursor-pointer"
                            >
                                <option value="" className="bg-[#020c1b]">Todas</option>
                                {brands.map(b => <option key={b.id} value={b.id} className="bg-[#020c1b]">{b.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-blue-400/60 ml-1">STATUS_EQP</span>
                            <select
                                value={formData.criteria?.status_id || ''}
                                onChange={(e) => updateCriteria('status_id', e.target.value)}
                                className="w-full bg-surface/5 border border-white/10 p-3 text-sm text-gray-300 focus:border-blue-500 outline-none hover:bg-surface/10 transition-all cursor-pointer"
                            >
                                <option value="" className="bg-[#020c1b]">Todos</option>
                                {statuses.map(s => <option key={s.id} value={s.id} className="bg-[#020c1b]">{s.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-blue-400/60 ml-1">CONDIÇÃO</span>
                            <select
                                value={formData.criteria?.condition_id || ''}
                                onChange={(e) => updateCriteria('condition_id', e.target.value)}
                                className="w-full bg-surface/5 border border-white/10 p-3 text-sm text-gray-300 focus:border-blue-500 outline-none hover:bg-surface/10 transition-all cursor-pointer"
                            >
                                <option value="" className="bg-[#020c1b]">Todas</option>
                                {conditions.map(c => <option key={c.id} value={c.id} className="bg-[#020c1b]">{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-center p-4 bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all group/toggle">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.criteria?.featured || false}
                                onChange={(e) => updateCriteria('featured', e.target.checked)}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 border flex items-center justify-center transition-all duration-300 ${formData.criteria?.featured ? 'bg-blue-500 border-blue-500' : 'border-white/20 group-hover/toggle:border-blue-400/50'}`}>
                                {formData.criteria?.featured && <Save className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-[11px] font-mono uppercase tracking-[0.1em] transition-colors ${formData.criteria?.featured ? 'text-blue-400' : 'text-gray-400'}`}>
                                Priorizar Produtos em Destaque (Featured)
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-2 py-4 border-t border-white/10">
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={resetForm} 
                            className="px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            [ Descartar ]
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-[0.2em] px-8 py-3 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    >
                        <Save className="w-4 h-4" />
                        Gravar_Configurações
                    </button>
                </div>
            </form>
        </div>
    );
}
