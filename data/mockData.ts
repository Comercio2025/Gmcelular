
import { Product, Category, Banner, StoreConfig, Brand, Condition, Status, Supplier, Page, MenuItem } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat1', name: 'Smartphones em Estoque' },
  { id: 'cat2', name: 'iPhone Lacrado' },
  { id: 'cat3', name: 'iPhone Swap' },
  { id: 'cat4', name: 'Xiaomi e Realme' },
  { id: 'cat5', name: 'Celulares Usados' },
];

export const initialBrands: Brand[] = [
    { id: 'brand1', name: 'Apple' },
    { id: 'brand2', name: 'Samsung' },
    { id: 'brand3', name: 'Xiaomi' },
    { id: 'brand4', name: 'Realme' },
];

export const initialConditions: Condition[] = [
    { id: 'cond1', name: 'Lacrado' },
    { id: 'cond2', name: 'Seminovo' },
    { id: 'cond3', name: 'Swap' },
    { id: 'cond4', name: 'Usado' },
];

export const initialStatuses: Status[] = [
    { id: 'status1', name: 'Estoque disponível' },
    { id: 'status2', name: 'Por encomenda' },
    { id: 'status3', name: 'Inativo' },
];

export const initialSuppliers: Supplier[] = [
    { id: 'sup1', name: 'Fornecedor Apple BR' },
    { id: 'sup2', name: 'Importados XYZ' },
    { id: 'sup3', name: 'Distribuidor Local' },
];


export const initialProducts: Product[] = [
  { id: '10', name: 'Iphone 11 128GB', category: 'cat3', price: 1695.00, imageUrl: 'https://picsum.photos/seed/white-iphone-11/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', reference: 'AP11SW128', supplierId: 'sup2', costUSD: 250, markup: 25.5, costBRL: 1312.5, profitBRL: 382.5, details: 'Bateria 85%, Tela Original' },
  { id: '11', name: 'Apple iPhone 12 128GB 6.1" (Bateria Trocada)', category: 'cat3', price: 1779.75, imageUrl: 'https://picsum.photos/seed/blue-iphone-12/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup2', costUSD: 280, details: 'Bateria Nova (100%), pequenas marcas de uso' },
  { id: '12', name: 'Apple iPhone 12 128GB 6.1', category: 'cat3', price: 1948.50, imageUrl: 'https://picsum.photos/seed/black-iphone-12/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup2', costUSD: 300 },
  { id: '13', name: 'iPhone 13 128GB (Bateria Trocada)', category: 'cat3', price: 2288.25, imageUrl: 'https://picsum.photos/seed/starlight-iphone-13/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup1', costUSD: 350, details: 'Bateria Nova (100%)' },
  { id: '14', name: 'Apple iPhone 13 128GB 6.1"', category: 'cat3', price: 2448.60, imageUrl: 'https://picsum.photos/seed/pink-iphone-13/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup1', costUSD: 380, details: 'Bateria 92%, sem marcas de uso' },
  { id: '15', name: 'iPhone 14 Pro Max 128GB A Esim Tela Trocada', category: 'cat3', price: 3282.65, imageUrl: 'https://picsum.photos/seed/purple-iphone-14-pro/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup1', costUSD: 500 },
  { id: '16', name: 'iPhone 14 Pro Max 256GB', category: 'cat3', price: 4587.80, imageUrl: 'https://picsum.photos/seed/space-black-iphone-14-pro/600/600', statusId: 'status1', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup1', costUSD: 700 },
  { id: '17', name: 'iPhone 15 Pro Max 256GB', category: 'cat3', price: 5262.98, imageUrl: 'https://picsum.photos/seed/dark-iphone-15-pro/600/600', statusId: 'status2', conditionId: 'cond3', brandId: 'brand1', supplierId: 'sup1', costUSD: 850 },
  { id: '18', name: 'iPhone 15 Pro Max Lacrado', category: 'cat2', price: 8999.90, imageUrl: 'https://picsum.photos/seed/iphone-box-sealed/600/600', statusId: 'status1', description: 'O mais novo lançamento da Apple com chip A17 Bionic.', conditionId: 'cond1', brandId: 'brand1', supplierId: 'sup1', costUSD: 1300 },
  { id: '19', name: 'Xiaomi Redmi Note 13', category: 'cat4', price: 1850.00, imageUrl: 'https://picsum.photos/seed/xiaomi-phone-display/600/600', statusId: 'status3', conditionId: 'cond1', brandId: 'brand3', supplierId: 'sup3', costUSD: 250 },
];

export const initialBanners: Banner[] = [
    { 
        id: 'banner1', 
        imageUrl: 'https://picsum.photos/seed/promo-banner/1200/400', 
        altText: 'Promoções da Semana', 
        linkUrl: '#',
        title: 'Ofertas da Semana',
        subtitle: 'Descontos de até 30% em modelos selecionados',
        textColor: '#FFFFFF',
        textPosition: 'center-center'
    },
    { 
        id: 'banner2', 
        imageUrl: 'https://picsum.photos/seed/new-iphones-banner/1200/400', 
        altText: 'Novidades e Lançamentos',
        title: 'Novos iPhones Chegaram!',
        subtitle: 'Confira os últimos lançamentos da Apple',
        textColor: '#FFFFFF',
        textPosition: 'bottom-left'
    },
];

export const initialPages: Page[] = [
    { 
        id: 'page_about_us', 
        title: 'Sobre Nós',
        slug: 'sobre-nos',
        isVisible: true,
        content: `
            <h2 class="text-2xl font-bold mb-4">Nossa História</h2>
            <p class="mb-4">Fundada em 2016, a GM Celular nasceu da paixão por tecnologia e do desejo de oferecer os melhores produtos e serviços para Virgem da Lapa e região.</p>
            <p>Somos especialistas em smartphones, informática e eletrônicos em geral, além de oferecermos uma assistência técnica de confiança.</p>
        `
    }
];

export const initialStoreConfig: StoreConfig = {
    storeName: "GM Celular",
    slogan: "Tudo em um só lugar! Cobrimos qualquer oferta.",
    logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAQlBMVEX///8A//8AgAAAgIAAgL8AmZkAmf8AmZkAl5cAgIAA//8AgIAA/wAAgIAA/wD//wAAgIAA//8AgL8AgL8AgIAA/wD//zO+g8AAAAAFXRSTlMAESIgM3aImaq7vMy9zN3u7/8/sO9yAAAEi0lEQVR4nO2by5LiMBBFCRd5yR5w/zueU2wSS5aC5U52v0+lB1VlS/bAtsws8n/2V5a/ZACGGASGIRiGQGAIhmEQGAJhmEEgDEYwDAJDMAyDICQYhiEQhsggEAZCMPcQiIAMg2EIBsIgEAZD5A+DIBQGQyAICUZAiBAZBBpBIQwCMQyDIBQyHyZ7GN4/DCAwBMMwCAmGIWQHhGGIQCAIsiEyCAmGIXJgCAaBIGQDySASAhmCIBiGQCAEw2QIDCFD5G4IgiHkAyEIIXwYBFkIgsj/CDQ2g8EgJBmG+B4GEZAhb48Q/yEI5kYcQGQI/L0hCFmI/H1IkL9VR0iQ//d3WUCQn39qI+Q1R6E6CIJAOARCsAgDIfYQB4Q8Rsi/3yOEIUgEAhmCPyI/P+5hCAkRMiCkj+B8Y/FvYfI/gh8R8k+fP/3fQf79e/j5l0eQU8x7kEfI45/PyF/Lz3/xRMgzMgb5A/y+hAh5pD7I/w0MBIQ8z90wCAkQ8t/4+ZcHlEcw5C10Q9/vL0IeiT8M8g/YIeRhyCOh+AciZCHuVQiFkFfE26EaBAl5d3wI/g/ZCDm/v5/3C0fIu8dDeISwCMX/1h3k58/7eR4hQ8hR58hP/g3kIeSX/w9f/jFk/+8pMi8/T/Qh7kEwCAmGIZyP6EMwhCFy+P6eRGAIGUJu/O0+Q/4oH2IQAiFk+PnL19/7e/38/B8b/f8xCMH/HyF/jBCyqR4jZHP9Qhhy+T4g5J8aQyAS8p9/aCLk95/eR4iQv1dHCLJ/e9+38f9RDIK/T4iQ/70fQiIEnm9h/z8Q/h+G5w+DID8hBDL1x2D1m+qPYT2GIYiP2pB70+pP7U2r/6k9E/SfqT/1x6C6359b/ck/a7eF/u+hM2j1n+oPQYj8EwP/g/3579b3/vIuCM13v/pTfz5f+q+6/uSfrb9Xf0aIPyH+3v/yG4Qgf+f/9d8f/iEIhCFIhsEwDIIgCAaBIBiGQBAEQyAMgyAIhkAYBkEQDMEgCILBEAyCIBiGQRCEQRCEgSAIgsEgCILAIAyCIBgEkiAYBEGQCDKIIAgyCCkIhSAE/Zc+xIQQmS9kIXf/m4+QP4T/S9m/kH0YBFk+RB6//j+xQciC8h/D5H8EEZlDyAf5t9c/pD4+b3//+Pnlv4S/kF8/P38+v34J/8X/IeSX/x/4/2IeyS/f+yMkhyB/P18/P39//vI/DIL8+/v5+UaQ/2t+f3//2P79/fN+If8X4g/Z/69/P/8X/v9C/pBvC4IgCCIQhCAIgiEIBsEgmQpBEMw+DIIgwzAIguH3gCCkXw/8fUqG9608QkCImJ8/P/8hP/+H//0e/iHkj7n6+fmff2j/T4KQiAgZ/P4v/0cIkR+B8If+fyE//z/C/hAEYRCEIBGGQSAIQyD7MPg+BMHQHwIhkCAIhSAEw2R/CAZBMAxDMAgCQRCEQSAIhkEQCIIgGIRBEEgEQyAIAiGI5hCCkP8bJCEIgiDIBoIgmQ9DIJCH3x8/hAyh+1/kH/lDkL9/5Bfy9//1Q5D//20IQyAMgyEQgCFkCAwhCMMgyHy5D4eQmD5kCIIgCCF/CHmEDCEIYQhZ//1zD/JDyJAfQiBE+j/28394//3zDyH/v38h5H/+P/z3z3vI//P+C/lD5J/vT3//2hD5h/z/e/+E/P9Pz7+//s//2wT/s+c/2j/8h/x/T8+Qz4//4P+8v28i5Pe/0hAy+f68/88fQv7p1/4u/gO2kK9fM0/u6QAAAABJRU5ErkJggg==',
    address: "Av. Pres. Castelo Branco, 123 – Centro – Virgem da Lapa – MG",
    whatsappNumber: "33988451996",
    instagramHandle: "gmcelular33",
    colors: {
        primary: '#007BFF',
        secondary: '#0A192F',
    },
    font: 'Inter',
    announcementBar: {
        text: 'Assistência Técnica Especializada e Acessórios',
        enabled: true,
    },
    headerMenu: [
        { id: 'menu1', label: 'Página Inicial', type: 'home', value: '/' },
        { id: 'menu2', label: 'Sobre Nós', type: 'page', value: 'page_about_us' },
    ],
};