import { StoreConfig } from '../types';

export const mockStoreConfig: StoreConfig = {
    storeName: "GM Celular",
    slogan: "A melhor loja de celulares da região",
    logoUrl: "/vite.svg",
    address: "Rua Exemplo, 123",
    whatsappNumber: "5511999999999",
    instagramHandle: "@gmcelular",
    colors: {
        primary: "#007BFF",
        secondary: "#0A192F"
    },
    font: "Inter",
    announcementBar: {
        text: "Frete grátis para toda a região!",
        enabled: true
    },
    headerMenu: [
        { id: "1", label: "Início", type: "home", value: "/" },
        { id: "2", label: "Catálogo", type: "link", value: "/catalogo" }
    ]
};
