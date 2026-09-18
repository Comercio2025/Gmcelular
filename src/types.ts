export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    // New fields
    brand: string;
    model: string;
    condition: 'Novo' | 'Usado' | 'Recondicionado';
    status: 'em_estoque' | 'por_encomenda';
    active: boolean;
    costPrice?: number; // For admin only
    stock?: number;
    featured?: boolean;
}

export interface Banner {
    id: string;
    imageUrl: string;
    title: string;
    link?: string;
    active: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
}

export interface Condition {
    id: string;
    name: string;
    slug: string; // e.g., 'new', 'used'
}

export interface ProductStatus {
    id: string;
    name: string;
    slug: string; // e.g., 'active', 'inactive'
    color?: string; // Optional badge color
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string; // HTML content
    active: boolean;
    orderIndex: number;
    // Visual Customization
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
    containerWidth?: 'contained' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    externalLink?: string; // If set, this page acts as a redirection
}

export interface FilterCriteria {
    category_id?: string;
    brand_id?: string;
    status_id?: string;
    condition_id?: string;
    featured?: boolean;
}

export interface CustomFilter {
    id: string;
    name: string;
    criteria: Record<string, any>;
    active: boolean;
    orderIndex: number;
}

export interface Promotion {
    id: string;
    title: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    orderIndex: number;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    tags?: string;
    active: boolean;
    orderIndex: number;
    publishedAt?: string | null;
    createdAt?: string;
}


export interface StoreConfig {
    storeName: string;
    logoUrl?: string; // Optional logo
    whatsappNumber: string;
    address?: string;
    description?: string;
    foundedYear?: string;
    workingHoursWeek?: string; // e.g. "Segunda a Sexta: 08:00 às 18:00"
    workingHoursSat?: string; // e.g. "Sábado: 07:30 às 13:00"
    servicesList?: string; // Comma separated

    // customizable labels
    menuHomeLabel?: string;
    footerServicesTitle?: string;
    footerHoursTitle?: string;

    // visual customization
    menuFontSize?: string; // e.g. "16px"
    menuTextColor?: string; // hex
    bannerFontSizeMobile?: string; // e.g. "20px"

    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
    };
    socialMedia?: {
        instagram?: string;
        facebook?: string;
    };
    facebookPixelId?: string;
    googleAdsId?: string; // AW-XXXXXXXX
    geminiApiKey?: string;
    geminiModel?: string;
    geminiRecommenderPrompt?: string;
}

export type PhoneUsageOption =
    | 'fotos_videos'
    | 'redes_sociais'
    | 'jogos'
    | 'trabalho_estudo'
    | 'musica_podcast'
    | 'navegacao_apps';

export interface PhonePriorityWeights {
    camera: number;
    performance: number;
    battery: number;
    costBenefit: number;
}

export interface PhoneRecommendationProfile {
    minBudget: number;
    maxBudget: number;
    preferredBrands: string[];
    usages: PhoneUsageOption[];
    priorities: PhonePriorityWeights;
    preferNew: boolean;
    needInStock: boolean;
}

export interface LocalRecommendationResult {
    product: Product;
    score: number;
    match: number;
    reasons: string[];
}

export interface AIRecommendationRequest {
    profile: PhoneRecommendationProfile;
    candidates: Array<{
        id: string;
        name: string;
        brand: string;
        price: number;
        condition: string;
        status: string;
        description: string;
        localScore: number;
        localMatch: number;
    }>;
}

export interface AIRecommendationResponse {
    ranked: Array<{
        id: string;
        score: number;
        justification: string;
    }>;
    summary?: string;
}
