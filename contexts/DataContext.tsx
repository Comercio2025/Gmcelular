
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Product, Category, Banner, Brand, Condition, Status, Supplier, Page } from '../types';
import { initialProducts, initialCategories, initialBanners, initialBrands, initialConditions, initialStatuses, initialSuppliers, initialPages } from '../data/mockData';

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Custom hook to persist state in localStorage
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If item exists, parse it. Otherwise, return initialValue.
      // This also ensures that if the app is used for the first time, initial data is loaded.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  brands: Brand[];
  conditions: Condition[];
  statuses: Status[];
  suppliers: Supplier[];
  pages: Page[];
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: string) => void;
  saveAllProductChanges: (updatedProducts: Product[]) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addBrand: (brand: Omit<Brand, 'id'>) => Brand;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addCondition: (condition: Omit<Condition, 'id'>) => Condition;
  updateCondition: (id: string, condition: Partial<Condition>) => void;
  deleteCondition: (id: string) => void;

  addStatus: (status: Omit<Status, 'id'>) => Status;
  updateStatus: (id: string, status: Partial<Status>) => void;
  deleteStatus: (id: string) => void;

  addSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  addPage: (page: Omit<Page, 'id'>) => void;
  updatePage: (id: string, page: Partial<Page>) => void;
  deletePage: (id: string) => void;

  bulkUpdateProducts: (newProducts: Product[]) => void;
  getNextProductId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = usePersistentState<Product[]>('products', initialProducts);
  const [categories, setCategories] = usePersistentState<Category[]>('categories', initialCategories);
  const [banners, setBanners] = usePersistentState<Banner[]>('banners', initialBanners);
  const [brands, setBrands] = usePersistentState<Brand[]>('brands', initialBrands);
  const [conditions, setConditions] = usePersistentState<Condition[]>('conditions', initialConditions);
  const [statuses, setStatuses] = usePersistentState<Status[]>('statuses', initialStatuses);
  const [suppliers, setSuppliers] = usePersistentState<Supplier[]>('suppliers', initialSuppliers);
  const [pages, setPages] = usePersistentState<Page[]>('pages', initialPages);

  const getNextProductId = useCallback(() => {
      const maxId = products.reduce((max, p) => {
          const pId = parseInt(p.id, 10);
          return pId > max ? pId : max;
      }, 9); // Start from 10
      return (maxId + 1).toString();
  }, [products]);

  // Product Functions
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: getNextProductId() };
    setProducts(prev => [...prev, newProduct]);
  }, [getNextProductId, setProducts]);

  const updateProduct = useCallback((id: string, productUpdate: Partial<Omit<Product, 'id'>>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);
  
  const saveAllProductChanges = useCallback((updatedProducts: Product[]) => {
      setProducts(updatedProducts);
  }, [setProducts]);

  // Category Functions
  const addCategory = useCallback((category: Omit<Category, 'id'>): Category => {
    const newCategory = { ...category, id: generateId('cat') };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, [setCategories]);
  const updateCategory = useCallback((id: string, categoryUpdate: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...categoryUpdate } : c));
  }, [setCategories]);
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // Banner Functions
  const addBanner = useCallback((banner: Omit<Banner, 'id'>) => {
    setBanners(prev => [...prev, { ...banner, id: generateId('banner') }]);
  }, [setBanners]);
  const updateBanner = useCallback((id: string, bannerUpdate: Partial<Banner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...bannerUpdate } : b));
  }, [setBanners]);
  const deleteBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  }, [setBanners]);

  // Brand Functions
  const addBrand = useCallback((brand: Omit<Brand, 'id'>): Brand => {
      const newBrand = { ...brand, id: generateId('brand') };
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
  }, [setBrands]);
  const updateBrand = useCallback((id: string, brandUpdate: Partial<Brand>) => {
      setBrands(prev => prev.map(b => b.id === id ? { ...b, ...brandUpdate } : b));
  }, [setBrands]);
  const deleteBrand = useCallback((id: string) => {
      setBrands(prev => prev.filter(b => b.id !== id));
  }, [setBrands]);

  // Condition Functions
  const addCondition = useCallback((condition: Omit<Condition, 'id'>): Condition => {
      const newCondition = { ...condition, id: generateId('cond') };
      setConditions(prev => [...prev, newCondition]);
      return newCondition;
  }, [setConditions]);
  const updateCondition = useCallback((id: string, conditionUpdate: Partial<Condition>) => {
      setConditions(prev => prev.map(c => c.id === id ? { ...c, ...conditionUpdate } : c));
  }, [setConditions]);
  const deleteCondition = useCallback((id: string) => {
      setConditions(prev => prev.filter(c => c.id !== id));
  }, [setConditions]);

  // Status Functions
  const addStatus = useCallback((status: Omit<Status, 'id'>): Status => {
      const newStatus = { ...status, id: generateId('status') };
      setStatuses(prev => [...prev, newStatus]);
      return newStatus;
  }, [setStatuses]);
  const updateStatus = useCallback((id: string, statusUpdate: Partial<Status>) => {
      setStatuses(prev => prev.map(s => s.id === id ? { ...s, ...statusUpdate } : s));
  }, [setStatuses]);
  const deleteStatus = useCallback((id: string) => {
      setStatuses(prev => prev.filter(s => s.id !== id));
  }, [setStatuses]);

  // Supplier Functions
    const addSupplier = useCallback((supplier: Omit<Supplier, 'id'>): Supplier => {
      const newSupplier = { ...supplier, id: generateId('sup') };
      setSuppliers(prev => [...prev, newSupplier]);
      return newSupplier;
    }, [setSuppliers]);
    const updateSupplier = useCallback((id: string, supplierUpdate: Partial<Supplier>) => {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplierUpdate } : s));
    }, [setSuppliers]);
    const deleteSupplier = useCallback((id: string) => {
        setSuppliers(prev => prev.filter(s => s.id !== id));
    }, [setSuppliers]);

    // Page functions
    const addPage = useCallback((page: Omit<Page, 'id'>) => {
        setPages(prev => [...prev, { ...page, id: generateId('page') }]);
    }, [setPages]);
    const updatePage = useCallback((id: string, pageUpdate: Partial<Page>) => {
        setPages(prev => prev.map(p => (p.id === id ? { ...p, ...pageUpdate } : p)));
    }, [setPages]);
    const deletePage = useCallback((id: string) => {
        setPages(prev => prev.filter(p => p.id !== id));
    }, [setPages]);

  // Bulk update
  const bulkUpdateProducts = useCallback((newProducts: Product[]) => {
      let maxId = products.reduce((max, p) => Math.max(max, parseInt(p.id, 10)), 9);
      const productsWithIds = newProducts.map(p => {
          if (p.id) return p;
          maxId++;
          return { ...p, id: maxId.toString() };
      });
      setProducts(productsWithIds);
  }, [products, setProducts]);

  return (
    <DataContext.Provider value={{
      products, categories, banners, brands, conditions, statuses, suppliers, pages,
      addProduct, updateProduct, deleteProduct, saveAllProductChanges,
      addCategory, updateCategory, deleteCategory,
      addBanner, updateBanner, deleteBanner,
      addBrand, updateBrand, deleteBrand,
      addCondition, updateCondition, deleteCondition,
      addStatus, updateStatus, deleteStatus,
      addSupplier, updateSupplier, deleteSupplier,
      addPage, updatePage, deletePage,
      bulkUpdateProducts, getNextProductId
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
