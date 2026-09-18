
import React from 'react';
import { Product } from '../types';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { Share2, MessageSquare, ShieldCheck, Hash } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  conditionName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, conditionName }) => {
  const { config } = useStoreConfig();
  const whatsappMessage = `Olá, tenho interesse no ${product.name}.`;
  const whatsappLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const productLink = `${window.location.origin}${window.location.pathname}#/?product=${product.id}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira este produto na ${config.storeName}: ${product.name}`,
        url: productLink,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(productLink).then(() => {
        alert('Link do produto copiado para a área de transferência!');
      });
    }
  };

  return (
    <div className="group relative bg-slate-800/60 rounded-xl shadow-lg ring-1 ring-white/10 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 flex flex-col">
      {product.statusId === 'status2' && ( // Por encomenda
        <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
          POR ENCOMENDA
        </div>
      )}
      <div className="relative aspect-square w-full">
        <img
          src={product.imageUrl || 'https://picsum.photos/600/600'}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        
        {product.details && (
          <p className="text-xs text-slate-400 mb-3 leading-tight">{product.details}</p>
        )}

        <div className="flex items-center text-xs text-slate-400 space-x-4 mb-4">
            {conditionName && <span className="flex items-center"><ShieldCheck size={14} className="mr-1.5 text-primary"/>{conditionName}</span>}
            {product.reference && <span className="flex items-center opacity-70"><Hash size={14} className="mr-1.5"/>{product.reference}</span>}
        </div>

        {product.price && (
          <div className="mb-4">
            <p className="text-2xl font-extrabold text-primary font-heading">
                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-sm text-slate-400 mt-1">
                ou 12x de {((product.price * 1.14) / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        )}
        <div className="mt-auto pt-4 space-y-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-500 transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chamar no WhatsApp
            </a>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center bg-primary/20 text-primary font-bold py-2.5 px-4 rounded-lg hover:bg-primary/30 transition-all duration-300 transform active:scale-95"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;