
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { Product } from '../../types';
import Modal from './Modal';
import { Plus, Edit, Trash2, Save, Filter, Search, ChevronDown } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { useExchangeRate } from '../../contexts/ExchangeRateContext';
import Dropdown from './Dropdown';

const emptyFormState: Omit<Product, 'id'> = {
    name: '', category: '', price: 0, description: '', details: '', imageUrl: '', statusId: '',
    conditionId: '', brandId: '', reference: '', supplierId: '', costUSD: 0,
    costBRL: 0, markup: 0, profitBRL: 0,
};

const ProductManager: React.FC = () => {
    const { 
        products, categories, brands, conditions, statuses, suppliers,
        addProduct, updateProduct, deleteProduct, saveAllProductChanges, addSupplier
    } = useData();
    const { rate: exchangeRate } = useExchangeRate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyFormState);
    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({ category: '', status: '', brand: '' });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkModalOpen, setBulkModalOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState<{field: string, label: string} | null>(null);
    const [bulkValue, setBulkValue] = useState('');
    const [numericEdit, setNumericEdit] = useState<{ key: string, value: string } | null>(null);
    
    const [visibleColumns, setVisibleColumns] = useState({
        image: true, name: true, details: true, price: true, category: true, status: true,
        costUSD: false, costBRL: true, markup: true, profitBRL: true, actions: true,
    });
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    const columnLabels: Record<keyof typeof visibleColumns, string> = {
        image: 'Imagem', name: 'Nome', details: 'Detalhes', price: 'Preço Venda', category: 'Categoria', status: 'Status',
        costUSD: 'Custo (USD)', costBRL: 'Custo (BRL)',
        markup: 'Markup (%)', profitBRL: 'Lucro (BRL)', actions: 'Ações',
    };

    useEffect(() => {
        setLocalProducts(JSON.parse(JSON.stringify(products)));
    }, [products]);

    useEffect(() => {
        setHasChanges(JSON.stringify(products) !== JSON.stringify(localProducts));
    }, [products, localProducts]);

    useEffect(() => {
        if (editingProduct) setFormData(editingProduct);
        else setFormData({
            ...emptyFormState,
            category: categories[0]?.id || '', statusId: statuses[0]?.id || '',
            conditionId: conditions[0]?.id || '', brandId: brands[0]?.id || '',
            supplierId: suppliers[0]?.id || '',
        });
    }, [editingProduct, categories, statuses, conditions, brands, suppliers]);

    const filteredProducts = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        return localProducts.filter(p => 
            p.name.toLowerCase().includes(lowercasedFilter) &&
            (activeFilters.category ? p.category === activeFilters.category : true) &&
            (activeFilters.status ? p.statusId === activeFilters.status : true) &&
            (activeFilters.brand ? p.brandId === activeFilters.brand : true)
        );
    }, [localProducts, searchTerm, activeFilters]);

    useEffect(() => {
        const numFiltered = filteredProducts.length;
        const numSelected = selectedIds.size;
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.checked = numSelected === numFiltered && numFiltered > 0;
            selectAllCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numFiltered;
        }
    }, [selectedIds, filteredProducts]);

    const handleOpenModal = (product: Product | null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        editingProduct ? await updateProduct(editingProduct.id, formData) : await addProduct(formData);
        handleCloseModal();
    };

    const handleInlineChange = (id: string, field: keyof Product, value: any) => {
        setLocalProducts(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const recalculateFinancials = useCallback((product: Omit<Product, 'id'>, changedField: keyof Product): Omit<Product, 'id'> => {
        if (!exchangeRate) return product;

        let { costUSD = 0, costBRL = 0, markup = 0, price = 0, profitBRL = 0 } = { ...product };

        switch(changedField) {
            case 'costUSD': costBRL = costUSD * exchangeRate; break;
            case 'costBRL': costUSD = costBRL / exchangeRate; break;
        }

        switch(changedField) {
            case 'costUSD': case 'costBRL': case 'markup':
                price = costBRL * (1 + (markup / 100));
                profitBRL = price - costBRL;
                break;
            case 'profitBRL':
                price = costBRL + profitBRL;
                markup = costBRL > 0 ? ((price / costBRL) - 1) * 100 : 0;
                break;
            case 'price':
                profitBRL = price - costBRL;
                markup = costBRL > 0 ? ((price / costBRL) - 1) * 100 : 0;
                break;
        }
        return { ...product, costUSD, costBRL, markup, price, profitBRL };
    }, [exchangeRate]);

    const handleFinancialsChange = (productId: string, field: keyof Product, value: number) => {
        setLocalProducts(prev => prev.map(p => {
            if (p.id !== productId) return p;
            return recalculateFinancials({ ...p, [field]: value }, field) as Product;
        }));
    };
    
    const handleModalFormChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'supplierId' && value === '--add-new--') {
            const newSupplierName = prompt('Nome do novo fornecedor:');
            if (newSupplierName?.trim()) {
                const newSupplier = await addSupplier({ name: newSupplierName.trim() });
                setFormData(prev => ({ ...prev, supplierId: newSupplier.id }));
            }
            return; 
        }

        const isNumeric = ['costUSD', 'costBRL', 'markup', 'profitBRL', 'price'].includes(name);
        const newFormData = { ...formData, [name]: isNumeric ? parseFloat(value.replace(',', '.')) || 0 : value };
        
        if (isNumeric) {
            setFormData(recalculateFinancials(newFormData, name as keyof Product));
        } else {
            setFormData(newFormData);
        }
    };

    const handleNumericStringChange = (key: string, value: string) => {
        const sanitized = value.replace(',', '.');
        if (/^$|^-?\d*\.?\d*$/.test(sanitized)) {
            setNumericEdit({ key, value: sanitized });
        }
    };
    
    const handleNumericBlur = (id: string, field: keyof Product) => {
        if (numericEdit && numericEdit.key === `${id}-${field}`) {
            handleFinancialsChange(id, field, parseFloat(numericEdit.value) || 0);
            setNumericEdit(null);
        }
    };

    const handleImageFile = (file: File | null, id: string) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => handleInlineChange(id, 'imageUrl', e.target?.result as string);
            reader.readAsDataURL(file);
        }
    }
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => handleImageFile(e.target.files?.[0] ?? null, id);
    const handleImagePaste = (e: React.ClipboardEvent, id: string) => {
        e.preventDefault();
        // FIX: Explicitly type 'item' as DataTransferItem to resolve type inference error on 'item.type'.
        const item = Array.from(e.clipboardData.items).find((item: DataTransferItem) => item.type.startsWith('image/'));
        if (item) handleImageFile(item.getAsFile(), id);
    };
    
    const handleSelect = (id: string) => {
        setSelectedIds(prev => { const newSet = new Set(prev); newSet.has(id) ? newSet.delete(id) : newSet.add(id); return newSet; });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.checked ? setSelectedIds(new Set(filteredProducts.map(p => p.id))) : setSelectedIds(new Set());
    };

    const handleOpenBulkModal = (field: string, label: string) => {
        setBulkAction({ field, label }); setBulkValue(''); setBulkModalOpen(true);
    };
    
    const handleBulkUpdate = () => {
        if (!bulkAction || !bulkValue) return;
        setLocalProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, [bulkAction.field]: bulkValue } : p));
        setBulkModalOpen(false); setSelectedIds(new Set());
    };

    const handleBulkDelete = () => {
        if(window.confirm(`Tem certeza que deseja excluir ${selectedIds.size} produtos?`)){
            const deletePromises = Array.from(selectedIds).map(id => deleteProduct(id));
            Promise.all(deletePromises).then(() => {
                setSelectedIds(new Set());
            });
        }
    }

    const handleSaveChanges = () => { saveAllProductChanges(localProducts); setHasChanges(false); };
    const toggleColumn = (col: keyof typeof visibleColumns) => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <Dropdown buttonContent={<><Filter size={16} className="mr-2"/> Filtros e Pesquisa <ChevronDown size={16} className="ml-1"/></>}>
                        <div className="p-2 space-y-3 w-64">
                            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Pesquisar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"/></div>
                            <select value={activeFilters.category} onChange={e => setActiveFilters(p => ({...p, category: e.target.value}))} className="w-full p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Todas Categorias</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
                            <select value={activeFilters.status} onChange={e => setActiveFilters(p => ({...p, status: e.target.value}))} className="w-full p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Todos Status</option>{statuses.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
                            <select value={activeFilters.brand} onChange={e => setActiveFilters(p => ({...p, brand: e.target.value}))} className="w-full p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Todas Marcas</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
                            <button onClick={()=> {setActiveFilters({category: '', status: '', brand: ''}); setSearchTerm('')}} className="w-full text-sm py-1.5 text-primary hover:underline">Limpar Filtros</button>
                        </div>
                    </Dropdown>
                    <Dropdown buttonContent={<><Filter size={16} className="mr-2"/> Exibir Colunas <ChevronDown size={16} className="ml-1"/></>}>
                        {Object.entries(columnLabels).map(([key, label]) => (<label key={key} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><input type="checkbox" checked={visibleColumns[key as keyof typeof visibleColumns]} onChange={() => toggleColumn(key as keyof typeof visibleColumns)} className="mr-2 h-4 w-4 rounded"/>{label}</label>))}
                    </Dropdown>
                    {selectedIds.size > 0 && 
                        <Dropdown buttonContent={<>Ações em Lote ({selectedIds.size}) <ChevronDown size={16} className="ml-1"/></>}>
                            <a onClick={() => handleOpenBulkModal('category', 'Categoria')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Alterar Categoria</a>
                            <a onClick={() => handleOpenBulkModal('statusId', 'Status')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Alterar Status</a>
                             <a onClick={() => handleOpenBulkModal('brandId', 'Marca')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Alterar Marca</a>
                             <a onClick={handleBulkDelete} className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 cursor-pointer">Excluir Selecionados</a>
                        </Dropdown>
                    }
                    <button onClick={handleSaveChanges} disabled={!hasChanges} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"><Save size={20} className="mr-2"/> Salvar</button>
                    <button onClick={() => handleOpenModal(null)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"><Plus size={20} className="mr-2"/> Adicionar</button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4"><input type="checkbox" ref={selectAllCheckboxRef} onChange={handleSelectAll} className="h-4 w-4 rounded"/></th>
                            {Object.entries(columnLabels).map(([key, label]) => visibleColumns[key as keyof typeof visibleColumns] && <th key={key} className="p-4 font-semibold">{label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id} className={`border-b dark:border-gray-700 ${selectedIds.has(p.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <td className="p-4"><input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => handleSelect(p.id)} className="h-4 w-4 rounded"/></td>
                                {visibleColumns.image && <td className="p-2 align-middle"><label htmlFor={`img-${p.id}`} className="cursor-pointer group relative block w-12 h-12" onPaste={(e) => handleImagePaste(e, p.id)} tabIndex={0}><img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover rounded"/><div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity rounded"><Edit size={20} className="text-white opacity-0 group-hover:opacity-100"/></div></label><input id={`img-${p.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, p.id)}/></td>}
                                {visibleColumns.name && <td className="p-2 align-middle"><input type="text" value={p.name} onChange={e => handleInlineChange(p.id, 'name', e.target.value)} className="w-full min-w-[200px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.details && <td className="p-2 align-middle"><input type="text" value={p.details || ''} onChange={e => handleInlineChange(p.id, 'details', e.target.value)} className="w-full min-w-[250px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.price && <td className="p-2 align-middle"><input type="text" inputMode="decimal" value={numericEdit?.key === `${p.id}-price` ? numericEdit.value : (p.price || '')} onFocus={() => setNumericEdit({ key: `${p.id}-price`, value: String(p.price || '') })} onChange={e => handleNumericStringChange(`${p.id}-price`, e.target.value)} onBlur={() => handleNumericBlur(p.id, 'price')} className="w-full min-w-[120px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.category && <td className="p-2 align-middle"><select value={p.category} onChange={e => handleInlineChange(p.id, 'category', e.target.value)} className="w-full min-w-[180px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></td>}
                                {visibleColumns.status && <td className="p-2 align-middle"><select value={p.statusId} onChange={e => handleInlineChange(p.id, 'statusId', e.target.value)} className="w-full min-w-[180px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600">{statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></td>}
                                {visibleColumns.costUSD && <td className="p-2 align-middle"><input type="text" inputMode="decimal" value={numericEdit?.key === `${p.id}-costUSD` ? numericEdit.value : (p.costUSD || '')} onFocus={() => setNumericEdit({ key: `${p.id}-costUSD`, value: String(p.costUSD || '') })} onChange={e => handleNumericStringChange(`${p.id}-costUSD`, e.target.value)} onBlur={() => handleNumericBlur(p.id, 'costUSD')} className="w-full min-w-[120px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.costBRL && <td className="p-2 align-middle"><input type="text" inputMode="decimal" value={numericEdit?.key === `${p.id}-costBRL` ? numericEdit.value : (p.costBRL || '')} onFocus={() => setNumericEdit({ key: `${p.id}-costBRL`, value: String(p.costBRL || '') })} onChange={e => handleNumericStringChange(`${p.id}-costBRL`, e.target.value)} onBlur={() => handleNumericBlur(p.id, 'costBRL')} className="w-full min-w-[120px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.markup && <td className="p-2 align-middle"><input type="text" inputMode="decimal" value={numericEdit?.key === `${p.id}-markup` ? numericEdit.value : (p.markup || '')} onFocus={() => setNumericEdit({ key: `${p.id}-markup`, value: String(p.markup || '') })} onChange={e => handleNumericStringChange(`${p.id}-markup`, e.target.value)} onBlur={() => handleNumericBlur(p.id, 'markup')} className="w-full min-w-[100px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.profitBRL && <td className="p-2 align-middle"><input type="text" inputMode="decimal" value={numericEdit?.key === `${p.id}-profitBRL` ? numericEdit.value : (p.profitBRL || '')} onFocus={() => setNumericEdit({ key: `${p.id}-profitBRL`, value: String(p.profitBRL || '') })} onChange={e => handleNumericStringChange(`${p.id}-profitBRL`, e.target.value)} onBlur={() => handleNumericBlur(p.id, 'profitBRL')} className="w-full min-w-[120px] p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></td>}
                                {visibleColumns.actions && <td className="p-4 flex space-x-2 align-middle"><button onClick={() => handleOpenModal(p)} className="text-primary hover:opacity-75" title="Edição Completa"><Edit size={20} /></button><button onClick={() => window.confirm('Tem certeza?') && deleteProduct(p.id)} className="text-red-500 hover:text-red-700" title="Excluir Produto"><Trash2 size={20} /></button></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} title={`Alterar ${bulkAction?.label} para ${selectedIds.size} produtos`}>
                <div className="space-y-4">
                    <label>Selecione o novo valor para <strong>{bulkAction?.label}</strong>:</label>
                    {bulkAction?.field === 'category' && <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Selecione...</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>}
                    {bulkAction?.field === 'statusId' && <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Selecione...</option>{statuses.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>}
                    {bulkAction?.field === 'brandId' && <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Selecione...</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>}
                    {bulkAction?.field === 'supplierId' && <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Selecione...</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>}
                    <div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={() => setBulkModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button><button onClick={handleBulkUpdate} className="px-4 py-2 bg-primary text-white rounded">Aplicar a Todos</button></div>
                </div>
            </Modal>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'}>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <fieldset><legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Informações Básicas</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Nome</label><input type="text" name="name" value={formData.name} onChange={handleModalFormChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium mb-1">Referência</label><input type="text" name="reference" value={formData.reference || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        </div>
                        <div className="mt-4"><label className="block text-sm font-medium mb-1">Detalhes Adicionais</label><textarea name="details" value={formData.details || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={2} placeholder="Ex: Saúde da bateria, marcas de uso, etc." /></div>
                        <div className="mt-4"><label className="block text-sm font-medium mb-1">Descrição</label><textarea name="description" value={formData.description || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </fieldset>
                    
                     {/* Pricing */}
                    <fieldset><legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Preços e Custos</legend>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                            <div><label className="block text-sm font-medium mb-1">Custo (USD)</label><input type="text" inputMode="decimal" name="costUSD" value={formData.costUSD || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium mb-1">Custo (BRL)</label><input type="text" inputMode="decimal" name="costBRL" value={formData.costBRL || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium mb-1">Markup (%)</label><input type="text" inputMode="decimal" name="markup" value={formData.markup || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium mb-1">Lucro (BRL)</label><input type="text" inputMode="decimal" name="profitBRL" value={formData.profitBRL || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Preço de Venda (BRL)</label><input type="text" inputMode="decimal" name="price" value={formData.price || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-bold" /></div>
                        </div>
                    </fieldset>
                    
                    {/* Organization */}
                    <fieldset><legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Organização</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Categoria</label><select name="category" value={formData.category} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium mb-1">Status</label><select name="statusId" value={formData.statusId} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">{statuses.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium mb-1">Marca</label><select name="brandId" value={formData.brandId || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Nenhuma</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium mb-1">Condição</label><select name="conditionId" value={formData.conditionId || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Nenhuma</option>{conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Fornecedor</label><select name="supplierId" value={formData.supplierId || ''} onChange={handleModalFormChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"><option value="">Nenhum</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}<option value="--add-new--">+ Novo Fornecedor</option></select></div>
                        </div>
                    </fieldset>

                    <div><label className="block text-sm font-medium mb-2">Imagem</label><ImageUploader onImageUpload={(b64) => setFormData(p=>({...p, imageUrl: b64}))} />{formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-4 max-h-40 mx-auto rounded" />}</div>
                    <div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salvar</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductManager;
