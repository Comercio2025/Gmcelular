import { Product, Category, Banner, Brand, Condition, Status, Supplier, Page, StoreConfig } from '../types';

// IDs for relationships
const catSmartphonesId = 'cat1';
const catAccessoriesId = 'cat2';

const brandAppleId = 'brand1';
const brandSamsungId = 'brand2';
const brandXiaomiId = 'brand3';

const condNewId = 'cond1';
const condUsedId = 'cond2';

const statusActiveId = 'status1';
const statusOnDemandId = 'status2';
const statusInactiveId = 'status3';

const supplierIntlId = 'supp1';

export const mockCategories: Category[] = [
  { id: catSmartphonesId, name: 'Smartphones' },
  { id: catAccessoriesId, name: 'Acessórios' },
];

export const mockBrands: Brand[] = [
    { id: brandAppleId, name: 'Apple' },
    { id: brandSamsungId, name: 'Samsung' },
    { id: brandXiaomiId, name: 'Xiaomi' },
];

export const mockConditions: Condition[] = [
    { id: condNewId, name: 'Novo' },
    { id: condUsedId, name: 'Usado (Vitrine)' },
];

export const mockStatuses: Status[] = [
    { id: statusActiveId, name: 'Ativo' },
    { id: statusOnDemandId, name: 'Por Encomenda' },
    { id: statusInactiveId, name: 'Inativo' },
];

export const mockSuppliers: Supplier[] = [
    { id: supplierIntlId, name: 'Internacional' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'iPhone 15 Pro Max',
    category: catSmartphonesId,
    price: 7500,
    details: '256GB, Titânio Azul',
    description: 'O mais recente da Apple com chip A17 Bionic.',
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699311',
    statusId: statusActiveId,
    conditionId: condNewId,
    brandId: brandAppleId,
    reference: 'A3106',
    supplierId: supplierIntlId,
    costUSD: 999,
  },
  {
    id: 'prod2',
    name: 'Samsung Galaxy S24 Ultra',
    category: catSmartphonesId,
    price: 6800,
    details: '512GB, Preto',
    description: 'Câmera incrível e S Pen integrada.',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-ultra-sm-s928-483321-sm-s928bztqzto-539300269?$650_519_PNG$',
    statusId: statusActiveId,
    conditionId: condNewId,
    brandId: brandSamsungId,
    reference: 'S928B',
  },
    {
    id: 'prod3',
    name: 'Xiaomi Redmi Note 13',
    category: catSmartphonesId,
    price: 1800,
    details: '128GB, 8GB RAM, Preto',
    description: 'Ótimo custo-benefício.',
    imageUrl: 'https://i02.appmifile.com/i/product/pms/h=800/w=800/d=20240115/4566f09e605d2146e273f7331908d0c8.png',
    statusId: statusOnDemandId,
    conditionId: condNewId,
    brandId: brandXiaomiId,
    reference: '23016A',
  },
  {
    id: 'prod4',
    name: 'Carregador Anker 20W',
    category: catAccessoriesId,
    price: 150,
    details: 'USB-C, PowerIQ 3.0',
    description: 'Carregamento rápido para iPhones e outros dispositivos.',
    imageUrl: 'https://m.media-amazon.com/images/I/513y8L1b-FL._AC_UF894,1000_QL80_.jpg',
    statusId: statusActiveId,
    conditionId: condNewId,
  },
];

export const mockBanners: Banner[] = [
  {
    id: 'banner1',
    imageUrl: 'https://images.samsung.com/is/image/samsung/assets/br/2401/pcd/s24-ultra/Galaxy-S24-Ultra_PC_Main-KV_1440x640.jpg',
    altText: 'Banner do Galaxy S24 Ultra',
    linkUrl: '#',
    title: 'Galaxy S24 Ultra',
    subtitle: 'Com o poder do Galaxy AI',
    textColor: '#FFFFFF',
    textPosition: 'bottom-left'
  },
    {
    id: 'banner2',
    imageUrl: 'https://www.apple.com/v/iphone-15-pro/c/images/overview/closer-look/all_colors__d4264101co2e_large.jpg',
    altText: 'Banner do iPhone 15 Pro',
    linkUrl: '#',
    title: 'iPhone 15 Pro',
    subtitle: 'Titânio. Tão robusto. Tão leve. Tão Pro.',
    textColor: '#FFFFFF',
    textPosition: 'center-center'
  }
];

export const mockPages: Page[] = [
    { id: 'page1', title: 'Sobre Nós', slug: 'sobre-nos', content: '<h1>Sobre a GM Celular</h1><p>Desde 2016 oferecendo o melhor em tecnologia para Capanema e região.</p>', isVisible: true },
    { id: 'page2', title: 'Políticas de Garantia', slug: 'garantia', content: '<h1>Garantia</h1><p>Todos os nossos produtos novos possuem garantia de 1 ano contra defeitos de fabricação.</p>', isVisible: true },
];

const sobreNosPageId = 'page1';
const garantiaPageId = 'page2';

export const mockStoreConfig: StoreConfig = {
    storeName: "GM Celular",
    slogan: "Assistência técnica e variedades",
    logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAQlBMVEX///8A//8AgAAAgIAAgL8AmZkAmf8AmZkAl5cAgIAA//8AgIAA/wAAgIAA/wD//wAAgIAA//8AgL8AgL8AgIAA/wD//zO+g8AAAAAFXRSTlMAESIgM3aImaq7vMy9zN3u7/8/sO9yAAAEi0lEQVR4nO2by5LiMBBFCRd5yR5w/zueU2wSS5aC5U52v0+lB1VlS/bAtsws8n/2V5a/ZACGGASGIRiGQGAIhmEQGAJhmEEgDEYwDAJDMAyDICQYhiEQhsggEAZCMPcQiIAMg2EIBsIgEAZD5A+DIBQGQyAICUZAiBAZBBpBIQwCMQyDIBQyHyZ7GN4/DCAwBMMwCAmGIWQHhGGIQCAIsiEyCAmGIXJgCAaBIGQDySASAhmCIBiGQCAEw2QIDCFD5G4IgiHkAyEIIXwYBFkIgsj/CDQ2g8EgJBmG+B4GEZAhb48Q/yEI5kYcQGQI/L0hCFmI/H1IkL9VR0iQ//d3WUCQn39qI+Q1R6E6CIJAOARCsAgDIfYQB4Q8Rsi/3yOEIUgEAhmCPyI/P+5hCAkRMiCkj+B8Y/FvYfI/gh8R8k+fP/3fQf79e/j5l0eQU8x7kEfI45/PyF/Lz3/xRMgzMgb5A/y+hAh5pD7I/w0MBIQ8z90wCAkQ8t/4+ZcHlEcw5C10Q9/vL0IeiT8M8g/YIeRhyCOh+AciZCHuVQiFkFfE26EaBAl5d3wI/g/ZCDm/v5/3C0fIu8dDeISwCMX/1h3k58/7eR4hQ8hR58hP/g3kIeSX/w9f/jFk/+8pMi8/T/Qh7kEwCAmGIZyP6EMwhCFy+P6eRGAIGUJu/O0+Q/4oH2IQAiFk+PnL19/7e/38/B8b/f8xCMH/HyF/jBCyqR4jZHP9Qhhy+T4g5J8aQyAS8p9/aCLk95/eR4iQv1dHCLJ/e9+38f9RDIK/T4iQ/70fQiIEnm9h/z8Q/h+G5w+DID8hBDL1x2D1m+qPYT2GIYiP2pB70+pP7U2r/6k9E/SfqT/1x6C6359b/ck/a7eF/u+hM2j1n+oPQYj8EwP/g/3579b3/vIuCM13v/pTfz5f+q+6/uSfrb9Xf0aIPyH+3v/yG4Qgf+f/9d8f/iEIhCFIhsEwDIIgCAaBIBiGQBAEQyAMgyAIhkAYBkEQDMEgCILBEAyCIBiGQRCEQRCEgSAIgsEgCILAIAyCIBgEkiAYBEGQCDKIIAgyCCkIhSAE/Zc+xIQQmS9kIXf/m4+QP4T/S9m/kH0YBFk+RB6//j+xQciC8h/D5H8EEZlDyAf5t9c/pD4+b3//+Pnlv4S/kF8/P38+v34J/8X/IeSX/x/4/2IeyS/f+yMkhyB/P18/P39//vI/DIL8+/v5+UaQ/2t+f3//2P79/fN+If8X4g/Z/69/P/8X/v9C/pBvC4IgCCIQhCAIgiEIBsEgmQpBEMw+DIIgwzAIguH3gCCkXw/8fUqG9608QkCImJ8/P/8hP/+H//0e/iHkj7n6+fmff2j/T4KQiAgZ/P4v/0cIkR+B8If+fyE//z/C/hAEYRCEIBGGQSAIQyD7MPg+BMHQHwIhkCAIhSAEw2R/CAZBMAxDMAgCQRCEQSAIhkEQCIIgGIRBEEgEQyAIAiGI5hCCkP8bJCEIgiDIBoIgmQ9DIJCH3x8/hAyh+1/kH/lDkL9/5Bfy9//1Q5D//20IQyAMgyEQgCFkCAwhCMMgyHy5D4eQmD5kCIIgCCF/CHmEDCEIYQhZ//1zD/JDyJAfQiBE+j/28394//3zDyH/v38h5H/+P/z3z3vI//P+C/lD5J/vT3//2hD5h/z/e/+E/P9Pz7+//s//2wT/s+c/2j/8h/x/T8+Qz4//4P+8v28i5Pe/0hAy+f68/88fQv7p1/4u/gO2kK9fM0/u6QAAAABJRU5ErkJggg==',
    address: "Av. Barão do Rio Branco, 1234, Capanema - PA",
    whatsappNumber: "5591987654321",
    instagramHandle: "gmcapanema",
    colors: {
        primary: '#007BFF',
        secondary: '#0A192F',
    },
    font: 'Inter',
    announcementBar: {
        text: 'Novos iPhones 15 em estoque! Garanta o seu!',
        enabled: true,
    },
    headerMenu: [
        { id: 'menu1', label: 'Início', type: 'home', value: '/' },
        { id: 'menu2', label: 'Sobre Nós', type: 'page', value: sobreNosPageId },
        { id: 'menu3', label: 'Garantia', type: 'page', value: garantiaPageId },
    ],
};

export const mockApiData = {
    products: mockProducts,
    categories: mockCategories,
    banners: mockBanners,
    brands: mockBrands,
    conditions: mockConditions,
    statuses: mockStatuses,
    suppliers: mockSuppliers,
    pages: mockPages,
};
