import { StoreConfig } from '../src/types';

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

export const mockCategories = [
    { id: "1", name: "Celulares" },
    { id: "2", name: "Acessórios" },
];

export const mockProducts = [
    {
        id: "1",
        name: "iPhone 15 Pro Max",
        category: "1",
        price: 8500.00,
        details: "Bateria 100% - Novo",
        description: "O melhor iPhone já criado com titânio.",
        imageUrl: "https://placehold.co/300x400/1e293b/white?text=iPhone+15",
        statusId: "available",
    },
    {
        id: "2",
        name: "Samsung Galaxy S24 Ultra",
        category: "1",
        price: 7800.00,
        details: "12GB RAM - 512GB",
        description: "Inteligência Artificial Galaxy AI.",
        imageUrl: "https://placehold.co/300x400/1e293b/white?text=Galaxy+S24",
        statusId: "available",
    },
    {
        id: "3",
        name: "Carregador Rápido 20W",
        category: "2",
        price: 150.00,
        details: "Original",
        description: "Carregamento turbo para seu dispositivo.",
        imageUrl: "https://placehold.co/300x400/1e293b/white?text=Carregador",
        statusId: "available",
    }
];
