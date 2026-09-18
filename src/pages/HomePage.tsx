import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { BannerSlider } from '../components/BannerSlider';
import { ProductFilters } from '../components/ProductFilters';
import { useData } from '../contexts/DataContext';
import { LoaderCircle } from 'lucide-react';

const normalizeFilterValue = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');

export const HomePage = () => {
    const { products, loading, customFilters, categories, brands, statuses, conditions } = useData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilterId, setActiveFilterId] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'brand_asc' | 'newest' | null>(null);

    const handleSelectFilter = (filterId: string) => {
        setActiveFilterId(filterId);
        const params = new URLSearchParams(searchParams);

        if (filterId === 'all') {
            params.delete('filtro');
            params.delete('filter');
        } else {
            const selectedFilter = customFilters.find(f => f.id === filterId);
            if (selectedFilter) {
                const shareableValue = normalizeFilterValue(selectedFilter.name);
                params.set('filtro', shareableValue);
            }
        }
        setSearchParams(params, { replace: true });
    };

    useEffect(() => {
        if (customFilters.length === 0) return;

        const filterParam = searchParams.get('filtro') || searchParams.get('filter');

        if (!filterParam) {
            if (activeFilterId !== 'all') {
                setActiveFilterId('all');
            }
            return;
        }

        const normalizedParam = normalizeFilterValue(filterParam);
        const matchedFilter = customFilters.find((filter) =>
            filter.id === filterParam || normalizeFilterValue(filter.name) === normalizedParam
        );

        if (matchedFilter) {
            if (activeFilterId !== matchedFilter.id) {
                setActiveFilterId(matchedFilter.id);
            }
        } else if (activeFilterId !== 'all') {
            setActiveFilterId('all');
        }
    }, [searchParams, customFilters]);

    const filteredProducts = useMemo(() => {
        const activeFilter = activeFilterId !== 'all' ? customFilters.find(f => f.id === activeFilterId) : null;

        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            // Always filter out inactive for public view
            const isVisible = product.active !== false;

            let matchesFilter = true;
            if (activeFilter && activeFilter.criteria) {
                const c = activeFilter.criteria;
                // Category Match
                if (c.category_id) {
                    const catName = categories.find(cat => cat.id === c.category_id)?.name;
                    if (product.category !== catName) matchesFilter = false;
                }
                // Brand Match
                if (matchesFilter && c.brand_id) {
                    const brandName = brands.find(b => b.id === c.brand_id)?.name;
                    if (product.brand !== brandName) matchesFilter = false;
                }
                // Status/Condition/Featured
                if (matchesFilter && c.status_id) {
                    const statusObj = statuses.find(s => s.id === c.status_id);
                    if (statusObj && product.status !== statusObj.slug) matchesFilter = false;
                }
                if (matchesFilter && c.condition_id) {
                    const condName = conditions.find(co => co.id === c.condition_id)?.name;
                    if (condName && product.condition !== condName) matchesFilter = false;
                }
                if (matchesFilter && c.featured) {
                    if (!product.featured) matchesFilter = false;
                }
            }

            return matchesSearch && matchesFilter && isVisible;
        });

        // Apply Sorting
        if (sortBy) {
            result = [...result].sort((a, b) => {
                switch (sortBy) {
                    case 'newest': return parseInt(b.id) - parseInt(a.id); // Assuming ID correlates with time
                    case 'price_asc': return a.price - b.price;
                    case 'price_desc': return b.price - a.price;
                    case 'brand_asc': return a.brand.localeCompare(b.brand);
                    default: return 0;
                }
            });
        }

        return result;
    }, [products, searchTerm, activeFilterId, customFilters, categories, brands, statuses, conditions, sortBy]);

    if (loading) {
        return (
            <Layout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <LoaderCircle className="w-10 h-10 text-blue-400 animate-spin" />
                    <p className="text-gray-400 animate-pulse">Carregando catálogo...</p>
                </div>
            </Layout>
        );
    }

    // Sort filters by order
    const sortedFilters = [...customFilters].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <Layout>
            <BannerSlider />

            <div className="mt-8 mb-12">
                <ProductFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Custom Filters Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                    <button
                        onClick={() => handleSelectFilter('all')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${activeFilterId === 'all'
                            ? 'bg-blue-600 text-white border-blue-500/30'
                            : 'bg-surface/5 text-gray-400 border-white/10 hover:bg-surface/10'
                            }`}
                    >
                        Todos
                    </button>
                    {sortedFilters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => handleSelectFilter(filter.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${activeFilterId === filter.id
                                ? 'bg-blue-600 text-white border-blue-500/30'
                                : 'bg-surface/5 text-gray-400 border-white/10 hover:bg-surface/10'
                                }`}
                        >
                            {filter.name}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {activeFilterId === 'all' ? 'Todos os Produtos' : customFilters.find(f => f.id === activeFilterId)?.name}
                        </h2>
                        <span className="text-sm text-gray-300">{filteredProducts.length} produtos encontrados</span>
                    </div>

                    <select
                        value={sortBy || ''}
                        onChange={(e) => setSortBy(e.target.value as any || null)}
                        className="bg-black/20 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500/30 cursor-pointer"
                        aria-label="Ordenar produtos"
                    >
                        <option value="">Ordenar por...</option>
                        <option value="newest">Mais Recentes</option>
                        <option value="price_asc">Menor Preço</option>
                        <option value="price_desc">Maior Preço</option>
                        <option value="brand_asc">Marca (A-Z)</option>
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface/5 rounded-2xl border border-white/5">
                        <p className="text-gray-400 text-lg">Nenhum produto encontrado.</p>
                        <button
                            onClick={() => { setSearchTerm(''); handleSelectFilter('all'); }}
                            className="mt-4 text-blue-400 hover:underline text-sm"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};
