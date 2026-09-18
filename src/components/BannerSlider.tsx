import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useData } from '../contexts/DataContext';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/effect-fade';

export const BannerSlider = () => {
    const { banners, config } = useData();
    const activeBanners = banners.filter(b => b.active);

    if (activeBanners.length === 0) return null;

    return (
        <div
            className="w-full h-[200px] md:h-[400px] mb-8 rounded-2xl overflow-hidden glass shadow-2xl relative group"
            style={{ '--mobile-title-size': config.bannerFontSizeMobile || '30px' } as React.CSSProperties}
        >
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                className="w-full h-full"
            >
                {activeBanners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full">
                            {banner.link ? (
                                <a href={banner.link} className="block w-full h-full" target="_self">
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        {...(index === 0 ? { fetchPriority: "high" } : {})}
                                        width="1600"
                                        height="400"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 pointer-events-none">
                                        <h2 className="text-white font-display font-bold drop-shadow-lg transform translate-y-4 opacity-0 transition-all duration-700 delay-300 slide-in text-[length:var(--mobile-title-size)] md:text-5xl">
                                            {banner.title}
                                        </h2>
                                    </div>
                                </a>
                            ) : (
                                <>
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        {...(index === 0 ? { fetchPriority: "high" } : {})}
                                        width="1600"
                                        height="400"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 pointer-events-none">
                                        <h2 className="text-white font-display font-bold drop-shadow-lg transform translate-y-4 opacity-0 transition-all duration-700 delay-300 slide-in text-[length:var(--mobile-title-size)] md:text-5xl">
                                            {banner.title}
                                        </h2>
                                    </div>
                                </>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
                .swiper-button-next, .swiper-button-prev {
                    color: white;
                    opacity: 0;
                    transition: opacity 0.3s;
                    background: rgba(0,0,0,0.3);
                    padding: 30px 20px;
                    border-radius: 10px;
                    backdrop-filter: blur(5px);
                }
                .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
                    opacity: 1;
                }
                .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                    background: #007BFF;
                    opacity: 1;
                }
                .swiper-slide-active .slide-in {
                    transform: translateY(0);
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};
