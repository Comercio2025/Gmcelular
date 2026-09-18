import React, { useState, useEffect } from 'react';
import { mockProducts, mockStoreConfig } from '../../data/mockData';
import { Product } from '../types';
import { Phone, CheckCircle, Search } from 'lucide-react';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulating data load
        setProducts(mockProducts);
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            {/* Header */}
            <header style={{ backgroundColor: mockStoreConfig.colors.primary }} className="text-white py-6 shadow-lg">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold font-heading">{mockStoreConfig.storeName}</h1>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full py-2 px-4 pr-10 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                    <a
                        href={`https://wa.me/${mockStoreConfig.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        WhatsApp
                    </a>
                </div>
            </header>

            {/* Announcement Bar */}
            {mockStoreConfig.announcementBar.enabled && (
                <div className="bg-slate-900 text-white text-center py-2 text-sm">
                    {mockStoreConfig.announcementBar.text}
                </div>
            )}

            {/* Hero / Banner */}
            <div className="bg-white py-12 border-b">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-slate-800">{mockStoreConfig.slogan}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Confira nossa seleção exclusiva de aparelhos novos e seminovos com garantia e procedência.</p>
                </div>
            </div>

            {/* Product Grid */}
            <main className="container mx-auto px-4 py-12">
                <h3 className="text-2xl font-bold mb-8 text-slate-800 border-l-4 border-blue-500 pl-4">Destaques</h3>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="h-64 bg-gray-100 relative group">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        Disponível
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="text-sm text-gray-500 mb-1">{product.details}</div>
                                    <h4 className="font-bold text-lg mb-2 text-slate-900 line-clamp-2">{product.name}</h4>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

                                    <div className="mt-auto">
                                        <div className="text-2xl font-bold text-blue-600 mb-3">
                                            {product.price ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Consulte'}
                                        </div>

                                        <a
                                            href={`https://wa.me/${mockStoreConfig.whatsappNumber}?text=Olá, tenho interesse no produto: ${product.name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-slate-900 text-white font-semibold py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Tenho Interesse
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Nenhum produto encontrado.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-gray-300 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-white text-lg font-bold mb-4">GM Celular</h4>
                        <p className="text-sm">{mockStoreConfig.address}</p>
                        <p className="text-sm mt-2">{mockStoreConfig.email}</p>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-bold mb-4">Links Úteis</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Catálogo</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-bold mb-4">Horário de Atendimento</h4>
                        <p className="text-sm">{mockStoreConfig.workingHours}</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} GM Celular. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
