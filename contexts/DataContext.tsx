
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Product, Category, Banner, Brand, Condition, Status, Supplier, Page } from '../types';
import { mockApiData } from '../data/mockData';

interface DataContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  brands: Brand[];
  conditions: Condition[];
  statuses: Status[];
  suppliers: Supplier[];
  pages: Page[];
  loading: boolean;
  error: string | null;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveAllProductChanges: (updatedProducts: Product[]) => Promise<void>;
  
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<Banner>;
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  addBrand: (brand: Omit<Brand, 'id'>) => Promise<Brand>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;

  addCondition: (condition: Omit<Condition, 'id'>) => Promise<Condition>;
  updateCondition: (id: string, condition: Partial<Condition>) => Promise<void>;
  deleteCondition: (id: string) => Promise<void>;

  addStatus: (status: Omit<Status, 'id'>) => Promise<Status>;
  updateStatus: (id: string, status: Partial<Status>) => Promise<void>;
  deleteStatus: (id: string) => Promise<void>;

  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  addPage: (page: Omit<Page, 'id'>) => Promise<Page>;
  updatePage: (id: string, page: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;

  bulkUpdateProducts: (newProducts: Product[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        try {
            setProducts(mockApiData.products || []);
            setCategories(mockApiData.categories || []);
            setBanners(mockApiData.banners || []);
            setBrands(mockApiData.brands || []);
            setConditions(mockApiData.conditions || []);
            setStatuses(mockApiData.statuses || []);
            setSuppliers(mockApiData.suppliers || []);
            setPages(mockApiData.pages || []);
            setError(null);
        } catch (err: any) {
             console.error("Failed to load mock data:", err);
             setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, 500); // 500ms delay
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mock Generic CRUD Functions
  const createCrudFunctions = <T extends { id: string }>(
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const addItem = async (item: Omit<T, 'id'>): Promise<T> => {
        const newItem = { ...item, id: `mock_${Date.now()}` } as T;
        return new Promise(resolve => {
            setTimeout(() => {
                setState(prev => [...prev, newItem]);
                resolve(newItem);
            }, 200);
        });
    };
    const updateItem = async (id: string, itemUpdate: Partial<Omit<T, 'id'>>) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                setState(prev => prev.map(item => item.id === id ? { ...item, ...itemUpdate } : item));
                resolve();
            }, 200);
        });
    };
    const deleteItem = async (id: string) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                setState(prev => prev.filter(item => item.id !== id));
                resolve();
            }, 200);
        });
    };
    return { addItem, updateItem, deleteItem };
  };

  const { addItem: addProduct, updateItem: updateProduct, deleteItem: deleteProduct } = createCrudFunctions<Product>(setProducts);
  const { addItem: addCategory, updateItem: updateCategory, deleteItem: deleteCategory } = createCrudFunctions<Category>(setCategories);
  const { addItem: addBanner, updateItem: updateBanner, deleteItem: deleteBanner } = createCrudFunctions<Banner>(setBanners);
  const { addItem: addBrand, updateItem: updateBrand, deleteItem: deleteBrand } = createCrudFunctions<Brand>(setBrands);
  const { addItem: addCondition, updateItem: updateCondition, deleteItem: deleteCondition } = createCrudFunctions<Condition>(setConditions);
  const { addItem: addStatus, updateItem: updateStatus, deleteItem: deleteStatus } = createCrudFunctions<Status>(setStatuses);
  const { addItem: addSupplier, updateItem: updateSupplier, deleteItem: deleteSupplier } = createCrudFunctions<Supplier>(setSuppliers);
  const { addItem: addPage, updateItem: updatePage, deleteItem: deletePage } = createCrudFunctions<Page>(setPages);

  // Special Functions
  const saveAllProductChanges = async (updatedProducts: Product[]) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
            setProducts(updatedProducts);
            resolve();
        }, 200);
      });
  };
  
  const bulkUpdateProducts = async (newProducts: Product[]) => {
      await saveAllProductChanges(newProducts);
      // Removed fetchData() to persist bulk changes within the session
  };

  return (
    <DataContext.Provider value={{
      products, categories, banners, brands, conditions, statuses, suppliers, pages, loading, error,
      addProduct: addProduct as (product: Omit<Product, 'id'>) => Promise<Product>,
      updateProduct, deleteProduct, saveAllProductChanges,
      addCategory: addCategory as (category: Omit<Category, 'id'>) => Promise<Category>,
      updateCategory, deleteCategory,
      addBanner: addBanner as (banner: Omit<Banner, 'id'>) => Promise<Banner>,
      updateBanner, deleteBanner,
      addBrand: addBrand as (brand: Omit<Brand, 'id'>) => Promise<Brand>,
      updateBrand, deleteBrand,
      addCondition: addCondition as (condition: Omit<Condition, 'id'>) => Promise<Condition>,
      updateCondition, deleteCondition,
      addStatus: addStatus as (status: Omit<Status, 'id'>) => Promise<Status>,
      updateStatus, deleteStatus,
      addSupplier: addSupplier as (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>,
      updateSupplier, deleteSupplier,
      addPage: addPage as (page: Omit<Page, 'id'>) => Promise<Page>,
      updatePage, deletePage,
      bulkUpdateProducts
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
