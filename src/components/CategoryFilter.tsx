import { useData } from '../contexts/DataContext';

interface CategoryFilterProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
    const { categories } = useData();

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
                onClick={() => onSelectCategory('all')}
                className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300 border ${selectedCategory === 'all'
                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.05] z-10'
                    : 'bg-surface/5 text-gray-400 border-white/10 hover:border-blue-500/50 hover:text-blue-400'
                    } rounded-none`}
            >
                [ Todos ]
            </button>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.name)}
                    className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300 border ${selectedCategory === category.name
                        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.05] z-10'
                        : 'bg-surface/5 text-gray-400 border-white/10 hover:border-blue-500/50 hover:text-blue-400'
                        } rounded-none`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};
