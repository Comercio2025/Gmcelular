
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Product } from '../../types';
import { Download, Upload } from 'lucide-react';

const BulkManager: React.FC = () => {
    const { 
        products, bulkUpdateProducts, categories, brands, conditions, statuses, 
        addCategory, addBrand, addCondition, addStatus, getNextProductId
    } = useData();
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    // Create lookup maps for performance
    const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);
    const brandMap = useMemo(() => new Map(brands.map(b => [b.id, b.name])), [brands]);
    const conditionMap = useMemo(() => new Map(conditions.map(c => [c.id, c.name])), [conditions]);
    const statusMap = useMemo(() => new Map(statuses.map(s => [s.id, s.name])), [statuses]);

    const handleExportCSV = () => {
        const headers = ["id", "name", "details", "category", "price", "description", "imageUrl", "status", "condition", "brand", "reference"];
        
        const escapeCsvField = (field: any): string => {
            const stringField = String(field || '');
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const rows = products.map(p => [
            escapeCsvField(p.id),
            escapeCsvField(p.name),
            escapeCsvField(p.details),
            escapeCsvField(categoryMap.get(p.category)),
            escapeCsvField(p.price),
            escapeCsvField(p.description),
            escapeCsvField(p.imageUrl),
            escapeCsvField(statusMap.get(p.statusId)),
            escapeCsvField(p.conditionId ? conditionMap.get(p.conditionId) : ''),
            escapeCsvField(p.brandId ? brandMap.get(p.brandId) : ''),
            escapeCsvField(p.reference)
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "produtos_gmcelular.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length < 2) throw new Error("CSV vazio ou sem cabeçalhos.");

                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                // Create reverse lookup maps (name -> id)
                const categoryRevMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
                const brandRevMap = new Map(brands.map(b => [b.name.toLowerCase(), b.id]));
                const conditionRevMap = new Map(conditions.map(c => [c.name.toLowerCase(), c.id]));
                const statusRevMap = new Map(statuses.map(s => [s.name.toLowerCase(), s.id]));
                
                const newProductsMap = new Map<string, Product>(products.map(p => [p.id, p]));

                lines.slice(1).forEach(line => {
                    const values = line.split(',');
                    const rawData = headers.reduce((obj, header, index) => {
                        obj[header] = values[index]?.trim().replace(/"/g, '') || '';
                        return obj;
                    }, {} as any);

                    // Find or create Category
                    let categoryId = categoryRevMap.get(rawData.category?.toLowerCase());
                    if (!categoryId && rawData.category) {
                        const newCategory = addCategory({ name: rawData.category });
                        categoryId = newCategory.id;
                        categoryRevMap.set(newCategory.name.toLowerCase(), newCategory.id);
                    }

                    // Find or create Brand
                    let brandId = brandRevMap.get(rawData.brand?.toLowerCase());
                    if (!brandId && rawData.brand) {
                        const newBrand = addBrand({ name: rawData.brand });
                        brandId = newBrand.id;
                        brandRevMap.set(newBrand.name.toLowerCase(), newBrand.id);
                    }
                    
                    // Find or create Condition
                    let conditionId = conditionRevMap.get(rawData.condition?.toLowerCase());
                    if (!conditionId && rawData.condition) {
                        const newCondition = addCondition({ name: rawData.condition });
                        conditionId = newCondition.id;
                        conditionRevMap.set(newCondition.name.toLowerCase(), newCondition.id);
                    }
                    
                    // Find or create Status
                    let statusId = statusRevMap.get(rawData.status?.toLowerCase());
                    if (!statusId && rawData.status) {
                        const newStatus = addStatus({ name: rawData.status });
                        statusId = newStatus.id;
                        statusRevMap.set(newStatus.name.toLowerCase(), newStatus.id);
                    }
                    
                    const productData: Omit<Product, 'id'> = {
                        name: rawData.name,
                        details: rawData.details,
                        category: categoryId || '',
                        price: parseFloat(rawData.price) || 0,
                        description: rawData.description,
                        imageUrl: rawData.imageUrl,
                        statusId: statusId || statuses.find(s=>s.name === 'Inativo')?.id || '',
                        conditionId: conditionId,
                        brandId: brandId,
                        reference: rawData.reference,
                    };

                    const id = rawData.id;
                    if (id && newProductsMap.has(id)) { // Update existing
                        newProductsMap.set(id, { ...newProductsMap.get(id)!, ...productData });
                    } else { // Add new
                        // FIX: Changed const to let to allow reassignment in the while loop for collision avoidance.
                        let newId = id || getNextProductId(); // Use ID from CSV or generate new
                        // To avoid collisions when generating multiple new IDs
                        while(newProductsMap.has(newId)) {
                           newId = (parseInt(newId, 10) + 1).toString();
                        }
                        newProductsMap.set(newId, { id: newId, ...productData });
                    }
                });

                bulkUpdateProducts(Array.from(newProductsMap.values()));
                setFeedback({type: 'success', message: `Produtos foram processados com sucesso!`});

            } catch (error) {
                console.error("Erro ao processar CSV:", error);
                setFeedback({type: 'error', message: `Ocorreu um erro: ${error.message}`});
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gerenciamento em Lote</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">1. Exportar Produtos (CSV)</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">Baixe um arquivo CSV com todos os seus produtos atuais. Você pode editar este arquivo para atualizar seu catálogo em massa.</p>
                    <button onClick={handleExportCSV} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        <Download size={20} className="mr-2"/> Exportar Produtos
                    </button>
                </div>
                
                <hr className="dark:border-gray-600"/>

                <div>
                    <h2 className="text-xl font-semibold mb-2">2. Importar Produtos (CSV)</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">Importe o arquivo CSV. Produtos com um ID existente serão atualizados. Produtos sem ID (ou com um ID novo) serão criados. Categorias, marcas, etc. que não existirem serão criadas automaticamente.</p>
                    <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
                       <Upload size={20} className="mr-2"/> Importar e Atualizar
                    </label>
                </div>

                {feedback && (
                    <div className={`mt-4 p-4 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkManager;