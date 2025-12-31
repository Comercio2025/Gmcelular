
import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { MapPin, Clock, Phone, Instagram, Wrench, Smartphone, Laptop, Box } from 'lucide-react';

const Footer: React.FC = () => {
    const { config } = useStoreConfig();
    const whatsappLink = `https://wa.me/${config.whatsappNumber}`;
    const instagramLink = `https://instagram.com/${config.instagramHandle}`;

    return (
        <footer id="footer" className="bg-secondary text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white font-heading border-b-2 border-primary pb-2 mb-4 inline-block">{config.storeName}</h3>
                    <p className="flex items-start text-slate-400">
                        <MapPin className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" /> 
                        <span>{config.address}</span>
                    </p>
                     <p className="text-sm text-slate-500">Fundada em 2016</p>
                    <div className="flex space-x-6 pt-2">
                         <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                            <Phone className="w-5 h-5"/>
                            <span className="font-semibold">WhatsApp</span>
                        </a>
                        <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                            <Instagram className="w-5 h-5" />
                            <span className="font-semibold">Instagram</span>
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white font-heading border-b-2 border-primary pb-2 mb-4 inline-block">Atuação</h3>
                    <ul className="space-y-3 text-slate-400">
                        <li className="flex items-center"><Wrench className="w-4 h-4 mr-3 text-primary"/>Assistência Técnica</li>
                        <li className="flex items-center"><Smartphone className="w-4 h-4 mr-3 text-primary"/>Smartphones</li>
                        <li className="flex items-center"><Laptop className="w-4 h-4 mr-3 text-primary"/>Informática</li>
                        <li className="flex items-center"><Box className="w-4 h-4 mr-3 text-primary"/>Utilidades, Eletrônicos & Acessórios</li>
                    </ul>
                </div>

                <div className="space-y-4">
                     <h3 className="text-xl font-bold text-white font-heading border-b-2 border-primary pb-2 mb-4 inline-block">Horários</h3>
                    <div className="flex items-start text-slate-400">
                        <Clock className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                        <div>
                            <p><strong>Segunda a Sexta:</strong> 08:00 às 18:00</p>
                            <p><strong>Sábado:</strong> 07:30 às 13:00</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="text-center text-slate-500 text-sm mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                <span>&copy; {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.</span>
                <Link to="/login" className="hover:text-primary transition-colors duration-300">Área do Administrador</Link>
            </div>
        </footer>
    );
};

export default Footer;
