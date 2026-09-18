import type { Product } from '../types';
import { ShoppingCart, Share2, Tag, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

const getConditionBadgeStyle = (condition: string) => {
    const normalized = (condition || '').trim().toLowerCase();
    if (normalized.includes('lacrado') || normalized.includes('novo')) {
        return 'bg-emerald-600 text-white font-extrabold border border-emerald-400/50 shadow-lg';
    }
    if (normalized.includes('swap')) {
        return 'bg-red-600 text-white font-extrabold border border-red-400/50 shadow-lg';
    }
    return 'bg-amber-600 text-white font-extrabold border border-amber-400/50 shadow-lg';
};

export const ProductCard = ({ product }: ProductCardProps) => {
    const { config } = useData();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to detail page
        e.stopPropagation();
        const message = `Olá! Tenho interesse no ${product.name} (${product.condition}) que vi no site.`;
        const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to detail page
        e.stopPropagation();
        try {
            await navigator.share({
                title: product.name,
                text: `Confira ${product.name} na ${config.storeName}`,
                url: window.location.href,
            });
        } catch (err) {
            // Fallback: copy to clipboard or ignore
            console.log('Error sharing:', err);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="glass-card rounded-2xl p-4 flex flex-col h-full group relative overflow-hidden ring-1 ring-white/5 hover:ring-primary/50 transition-all duration-300">
            {/* Condition Badge */}
            <div className="absolute top-2 left-2 z-20 flex gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider backdrop-blur-md ${getConditionBadgeStyle(product.condition)}`}>
                    {product.condition}
                </span>
                {product.status === 'por_encomenda' && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-white backdrop-blur-md border border-orange-400/50 flex items-center gap-1 shadow-lg">
                        <AlertCircle className="w-3 h-3" /> Sob Encomenda
                    </span>
                )}
            </div>

            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-black/20 group-hover:shadow-[0_0_30px_rgba(0,123,255,0.2)] transition-shadow duration-500">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!product.active ? 'grayscale' : 'group-hover:scale-110'}`}
                    loading="lazy"
                />
                <button
                    onClick={handleShare}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface hover:text-black"
                    title="Compartilhar"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-grow flex flex-col z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{product.brand}</span>
                </div>

                <h3 className="text-lg font-bold mb-1 truncate text-white group-hover:text-blue-400 transition-colors leading-tight" title={product.name}>{product.name}</h3>

                <p className="text-gray-400 text-xs mb-3 truncate font-light opacity-80" title={product.description}>
                    {product.description}
                </p>

                {product.status === 'por_encomenda' ? (
                    <p className="text-orange-400/80 text-xs mb-2 font-medium">Prazo de entrega: 15-20 dias</p>
                ) : (
                    <p className="text-green-400/80 text-xs mb-2 font-medium flex items-center gap-1 uppercase tracking-wider">
                        <Tag className="w-3 h-3" /> Disponível
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">À vista</span>
                        <span className="text-blue-400 font-bold text-xl drop-shadow-[0_2px_10px_rgba(0,123,255,0.3)]">{formatPrice(product.price)}</span>
                        <span className="text-[9px] text-gray-400 leading-tight mt-1 max-w-[100px]">
                            Parcelamos em até 12x no cartão de crédito (taxas a consultar)
                        </span>
                    </div>

                    <button
                        onClick={handleWhatsAppClick}
                        className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/25"
                        title="Chamar no WhatsApp"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm font-bold">Comprar</span>
                    </button>
                </div>
            </div>
        </Link>
    );
};

