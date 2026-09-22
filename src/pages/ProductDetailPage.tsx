import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { ShoppingCart, ArrowLeft, Share2, Tag, ShieldCheck, Truck, AlertCircle } from 'lucide-react';

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, config } = useData();

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <Layout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500/50" />
                    <h2 className="text-2xl font-bold text-white">Produto não encontrado</h2>
                    <p className="text-gray-400">O produto que você procura não existe ou foi removido.</p>
                    <button onClick={() => navigate('/')} className="btn-primary mt-4">
                        Voltar para a Home
                    </button>
                </div>
            </Layout>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    const handleWhatsAppClick = () => {
        const message = `Olá! Vi o ${product.name} (${product.condition}) no site e gostaria de saber mais informações.`;
        const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                text: `Confira o ${product.name} na ${config.storeName}`,
                url: window.location.href,
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    const formatDisplayDescription = (desc?: string): string => {
        if (!desc || !desc.trim()) {
            return "Nenhuma descrição detalhada disponível para este item.";
        }
        let text = desc
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');

        if (!text.includes('\n')) {
            text = text
                .replace(/([^\n])\s*[•*]\s*/g, '$1\n• ')
                .replace(/^[•*]\s*/, '• ')
                .replace(/\s*(CONDIÇÃO[^\n:]*:|OBSERVAÇ[ÕO]ES[^\n:]*:|GARANTIA[^\n:]*:)/gi, '\n\n$1\n');
        }

        return text.trim();
    };

    return (
        <Layout>
            <div className="py-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Visual Section */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-3xl overflow-hidden aspect-square relative group ring-1 ring-white/10">
                             <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider backdrop-blur-md ${
                                    (product.condition || '').toLowerCase().includes('lacrado') || (product.condition || '').toLowerCase().includes('novo')
                                        ? 'bg-[#059669] text-white border border-[#34d399]/70 shadow-lg'
                                        : (product.condition || '').toLowerCase().includes('swap')
                                        ? 'bg-[#dc2626] text-white border border-[#f87171]/70 shadow-lg'
                                        : 'bg-[#d97706] text-white border border-[#fbbf24]/70 shadow-lg'
                                }`}>
                                    {product.condition}
                                </span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="absolute top-4 right-4 p-3 rounded-2xl bg-black/40 text-white backdrop-blur-xl border border-white/10 hover:bg-surface hover:text-black transition-all"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-black">{product.brand}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">{product.category}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 font-display italic tracking-tight">
                                {product.name}
                            </h1>
                            
                            {/* Availability Badge */}
                            <div className="flex items-center gap-2 mb-8">
                                {product.status === 'em_estoque' ? (
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        EM ESTOQUE
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        POR ENCOMENDA
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Pricing Box */}
                        <div className="glass-card rounded-3xl p-8 mb-8 border-l-4 border-l-primary relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Tag className="w-24 h-24 text-white" />
                            </div>
                            <span className="text-gray-400 text-sm mb-1 block">Preço promocional à vista</span>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_2px_15px_rgba(59,130,246,0.3)]">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm italic">
                                Ou em até 12x no cartão de crédito <span className="text-white/60 font-medium">(consulte taxas)</span>
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-8 space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-400" />
                                Sobre o Produto
                            </h3>
                            <div className="text-gray-300 leading-relaxed text-base sm:text-lg font-light whitespace-pre-line bg-surface/30 p-5 rounded-2xl border border-white/5">
                                {formatDisplayDescription(product.description)}
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-2 bg-surface/5 p-3 rounded-2xl border border-white/5">
                                    <Truck className="w-4 h-4 text-blue-400" />
                                    <span>Entrega rápida ou retirada em loja</span>
                                </div>
                                <div className="flex items-center gap-2 bg-surface/5 p-3 rounded-2xl border border-white/5">
                                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                                    <span>Garantia oficial de 12 meses</span>
                                </div>
                            </div>

                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-blue-600 hover:bg-blue-600-dark text-white py-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:shadow-primary/40 hover:-translate-y-1"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                <span className="text-xl font-black tracking-wide uppercase">Garantir meu aparelho</span>
                            </button>
                            
                            <p className="text-center text-gray-400 text-xs uppercase tracking-widest font-bold opacity-50">
                                Atendimento personalizado via WhatsApp
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
