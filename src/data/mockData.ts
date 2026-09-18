import type { Product, StoreConfig, Banner, Category, Brand, Condition, ProductStatus } from '../types';

export const products: Product[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 8999,
        description: 'Titânio Natural, 256GB. O iPhone mais leve e resistente já criado.',
        imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
        category: 'Smartphones',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        condition: 'Novo',
        status: 'em_estoque',
        active: true,
        featured: true
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        price: 8599,
        description: 'IA integrada, Câmera de 200MP. O poder da inteligência artificial no seu bolso.',
        imageUrl: 'https://images.unsplash.com/photo-1706801646769-6126b8d4bb9f?w=800&q=80',
        category: 'Smartphones',
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        condition: 'Novo',
        status: 'em_estoque',
        active: true,
        featured: true
    },
    {
        id: '3',
        name: 'AirPods Pro 2',
        price: 1899,
        description: 'Cancelamento Ativo de Ruído com Áudio Espacial Personalizado.',
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
        category: 'Acessórios',
        brand: 'Apple',
        model: 'AirPods Pro 2',
        condition: 'Novo',
        status: 'em_estoque',
        active: true
    },
    {
        id: '4',
        name: 'iPhone 14 (Seminovo)',
        price: 3899,
        description: 'iPhone 14 128GB Azul - Bateria 95%, sem marcas de uso.',
        imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
        category: 'Smartphones',
        brand: 'Apple',
        model: 'iPhone 14',
        condition: 'Usado',
        status: 'em_estoque',
        active: true
    }
];

export const banners: Banner[] = [
    {
        id: '1',
        title: 'Lançamento iPhone 15',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&q=80',
        link: '/product/1',
        active: true
    },
    {
        id: '2',
        title: 'Promoção Samsung',
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1600&q=80',
        active: true
    },
    {
        id: '3',
        title: 'Acessórios em Oferta',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80',
        active: true
    }
];

export const categories: Category[] = [
    { id: '1', name: 'Smartphones', slug: 'smartphones' },
    { id: '2', name: 'Acessórios', slug: 'acessorios' },
    { id: '3', name: 'Tablets', slug: 'tablets' },
    { id: '4', name: 'Smartwatches', slug: 'smartwatches' }
];

export const brands: Brand[] = [
    { id: '1', name: 'Apple', slug: 'apple' },
    { id: '2', name: 'Samsung', slug: 'samsung' },
    { id: '3', name: 'Xiaomi', slug: 'xiaomi' },
    { id: '4', name: 'Motorola', slug: 'motorola' }
];

export const conditions: Condition[] = [
    { id: '1', name: 'Novo', slug: 'novo' },
    { id: '2', name: 'Usado', slug: 'usado' },
    { id: '3', name: 'Recondicionado', slug: 'recondicionado' },
    { id: '4', name: 'Vitrine', slug: 'vitrine' }
];

export const statuses: ProductStatus[] = [
    { id: '1', name: 'Em estoque', slug: 'em_estoque', color: 'green' },
    { id: '3', name: 'Por encomenda', slug: 'por_encomenda', color: 'blue' }
];

export const initialConfig: StoreConfig = {
    storeName: 'GM Eletrônicos',
    whatsappNumber: '33988451996',
    logoUrl: '/logo.png', // Assuming it's in public folder
    address: 'Avenida Presidente Castelo Branco 123 - Virgem da Lapa MG',
    description: 'Assistência técnica independente especializada em reparos de celulares multimarcas.',
    colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#0F172A',
        surface: 'rgba(255, 255, 255, 0.05)'
    },
    socialMedia: {
        instagram: '@gmcelular',
        facebook: '/gmcelular'
    },
    facebookPixelId: '',
    googleAdsId: ''
};
