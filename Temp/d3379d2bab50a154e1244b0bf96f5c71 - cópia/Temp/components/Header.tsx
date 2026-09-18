
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Search, Phone, Instagram } from 'lucide-react';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { useData } from '../contexts/DataContext';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const { config } = useStoreConfig();
    const { pages } = useData();
    const location = useLocation();
    
    const whatsappLink = `https://wa.me/${config.whatsappNumber}`;
    const instagramLink = `https://instagram.com/${config.instagramHandle}`;

    const pageMap = useMemo(() => new Map(pages.map(p => [p.id, p.slug])), [pages]);

    const getMenuItemUrl = (item: any) => {
        switch (item.type) {
            case 'home':
                return '/';
            case 'page':
                return `/page/${pageMap.get(item.value) || ''}`;
            case 'link':
                return item.value;
            default:
                return '#';
        }
    };

    return (
        <div className="sticky top-0 z-40">
            {config.announcementBar.enabled && (
                <div className="bg-primary text-white text-center text-xs font-bold py-2 px-4 uppercase tracking-wider">
                    {config.announcementBar.text}
                </div>
            )}
            <div className="glassmorphism">
                <header className="container mx-auto px-4">
                    <div className="flex justify-between items-center gap-4 py-4">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-4">
                            <Logo className="h-10 md:h-12 w-auto" src={config.logoUrl} />
                            <div className="hidden md:block">
                               <p className="text-sm text-gray-400 leading-tight font-semibold">{config.storeName}</p>
                               <p className="text-xs text-gray-500 leading-tight">{config.slogan.split('.')[0]}</p>
                            </div>
                        </Link>

                        <div className="relative flex-grow max-w-2xl mx-4 hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="O que você está procurando?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 border-none rounded-full bg-slate-800/70 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors duration-300" aria-label="WhatsApp">
                                <Phone className="w-6 h-6"/>
                            </a>
                            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors duration-300" aria-label="Instagram">
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </header>
                 <nav className="hidden md:block border-t border-white/10">
                    <div className="container mx-auto px-4 flex justify-center items-center gap-6">
                        {config.headerMenu.map(item => {
                            const url = getMenuItemUrl(item);
                            const isActive = location.pathname === url;
                            const linkClass = `relative py-3 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`;

                            const activeIndicator = <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform scale-x-100 transition-transform duration-300"></span>;
                            
                            const content = (
                                <>
                                    {item.label}
                                    {isActive && activeIndicator}
                                </>
                            );

                            if (item.type === 'link') {
                                return <a key={item.id} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>{content}</a>;
                            }
                            return <Link key={item.id} to={url} className={linkClass}>{content}</Link>;
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
