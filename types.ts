
export interface Category {
  id: string;
  name:string;
  parentId?: string; // For subcategories
}

export interface Brand {
  id: string;
  name: string;
}

export interface Condition {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string; // This will store the category ID
  price?: number; // Selling price in BRL
  details?: string; // Additional details like battery health, etc.
  description?: string;
  imageUrl: string; // can be a URL or a base64 data URI
  statusId: string;
  conditionId?: string;
  brandId?: string;
  reference?: string;
  supplierId?: string;
  costUSD?: number;
  costBRL?: number;
  markup?: number; // percentage
  profitBRL?: number;
}

export interface Banner {
  id: string;
  imageUrl: string; // Can be a URL or a base64 data URI
  altText: string;
  linkUrl?: string; // Optional URL to navigate to on click
  title: string;
  subtitle: string;
  textColor?: string; // e.g., '#FFFFFF'
  textPosition?: 'center-center' | 'bottom-left' | 'bottom-center' | 'top-left' | 'top-center';
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    isVisible: boolean;
}

export interface MenuItem {
    id: string;
    label: string;
    type: 'home' | 'page' | 'link';
    value: string; // page ID for 'page', URL for 'link', '/' for 'home'
}


export interface StoreConfig {
    storeName: string;
    slogan: string;
    logoUrl: string; // Can be a URL or a base64 data URI
    address: string;
    whatsappNumber: string;
    instagramHandle: string;
    colors: {
        primary: string;
        secondary: string;
    };
    font: string;
    announcementBar: {
        text: string;
        enabled: boolean;
    };
    headerMenu: MenuItem[];
}