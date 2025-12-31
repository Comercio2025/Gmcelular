
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Package, Tag, ImageIcon } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: number, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { products, categories, banners, statuses } = useData();

    const inactiveStatusId = statuses.find(s => s.name === 'Inativo')?.id;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* FIX: Property 'status' does not exist on type 'Product'. Changed to 'statusId' and filtered based on the inactive status ID. */}
                <StatCard icon={Package} title="Produtos Ativos" value={products.filter(p=>p.statusId !== inactiveStatusId).length} color="bg-blue-500" />
                <StatCard icon={Tag} title="Categorias" value={categories.length} color="bg-green-500" />
                <StatCard icon={ImageIcon} title="Banners" value={banners.length} color="bg-purple-500" />
            </div>
             <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Bem-vindo à Área do Administrador</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Utilize o menu à esquerda para gerenciar todo o conteúdo do seu catálogo digital. Você pode adicionar novos produtos, organizar categorias, atualizar banners promocionais e muito mais.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
