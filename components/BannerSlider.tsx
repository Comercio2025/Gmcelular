
import React, { useState, useEffect, useCallback } from 'react';
import { Banner } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSliderProps {
    banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (banners.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = () => {
        if (banners.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    useEffect(() => {
        if (banners.length > 1) {
            const slideInterval = setInterval(nextSlide, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [nextSlide, banners.length]);
    
    if(!banners || banners.length === 0) return null;

    const positionClasses = {
        'center-center': 'justify-center items-center text-center',
        'bottom-left': 'justify-start items-end text-left',
        'bottom-center': 'justify-center items-end text-center',
        'top-left': 'justify-start items-start text-left',
        'top-center': 'justify-center items-start text-center',
    };

    const renderSlide = (banner: Banner) => {
        const textColorStyle = { color: banner.textColor || '#FFFFFF' };
        const textShadowStyle = { textShadow: '0px 3px 10px rgba(0, 0, 0, 0.8)' };
        
        const content = (
            <div className="relative w-full aspect-[3/1] bg-secondary">
                <img 
                    src={banner.imageUrl} 
                    alt={banner.altText} 
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 p-6 md:p-12 flex flex-col bg-black bg-opacity-60 ${positionClasses[banner.textPosition || 'center-center']}`}>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-heading" style={{...textColorStyle, ...textShadowStyle}}>{banner.title}</h2>
                    <p className="mt-3 text-md md:text-xl text-slate-200" style={{...textColorStyle, ...textShadowStyle}}>{banner.subtitle}</p>
                </div>
            </div>
        );

        if (banner.linkUrl) {
            return (
                <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                </a>
            );
        }
        return content;
    };


    return (
        <div className="relative w-full overflow-hidden">
            <div 
                className="flex transition-transform ease-in-out duration-700" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="flex-shrink-0 w-full">
                        {renderSlide(banner)}
                    </div>
                ))}
            </div>
            
            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-300"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-300"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={28} />
                    </button>

                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {banners.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${currentIndex === index ? 'bg-primary w-6' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BannerSlider;
