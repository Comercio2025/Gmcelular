import { useState, useMemo } from 'react';
import { Edit, Trash2, Search, Columns, ChevronDown, ArrowUpDown, Upload, Copy } from 'lucide-react';
import type { Product } from '../types';
import { useData } from '../contexts/DataContext';
import { processImage, uploadFile } from '../utils/imageUtils';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDuplicate: (product: Product) => void;
    onDelete: (id: string) => void;
}

export const ProductTable = ({ products, onEdit, onDuplicate, onDelete }: ProductTableProps) => {
    const { categories } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'brand_asc'>('newest');

    // Column Configuration
    // Column Configuration
    const [visibleColumns, setVisibleColumns] = useState({
        image: true,
        name: true,
        brand: true,
        // model: false, // Removed
        category: true,
        price: true,
        costPrice: false,
        condition: true,
        stock: false,
        status: true,
        active: true,
        actions: true
    });

    // Bulk & Inline Edit State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isQuickEditMode, setIsQuickEditMode] = useState(false);
    const { bulkDeleteProducts, bulkUpdateProducts, updateProduct, statuses, categories: allCategories, brands, conditions } = useData();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
            const matchesBrand = brandFilter ? product.brand === brandFilter : true;
            const matchesCondition = conditionFilter ? product.condition === conditionFilter : true;
            const matchesStatus = statusFilter ? product.status === statusFilter : true;
            const matchesVisibility =
                visibilityFilter === 'all' ? true : visibilityFilter === 'visible' ? product.active : !product.active;
            const currentStock = Number(product.stock || 0);
            const matchesStock =
                stockFilter === 'all' ? true : stockFilter === 'in_stock' ? currentStock > 0 : currentStock <= 0;

            return matchesSearch && matchesCategory && matchesBrand && matchesCondition && matchesStatus && matchesVisibility && matchesStock;
        });

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'brand_asc':
                result.sort((a, b) => a.brand.localeCompare(b.brand));
                break;
            case 'newest':
            default:
                // Assuming products come sorted by ID desc from backend or natural order
                // If we want explicit sort by ID (timestamp):
                result.sort((a, b) => Number(b.id) - Number(a.id));
                break;
        }
        return result;
    }, [products, searchTerm, categoryFilter, brandFilter, conditionFilter, statusFilter, visibilityFilter, stockFilter, sortBy]);

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setBrandFilter('');
        setConditionFilter('');
        setStatusFilter('');
        setVisibilityFilter('all');
        setStockFilter('all');
    };

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    // Inline Edit Handlers
    const handleInlineUpdate = async (product: Product, field: string, value: any) => {
        try {
            const updated = { ...product, [field]: value };

            // Ensure numbers are numbers
            if (['price', 'costPrice', 'stock'].includes(field)) {
                // @ts-ignore
                updated[field] = Number(value);
            } else {
                // @ts-ignore
                updated[field] = value;
            }
            updateProduct(updated);
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    // Bulk Actions
    const handleBulkDelete = async () => {
        if (confirm(`Tem certeza que deseja excluir ${selectedIds.length} produtos?`)) {
            await bulkDeleteProducts(selectedIds);
            setSelectedIds([]);
        }
    };

    const handleBulkVisibility = async (active: boolean) => {
        await bulkUpdateProducts(selectedIds, { active });
        setSelectedIds([]);
    };

    const handleBulkStatus = async (statusSlug: string) => {
        // We need the STATUS ID for the API bulk update
        const statusId = statuses.find(s => s.slug === statusSlug)?.id;
        if (statusId) {
            await bulkUpdateProducts(selectedIds, { status_id: statusId });
            setSelectedIds([]);
        }
    };

    return (
        <div className="space-y-4 relative">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, marca ou modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full pl-10 py-2.5 bg-surface border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
                    {/* Quick Edit Toggle */}
                    <button
                        onClick={() => setIsQuickEditMode(!isQuickEditMode)}
                        className={`btn-secondary py-2.5 px-4 flex items-center gap-2 ${isQuickEditMode ? 'bg-blue-600 text-white border-blue-500/30' : ''}`}
                    >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edição Rápida</span>
                    </button>

                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="">Todas Categorias</option>
                            {categories.map(c => <option key={c.id} value={c.name} className="bg-[#0a192f]">{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="">Todas Marcas</option>
                            {brands.map(b => <option key={b.id} value={b.name} className="bg-[#0a192f]">{b.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={conditionFilter}
                            onChange={(e) => setConditionFilter(e.target.value)}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="">Todas Condições</option>
                            {conditions.map(c => <option key={c.id} value={c.name} className="bg-[#0a192f]">{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="">Toda Disponibilidade</option>
                            {statuses.map(s => <option key={s.id} value={s.slug} className="bg-[#0a192f]">{s.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={visibilityFilter}
                            onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'visible' | 'hidden')}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="all">Exibição: Todos</option>
                            <option value="visible">Exibição: Sim</option>
                            <option value="hidden">Exibição: Não</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value as 'all' | 'in_stock' | 'out_of_stock')}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-white/10 text-white focus:border-blue-500/50"
                        >
                            <option value="all">Estoque: Todos</option>
                            <option value="in_stock">Com Estoque</option>
                            <option value="out_of_stock">Sem Estoque</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="input-field py-2.5 pl-4 pr-10 appearance-none cursor-pointer bg-surface border-gray-300"
                        >
                            <option value="newest">Mais Recentes</option>
                            <option value="price_asc">Menor Preço</option>
                            <option value="price_desc">Maior Preço</option>
                            <option value="brand_asc">Marca (A-Z)</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <button
                        onClick={clearFilters}
                        className="btn-secondary py-2.5 px-4 whitespace-nowrap"
                    >
                        Limpar filtros
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowColumnSelector(!showColumnSelector)}
                            className="btn-primary bg-surface text-gray-700 border border-white/10 hover:bg-background py-2.5 px-4 flex items-center gap-2"
                        >
                            <Columns className="w-5 h-5" />
                            <span className="hidden sm:inline">Colunas</span>
                        </button>

                        {showColumnSelector && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-xl z-50 p-3 animate-fade-in">
                                <h4 className="text-sm font-bold text-white mb-2 px-1">Exibir Colunas</h4>
                                <div className="space-y-1">
                                    {Object.keys(visibleColumns).map((key) => {
                                        if (key === 'actions') return null;
                                        return (
                                            <label key={key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface/5 rounded-lg cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                                                    onChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                                                    className="rounded border-gray-300 bg-surface text-blue-400 focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-white/10 bg-surface shadow-2xl"> {/* Removed pb-16, fixed spacing */}
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-[#0a192f] border-b border-white/10">
                        <tr className="text-blue-300/60 text-[10px] font-mono uppercase tracking-widest">
                            <th className="py-4 px-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 bg-surface checked:bg-blue-600"
                                />
                            </th>
                            {visibleColumns.image && <th className="py-4 px-4 font-medium w-20">Img</th>}
                            {visibleColumns.name && <th className="py-4 px-4 font-medium">Produto</th>}
                            {visibleColumns.brand && <th className="py-4 px-4 font-medium">Marca</th>}
                            {/* {visibleColumns.model && <th className="py-4 px-4 font-medium">Modelo</th>} */}
                            {visibleColumns.category && <th className="py-4 px-4 font-medium">Categoria</th>}
                            {visibleColumns.price && <th className="py-4 px-4 font-medium">Preço</th>}
                            {visibleColumns.costPrice && <th className="py-4 px-4 font-medium">Custo</th>}
                            {visibleColumns.stock && <th className="py-4 px-4 font-medium">Estoque</th>}
                            {visibleColumns.condition && <th className="py-4 px-4 font-medium">Condição</th>}
                            {visibleColumns.status && <th className="py-4 px-4 font-medium">Disponibilidade</th>}
                            {visibleColumns.active && <th className="py-4 px-4 font-medium">Exibição Site</th>}
                            {visibleColumns.actions && <th className="py-4 px-4 font-medium text-right">Ações</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map(product => (
                            <tr key={product.id} className={`group transition-colors ${selectedIds.includes(product.id) ? 'bg-blue-600/5' : 'hover:bg-background'}`}>
                                <td className="py-3 px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="rounded border-gray-300 bg-surface checked:bg-blue-600"
                                    />
                                </td>
                                {visibleColumns.image && (
                                    <td className="py-3 px-4">
                                        <div className="w-10 h-10 rounded-lg bg-surface/10 overflow-hidden shrink-0 relative group">
                                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                            {isQuickEditMode && (
                                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-4 h-4 text-white" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    const processed = await processImage(file);
                                                                    const url = await uploadFile(processed);
                                                                    handleInlineUpdate(product, 'imageUrl', url);
                                                                } catch (error) {
                                                                    alert('Erro no upload');
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </td>
                                )}

                                {/* NAME */}
                                {visibleColumns.name && (
                                    <td className="py-3 px-4 font-medium text-white">
                                        {isQuickEditMode ? (
                                            <input
                                                className="input-field py-1 px-2 w-full min-w-[150px] text-sm bg-background border-white/10 text-white"
                                                value={product.name}
                                                onChange={(e) => handleInlineUpdate(product, 'name', e.target.value)}
                                            />
                                        ) : product.name}
                                    </td>
                                )}

                                {/* BRAND */}
                                {visibleColumns.brand && (
                                    <td className="py-3 px-4 text-gray-400">
                                        {isQuickEditMode ? (
                                            <select
                                                className="input-field py-1 px-2 w-28 text-sm bg-surface"
                                                value={product.brand}
                                                onChange={(e) => handleInlineUpdate(product, 'brand', e.target.value)}
                                            >
                                                <option value="">Selecione</option>
                                                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                            </select>
                                        ) : product.brand}
                                    </td>
                                )}

                                {/* MODEL REMOVED */}
                                {/* {visibleColumns.model && ...} */}

                                {/* CATEGORY */}
                                {visibleColumns.category && (
                                    <td className="py-3 px-4 text-gray-400 text-sm">
                                        {isQuickEditMode ? (
                                            <select
                                                className="input-field py-1 px-2 w-32 text-sm bg-surface"
                                                value={product.category}
                                                onChange={(e) => handleInlineUpdate(product, 'category', e.target.value)}
                                            >
                                                <option value="">Selecione</option>
                                                {allCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        ) : product.category}
                                    </td>
                                )}

                                {/* PRICE */}
                                {visibleColumns.price && (
                                    <td className="py-3 px-4 font-medium text-blue-400">
                                        {isQuickEditMode ? (
                                            <input
                                                type="number"
                                                className="input-field py-1 px-2 w-24 text-sm"
                                                value={product.price}
                                                onChange={(e) => handleInlineUpdate(product, 'price', e.target.value)}
                                            />
                                        ) : formatPrice(product.price)}
                                    </td>
                                )}

                                {/* COST */}
                                {visibleColumns.costPrice && (
                                    <td className="py-3 px-4 text-gray-400">
                                        {isQuickEditMode ? (
                                            <input
                                                type="number"
                                                className="input-field py-1 px-2 w-24 text-sm"
                                                value={product.costPrice || 0}
                                                onChange={(e) => handleInlineUpdate(product, 'costPrice', e.target.value)}
                                            />
                                        ) : (product.costPrice ? formatPrice(product.costPrice) : '-')}
                                    </td>
                                )}

                                {/* STOCK */}
                                {visibleColumns.stock && (
                                    <td className="py-3 px-4 text-white">
                                        {isQuickEditMode ? (
                                            <input
                                                type="number"
                                                className="input-field py-1 px-2 w-16 text-sm"
                                                value={product.stock || 0}
                                                onChange={(e) => handleInlineUpdate(product, 'stock', e.target.value)}
                                            />
                                        ) : (product.stock || 0)}
                                    </td>
                                )}

                                {/* CONDITION */}
                                {visibleColumns.condition && (
                                    <td className="py-3 px-4 text-sm text-gray-400">
                                        {isQuickEditMode ? (
                                            <select
                                                className="input-field py-1 px-2 w-28 text-sm bg-surface"
                                                value={product.condition}
                                                onChange={(e) => handleInlineUpdate(product, 'condition', e.target.value)}
                                            >
                                                {conditions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        ) : product.condition}
                                    </td>
                                )}

                                {/* STATUS (Disponibilidade) */}
                                {visibleColumns.status && (
                                    <td className="py-3 px-4 text-sm">
                                        {isQuickEditMode ? (
                                            <select
                                                className="input-field py-1 px-2 text-sm bg-surface w-32"
                                                value={product.status}
                                                onChange={(e) => handleInlineUpdate(product, 'status', e.target.value)}
                                            >
                                                {statuses.map(s => <option key={s.id} value={s.slug}>{s.name}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-full border text-[10px] font-bold uppercase ${
                                                product.status === 'em_estoque' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                            }`}>
                                                {product.status === 'em_estoque' ? 'Em estoque' : 'Por encomenda'}
                                            </span>
                                        )}
                                    </td>
                                )}

                                {/* VISIBILIDADE (Active) */}
                                {visibleColumns.active && (
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleInlineUpdate(product, 'active', !product.active)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                product.active ? 'bg-blue-600' : 'bg-surface'
                                            }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                                                product.active ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                        </button>
                                        <span className="ml-2 text-xs text-gray-400 font-medium">
                                            {product.active ? 'Sim' : 'Não'}
                                        </span>
                                    </td>
                                )}

                                {visibleColumns.actions && (
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDuplicate(product)}
                                                className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                title="Duplicar"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="py-8 text-center text-gray-400">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-gray-400 text-right">
                Mostrando {filteredProducts.length} produtos
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-6 animate-slide-up z-50">
                    <span className="text-white font-bold">{selectedIds.length} selecionados</span>
                    <div className="h-8 w-px bg-surface"></div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkVisibility(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors text-sm font-bold"
                        >
                            Mostrar (Site)
                        </button>
                        <button
                            onClick={() => handleBulkVisibility(false)}
                            className="px-4 py-2 bg-background text-gray-600 rounded-lg transition-colors text-sm font-bold"
                        >
                            Ocultar (Site)
                        </button>
                    </div>
                    
                    <div className="h-8 w-px bg-surface"></div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkStatus('em_estoque')}
                            className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-50 rounded-lg transition-colors text-sm font-bold"
                        >
                            Marcar: Em Estoque
                        </button>
                        <button
                            onClick={() => handleBulkStatus('por_encomenda')}
                            className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-sm font-bold"
                        >
                            Marcar: Por Encomenda
                        </button>
                    </div>

                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-bold flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
};
