
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import BannerSlider from '../components/BannerSlider';
import { useData } from '../contexts/DataContext';
import { Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories, banners, statuses, conditions } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const conditionMap = useMemo(() => new Map(conditions.map(c => [c.id, c.name])), [conditions]);

  const activeStatusName = "Inativo";
  const inactiveStatusId = useMemo(() => {
      const inactiveStatus = statuses.find(s => s.name === activeStatusName);
      return inactiveStatus ? inactiveStatus.id : null;
  }, [statuses]);
  
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.statusId !== inactiveStatusId)
      .filter(product => {
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [products, searchTerm, selectedCategory, inactiveStatusId]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-slate-200">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <BannerSlider banners={banners} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
      
        {/* Mobile Search & Category Title */}
        <div className="sm:hidden mb-6">
          <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border-none rounded-full bg-slate-800/70 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
              />
          </div>
        </div>

        <div className="my-8">
            <h2 className="text-4xl font-extrabold text-center mb-2 text-white font-heading">Nosso Catálogo</h2>
            <p className="text-center text-slate-400">Explore nossos produtos e novidades</p>
        </div>

        {/* Category Chips */}
        <div className="sticky top-[72px] md:top-[115px] bg-background/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 mb-8">
            <div className="container mx-auto">
              <div className="category-nav flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center">
                  <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex-shrink-0 transform active:scale-95 ${
                          selectedCategory === null 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/80'
                      }`}
                  >
                      Todos
                  </button>
                  {categories.map(category => (
                      <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                           className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex-shrink-0 transform active:scale-95 ${
                              selectedCategory === category.id 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/80'
                          }`}
                      >
                          {category.name}
                      </button>
                  ))}
              </div>
            </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    conditionName={product.conditionId ? conditionMap.get(product.conditionId) : undefined}
                />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white">Nenhum produto encontrado</h3>
            <p className="text-slate-400 mt-2">Tente ajustar sua busca ou selecionar outra categoria.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
