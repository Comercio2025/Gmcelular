
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { pages } = useData();
    // A state for search term is needed for the Header, but it's not used on this page.
    const [searchTerm, setSearchTerm] = React.useState(''); 

    const page = pages.find(p => p.slug === slug);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {page ? (
                    <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-lg shadow-lg">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 border-b pb-4">{page.title}</h1>
                        <div 
                            className="prose dark:prose-invert max-w-none" 
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h1 className="text-4xl font-bold">404</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Página não encontrada</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CustomPage;
