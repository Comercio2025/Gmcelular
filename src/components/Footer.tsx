
import { MapPin, Phone, Instagram, Clock, Store, Globe, Smartphone, Monitor } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Footer = () => {
    const { config } = useData();

    // Default services if empty
    const services = config.servicesList
        ? config.servicesList.split(',').map(s => s.trim())
        : ['Assistência Técnica', 'Smartphones', 'Informática', 'Utilidades, Eletrônicos & Acessórios'];

    return (
        <footer className="mt-auto py-12 border-t border-white/5 bg-[#0a101e] text-white">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Column 1: Store Info */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">{config.storeName}</h3>
                        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                    </div>

                    {config.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {config.description}
                        </p>
                    )}

                    <div className="flex items-start gap-3 text-gray-400">
                        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                        <p className="text-sm font-light leading-relaxed">
                            {config.address || 'Endereço não configurado'}
                        </p>
                    </div>

                    {config.foundedYear && (
                        <p className="text-gray-400 text-xs pl-8">Fundada em {config.foundedYear}</p>
                    )}

                    {/* Google Maps Integration */}
                    <div className="pt-2">
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-white/10 relative bg-gray-800">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(config.address || 'Virgem da Lapa, MG')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                title="Localização da Loja"
                                className="filter grayscale hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                            ></iframe>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address || 'Virgem da Lapa, MG')}`}
                            target="_blank"
                            className="text-xs text-blue-400 mt-2 block hover:underline"
                        >
                            Ver no Google Maps
                        </a>
                    </div>

                    <div className="flex gap-6 pt-2 pl-1">
                        <a
                            href={`https://wa.me/${config.whatsappNumber}`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors"
                        >
                            <Phone className="w-4 h-4" /> WhatsApp
                        </a>
                        {config.socialMedia?.instagram && (
                            <a
                                href={config.socialMedia.instagram.startsWith('http') ? config.socialMedia.instagram : `https://instagram.com/${config.socialMedia.instagram.replace('@', '')}`}
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-pink-400 transition-colors"
                            >
                                <Instagram className="w-4 h-4" /> Instagram
                            </a>
                        )}
                    </div>
                </div>

                {/* Column 2: Services / Acting */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">{config.footerServicesTitle || 'Atuação'}</h3>
                        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                    </div>

                    <ul className="space-y-3">
                        {services.map((service, index) => (
                            <li key={index} className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                {index === 0 && <Store className="w-4 h-4 text-blue-400 opacity-80" />}
                                {index === 1 && <Smartphone className="w-4 h-4 text-blue-400 opacity-80" />}
                                {index === 2 && <Monitor className="w-4 h-4 text-blue-400 opacity-80" />}
                                {index >= 3 && <Globe className="w-4 h-4 text-blue-400 opacity-80" />}
                                {service}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Hours */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">{config.footerHoursTitle || 'Horários'}</h3>
                        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-gray-400">
                            <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                            <div className="space-y-1">
                                <p className="text-sm">
                                    <strong className="text-gray-300 block mb-1">Segunda a Sexta:</strong>
                                    {config.workingHoursWeek || '08:00 às 18:00'}
                                </p>
                                <p className="text-sm">
                                    <strong className="text-gray-300 block mb-1 mt-3">Sábado:</strong>
                                    {config.workingHoursSat || '08:00 às 12:00'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-600 font-light text-xs">
                    &copy; {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.
                    <a href="/#/admin" className="ml-4 hover:text-blue-400 transition-colors">Área do Administrador</a>
                </p>
            </div>
        </footer>
    );
};
