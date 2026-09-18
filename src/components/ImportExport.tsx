import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { read, utils, writeFile } from 'xlsx';

export const ImportExport = () => {
    const { products, addProduct } = useData();

    const handleExport = () => {
        const exportData = products.map(p => ({
            ID: p.id,
            Nome: p.name,
            Preco: p.price,
            Descricao: p.description,
            Categoria: p.category,
            Marca: p.brand,
            Modelo: p.model,
            Condicao: p.condition,
            Status: p.status,
            Custo: p.costPrice || 0,
            Estoque: p.stock || 0
        }));

        const ws = utils.json_to_sheet(exportData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Produtos");

        writeFile(wb, `produtos_gmeletronicos_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result;
            const wb = read(data, { type: 'binary' });
            const sheetName = wb.SheetNames[0];
            const ws = wb.Sheets[sheetName];
            const json = utils.sheet_to_json(ws);

            let count = 0;
            for (const row of json as any[]) {
                // Map columns back to product structure
                const product = {
                    name: row.Nome || row.name,
                    price: Number(row.Preco || row.price || 0),
                    description: row.Descricao || row.description || '',
                    category: row.Categoria || row.category || '',
                    brand: row.Marca || row.brand || '',
                    model: row.Modelo || row.model || '',
                    condition: row.Condicao || row.condition || 'Usado',
                    status: row.Status || row.status || 'active',
                    costPrice: Number(row.Custo || row.costPrice || 0),
                    stock: Number(row.Estoque || row.stock || 0),
                    imageUrl: '' // New import usually has no image, or user adds URL column
                };

                if (product.name) {
                    // TODO: We could implement bulk add here for performance
                    await addProduct(product as any);
                    count++;
                }
            }

            alert(`${count} produtos importados com sucesso!`);
            // Reset input
            e.target.value = '';
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto text-center">
            <FileSpreadsheet className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Importar / Exportar Dados</h3>
            <p className="text-gray-400 mb-8">Gerencie seus produtos em lote usando planilhas Excel.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-surface/5 border border-white/5 hover:border-blue-500/30/50 transition-colors group">
                    <Download className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white mb-2">Exportar Produtos</h4>
                    <p className="text-sm text-gray-400 mb-4">Baixe uma planilha com todos os seus produtos atuais.</p>
                    <button onClick={handleExport} className="btn-primary w-full">
                        Baixar Excel
                    </button>
                </div>

                <div className="p-6 rounded-xl bg-surface/5 border border-white/5 hover:border-green-400/50 transition-colors group">
                    <Upload className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white mb-2">Importar Produtos</h4>
                    <p className="text-sm text-gray-400 mb-4">Carregue uma planilha Excel (.xlsx) para adicionar produtos em massa.</p>
                    <label className="btn-primary w-full bg-green-500 hover:bg-green-600 block cursor-pointer">
                        Selecionar Arquivo
                        <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
                    </label>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
                Nota: Para importar, use o mesmo formato do arquivo exportado.
            </p>
        </div>
    );
};
