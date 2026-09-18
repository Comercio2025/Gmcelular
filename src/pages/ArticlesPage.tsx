import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useData } from '../contexts/DataContext';

export const ArticlesPage = () => {
  const { articles } = useData();

  const published = [...articles]
    .filter((a) => a.active)
    .sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0) || Number(b.id) - Number(a.id));

  return (
    <Layout>
      <div className="py-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Artigos</h1>
        <p className="text-gray-400 mb-8">Conteúdos, dicas e novidades da GM Celular.</p>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((article) => (
              <article key={article.id} className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                {article.coverImageUrl ? (
                  <img src={article.coverImageUrl} alt={article.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-r from-blue-600/20 to-slate-600/20" />
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                  <Link to={`/artigos/${article.slug}`} className="text-blue-400 text-sm font-semibold hover:underline">
                    Ler artigo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface/5 rounded-2xl border border-white/5">
            <p className="text-gray-400">Nenhum artigo publicado no momento.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
