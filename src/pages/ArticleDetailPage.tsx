import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useData } from '../contexts/DataContext';

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useData();

  const article = articles.find((a) => a.slug === slug && a.active);

  if (!article) {
    return <Navigate to="/artigos" replace />;
  }

  return (
    <Layout>
      <article className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{article.title}</h1>
        {article.excerpt && <p className="text-gray-300 mb-6 text-lg">{article.excerpt}</p>}

        {article.coverImageUrl && (
          <img src={article.coverImageUrl} alt={article.title} className="w-full max-h-[460px] object-cover rounded-2xl mb-8" />
        )}

        <div
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </article>
    </Layout>
  );
};
