import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const ProductFilters = ({ searchTerm, onSearchChange }: ProductFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-0 mb-8 border border-white/10 bg-[#0a192f]/20">
            <div className="relative flex-grow group border-r border-white/10">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                    type="text"
                    placeholder="BUSCAR_EQUIPAMENTO_OU_MODELO..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-transparent border-none pl-14 pr-6 py-5 text-white placeholder:text-gray-700 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono text-xs tracking-widest uppercase"
                />
            </div>

            <button className="flex items-center justify-center gap-3 px-10 py-5 bg-blue-500/5 hover:bg-blue-500 text-gray-400 hover:text-white transition-all group/filter-btn border-l border-white/10 md:border-l-0">
                <Filter className="w-4 h-4 group-hover/filter-btn:rotate-180 transition-transform duration-500" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Smart_Filters</span>
            </button>
        </div>
    );
};
