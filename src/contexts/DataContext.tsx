import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AIRecommendationRequest,
  AIRecommendationResponse,
  Product,
  StoreConfig,
  Banner,
  Category,
  Brand,
  Condition,
  ProductStatus,
  Page,
  CustomFilter,
  Promotion,
  Article,
} from "../types";
import {
  products as initialProducts,
  banners as initialBanners,
  categories as initialCategories,
  brands as initialBrands,
  conditions as initialConditions,
  statuses as initialStatuses,
  initialConfig,
} from "../data/mockData";

interface DataContextType {
  products: Product[];
  banners: Banner[];
  categories: Category[];
  brands: Brand[];
  conditions: Condition[];
  statuses: ProductStatus[];
  pages: Page[];
  customFilters: CustomFilter[];
  promotions: Promotion[];
  articles: Article[];
  config: StoreConfig;
  loading: boolean;
  refreshData: () => Promise<void>;
  // Product Actions
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;
  bulkDeleteProducts: (ids: string[]) => Promise<void>;
  bulkUpdateProducts: (ids: string[], updates: any) => Promise<void>;
  // Banner Actions
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;
  // Generic CRUD
  addCategory: (item: Category) => void;
  updateCategory: (item: Category) => void;
  deleteCategory: (id: string) => void;
  addBrand: (item: Brand) => void;
  updateBrand: (item: Brand) => void;
  deleteBrand: (id: string) => void;
  addCondition: (item: Condition) => void;
  updateCondition: (item: Condition) => void;
  deleteCondition: (id: string) => void;
  addStatus: (item: ProductStatus) => void;
  updateStatus: (item: ProductStatus) => void;
  deleteStatus: (id: string) => void;
  // Page Actions
  savePage: (page: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  // Filter Actions
  saveCustomFilter: (filter: Partial<CustomFilter>) => Promise<void>;
  deleteCustomFilter: (id: string) => Promise<void>;

  // Promotion Actions
  savePromotion: (promotion: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  reorderPromotions: (
    items: { id: string; orderIndex: number }[],
  ) => Promise<void>;
  // Article Actions
  saveArticle: (article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  generateArticleAI: (
    topic: string,
    contentType?: "artigo" | "post" | "legenda",
  ) => Promise<{
    title: string;
    excerpt: string;
    content: string;
    tags?: string;
  }>;
  recommendSmartphonesAI: (
    payload: AIRecommendationRequest,
  ) => Promise<AIRecommendationResponse>;
  enhanceProductDescriptionAI: (params: {
    name?: string;
    description?: string;
    brand?: string;
    model?: string;
    condition?: string;
    category?: string;
    mode?: "format" | "generate" | "bullets";
  }) => Promise<string>;

  updateConfig: (config: Partial<StoreConfig>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [conditions, setConditions] = useState<Condition[]>(initialConditions);
  const [statuses, setStatuses] = useState<ProductStatus[]>(initialStatuses);
  const [config, setConfig] = useState<StoreConfig>(initialConfig);
  const [pages, setPages] = useState<Page[]>([]);
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/index.php?action=data_sync");
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setProducts(
        data.products.map((p: any) => ({
          ...p,
          costPrice: Number(p.cost_price),
          price: Number(p.price),
          brand: p.brand_name || "",
          category: p.category_name || "",
          condition: p.condition_name || "",
          status: p.status_slug || "em_estoque",
          active: Boolean(Number(p.active)),
          imageUrl: p.image_url,
        })),
      );

      setCategories(
        data.categories.map((c: any) => ({ ...c, id: String(c.id) })),
      );
      setBrands(data.brands.map((b: any) => ({ ...b, id: String(b.id) })));
      setConditions(
        data.conditions.map((c: any) => ({ ...c, id: String(c.id) })),
      );
      setStatuses(data.statuses.map((s: any) => ({ ...s, id: String(s.id) })));

      if (data.banners) {
        setBanners(
          data.banners.map((b: any) => ({
            ...b,
            imageUrl: b.image_url,
            active: Boolean(Number(b.active)),
          })),
        );
      }

      if (data.config) {
        const parsedConfig: any = {};
        if (Array.isArray(data.config)) {
        } else {
          for (const key in data.config) {
            try {
              const val = data.config[key];
              if (val.startsWith("{") || val.startsWith("[")) {
                parsedConfig[key] = JSON.parse(val);
              } else {
                parsedConfig[key] = val;
              }
            } catch (e) {
              parsedConfig[key] = data.config[key];
            }
          }
        }
        setConfig({ ...initialConfig, ...parsedConfig });
      }

      if (data.pages) {
        setPages(
          data.pages.map((p: any) => ({
            ...p,
            id: String(p.id),
            orderIndex: Number(p.order_index),
            active: Boolean(Number(p.active)),
            externalLink: p.external_link || p.externalLink, // Handle both
            backgroundColor:
              p.background_color || p.backgroundColor || "#020c1b",
          })),
        );
      }

      if (data.filters) {
        setCustomFilters(
          data.filters.map((f: any) => ({
            ...f,
            id: String(f.id),
            active: Boolean(Number(f.active)),
            orderIndex: Number(f.order_index),
            criteria:
              typeof f.criteria === "string"
                ? JSON.parse(f.criteria)
                : f.criteria,
          })),
        );
      }

      if (data.promotions) {
        setPromotions(
          data.promotions.map((p: any) => ({
            ...p,
            id: String(p.id),
            active: Boolean(Number(p.active)),
            orderIndex: Number(p.order_index),
            imageUrl: p.image_url,
          })),
        );
      }

      if (data.articles) {
        setArticles(
          data.articles.map((a: any) => ({
            id: String(a.id),
            title: a.title || "",
            slug: a.slug || "",
            excerpt: a.excerpt || "",
            content: a.content || "",
            coverImageUrl: a.cover_image_url || "",
            tags: a.tags || "",
            active: Boolean(Number(a.active)),
            orderIndex: Number(a.order_index || 0),
            publishedAt: a.published_at || null,
            createdAt: a.created_at || undefined,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- GENERIC HELPERS ---
  const saveEntity = async (entity: string, item: any) => {
    try {
      const response = await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_entity", entity, ...item }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Erro ao salvar");
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Erro: " + e.message);
    }
  };

  const deleteEntity = async (entity: string, id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      const response = await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_entity", entity, id }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Erro ao excluir");
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao excluir: Este item pode estar sendo usado por algum produto.");
    }
  };

  // --- BANNER ACTIONS ---
  const saveBanner = async (banner: Banner) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_banner", ...banner }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const addBanner = (banner: Banner) => saveBanner(banner);
  const updateBanner = (banner: Banner) => saveBanner(banner);

  const deleteBanner = async (id: string) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_banner", id }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- PRODUCT ACTIONS ---
  const addProduct = async (product: Product) => {
    const catId = categories.find((c) => c.name === product.category)?.id;
    const brandId = brands.find((b) => b.name === product.brand)?.id;
    const condId = conditions.find((c) => c.name === product.condition)?.id;
    const statusId = statuses.find(
      (s) => s.slug === product.status || s.name === product.status,
    )?.id;

    const payload = {
      action: "save_product",
      ...product,
      category_id: catId,
      brand_id: brandId,
      condition_id: condId,
      status_id: statusId,
    };

    try {
      const response = await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao salvar produto: " + (e.message || "Erro desconhecido"));
    }
  };

  const updateProduct = (product: Product) => addProduct(product);

  const deleteProduct = async (id: string) => {
    await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_product", id }),
    });
    refreshData();
  };

  const bulkDeleteProducts = async (ids: string[]) => {
    await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk_delete_products", ids }),
    });
    refreshData();
  };

  const bulkUpdateProducts = async (ids: string[], updates: any) => {
    await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk_update_products", ids, updates }),
    });
    refreshData();
  };

  // --- OTHER ACTIONS ---
  const addCategory = (item: Category) => saveEntity("categories", item);
  const updateCategory = (item: Category) => saveEntity("categories", item);
  const deleteCategory = (id: string) => deleteEntity("categories", id);

  const addBrand = (item: Brand) => saveEntity("brands", item);
  const updateBrand = (item: Brand) => saveEntity("brands", item);
  const deleteBrand = (id: string) => deleteEntity("brands", id);

  const addCondition = (item: Condition) => saveEntity("conditions", item);
  const updateCondition = (item: Condition) => saveEntity("conditions", item);
  const deleteCondition = (id: string) => deleteEntity("conditions", id);

  const addStatus = (item: ProductStatus) =>
    saveEntity("product_statuses", item);
  const updateStatus = (item: ProductStatus) =>
    saveEntity("product_statuses", item);
  const deleteStatus = (id: string) => deleteEntity("product_statuses", id);

  // --- PAGE ACTIONS ---
  const savePage = async (page: Partial<Page>) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_page", ...page }),
      });
      refreshData();
    } catch (e) {
      console.warn(
        "Save failed (backend offline?), updating locally for testing.",
      );
      // Mock update for localhost testing
      setPages((prev) => {
        const existing = prev.find((p) => p.id === page.id);
        if (existing) {
          return prev.map((p) => (p.id === page.id ? { ...p, ...page } : p));
        } else {
          return [
            ...prev,
            {
              ...page,
              id: String(Date.now()),
              slug: page.title?.toLowerCase().replace(/\s+/g, "-"),
            } as Page,
          ];
        }
      });
    }
  };

  const deletePage = async (id: string) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_page", id }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- CUSTOM FILTER ACTIONS ---
  const saveCustomFilter = async (filter: Partial<CustomFilter>) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_filter", ...filter }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCustomFilter = async (id: string) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_filter", id }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- PROMOTION ACTIONS ---
  const savePromotion = async (promotion: Partial<Promotion>) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_promotion", ...promotion }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_promotion", id }),
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const reorderPromotions = async (
    items: { id: string; orderIndex: number }[],
  ) => {
    // Optimistic update
    setPromotions((prev) => {
      const newPromotions = [...prev];
      items.forEach((item) => {
        const index = newPromotions.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          newPromotions[index] = {
            ...newPromotions[index],
            orderIndex: item.orderIndex,
          };
        }
      });
      return newPromotions.sort((a, b) => a.orderIndex - b.orderIndex);
    });

    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder_promotions", items }),
      });
      // refreshData(); // No need to refresh immediately if optimistic update is correct
    } catch (e) {
      console.error(e);
      refreshData(); // Revert on error
    }
  };

  // --- ARTICLE ACTIONS ---
  const saveArticle = async (article: Partial<Article>) => {
    try {
      const response = await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_article", ...article }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Erro ao salvar artigo");
      await refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao salvar artigo: " + e.message);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const response = await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_article", id }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Erro ao excluir artigo");
      await refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao excluir artigo: " + e.message);
    }
  };

  const generateArticleAI = async (
    topic: string,
    contentType: "artigo" | "post" | "legenda" = "artigo",
  ) => {
    const response = await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_article_ai", topic, contentType }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || "Falha ao gerar texto com IA");
    }
    return {
      title: data.title || "",
      excerpt: data.excerpt || "",
      content: data.content || "",
      tags: data.tags || "",
    };
  };

  const recommendSmartphonesAI = async (
    payload: AIRecommendationRequest,
  ): Promise<AIRecommendationResponse> => {
    const response = await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "recommend_smartphones_ai",
        profile: payload.profile,
        candidates: payload.candidates,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || "Falha ao recomendar com IA");
    }

    return {
      ranked: Array.isArray(data.ranked) ? data.ranked : [],
      summary: data.summary || "",
    };
  };

  const enhanceProductDescriptionAI = async (params: {
    name?: string;
    description?: string;
    brand?: string;
    model?: string;
    condition?: string;
    category?: string;
    mode?: "format" | "generate" | "bullets";
  }): Promise<string> => {
    const response = await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "enhance_product_description_ai",
        ...params,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || "Falha ao aprimorar descrição com IA");
    }

    return data.description || "";
  };

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    try {
      await fetch("api/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_config", config: newConfig }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        banners,
        categories,
        brands,
        conditions,
        statuses,
        config,
        loading,
        pages,
        customFilters,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        bulkUpdateProducts,
        addBanner,
        updateBanner,
        deleteBanner,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        addCondition,
        updateCondition,
        deleteCondition,
        addStatus,
        updateStatus,
        deleteStatus,
        savePage,
        deletePage,
        saveCustomFilter,
        deleteCustomFilter,
        promotions,
        articles,
        savePromotion,
        deletePromotion,
        reorderPromotions,
        saveArticle,
        deleteArticle,
        generateArticleAI,
        recommendSmartphonesAI,
        enhanceProductDescriptionAI,
        updateConfig,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
