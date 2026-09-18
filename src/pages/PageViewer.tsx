import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Layout } from '../components/Layout';

export const PageViewer = () => {
    const { slug } = useParams<{ slug: string }>();
    const { pages, loading } = useData();

    if (loading) {
        return (
            <Layout>
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    const page = pages.find(p => p.slug === slug && p.active);

    if (!page) {
        return <Navigate to="/" replace />;
    }

    // Visual Styles
    const containerStyles = {
        backgroundColor: page.backgroundColor || '#ffffff',
        fontFamily: page.fontFamily === 'serif' ? 'serif' : page.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
    };

    const contentStyles = {
        fontSize: page.fontSize === 'sm' ? '0.875rem' : page.fontSize === 'lg' ? '1.125rem' : page.fontSize === 'xl' ? '1.25rem' : '1rem',
        maxWidth: page.containerWidth === 'full' ? '100%' : '1200px',
        margin: '0 auto',
        padding: page.padding === 'none' ? '0' : page.padding === 'sm' ? '1rem' : page.padding === 'lg' ? '3rem' : '2rem',
    };

    return (
        <Layout>
            <div style={containerStyles} className="min-h-[60vh] text-gray-800">
                <main style={contentStyles} className="ql-editor p-0">
                    {/* Inject HTML content safely */}
                    <div
                        dangerouslySetInnerHTML={{ __html: page.content }}
                        className="prose prose-lg max-w-none"
                    />
                </main>
            </div>
            {/* Inject Quill Styles for correct rendering of editor content if needed, 
                but prose (Standard Tailwind Typography) usually covers it better. 
                Ideally we import 'react-quill/dist/quill.snow.css' somewhere global 
                or use 'ql-editor' class if we load the CSS. 
            */}
        </Layout>
    );
};
