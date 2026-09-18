import { useData } from '../contexts/DataContext';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PromocoesPage = () => {
    const { promotions, loading } = useData();

    const activePromotions = useMemo(() => {
        return promotions
            .filter(p => p.active)
            .sort((a, b) => a.orderIndex - b.orderIndex);
    }, [promotions]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500/30"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface pt-24">
            {/* Header / Title */}
            <div className="container mx-auto px-4 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link to="/" className="p-2 rounded-full hover:bg-background transition-colors">
                        <ArrowLeft className="text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-white">
                        Ofertas da Semana
                    </h1>
                </div>
                <p className="text-gray-400 max-w-2xl ml-12">
                    Confira nosso encarte digital com as melhores ofertas preparadas para você.
                </p>
            </div>

            {/* Promotions Feed */}
            <div className="container mx-auto px-0 md:px-4 max-w-3xl pb-20">
                {activePromotions.length > 0 ? (
                    <div className="flex flex-col gap-4 md:gap-8">
                        {activePromotions.map((promo) => (
                            <div
                                key={promo.id}
                                className="w-full bg-surface md:rounded-2xl shadow-sm overflow-hidden"
                            >
                                {promo.link ? (
                                    <a
                                        href={promo.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block cursor-pointer"
                                    >
                                        <img
                                            src={promo.imageUrl}
                                            alt={promo.title}
                                            className="w-full h-auto object-contain"
                                            loading="lazy"
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={promo.imageUrl}
                                        alt={promo.title}
                                        className="w-full h-auto object-contain"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-4">
                        <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">😢</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Sem ofertas no momento</h2>
                        <p className="text-gray-400">
                            Estamos atualizando nosso encarte. Volte em breve para conferir as novidades!
                        </p>
                        <Link to="/" className="btn-primary mt-6 inline-flex">
                            Voltar para o Início
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
