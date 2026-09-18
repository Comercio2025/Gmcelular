import { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Sparkles, Save, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { Article } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { Link } from 'react-router-dom';

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const ArticlesManager = () => {
  const { articles, saveArticle, deleteArticle, generateArticleAI } = useData();
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [aiTopic, setAiTopic] = useState('');
  const [aiContentType, setAiContentType] = useState<'artigo' | 'post' | 'legenda'>('artigo');
  const [isGenerating, setIsGenerating] = useState(false);

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0) || Number(b.id) - Number(a.id)),
    [articles],
  );

  const handleNew = () => {
    setEditingArticle({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      tags: '',
      active: true,
      orderIndex: articles.length + 1,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    setAiTopic('');
    setAiContentType('artigo');
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({
      ...article,
      publishedAt: article.publishedAt ? article.publishedAt.slice(0, 16) : '',
    });
    setAiTopic(article.title || '');
  };

  const handleSave = async () => {
    if (!editingArticle?.title || !editingArticle?.content) {
      alert('Título e conteúdo são obrigatórios.');
      return;
    }

    await saveArticle({
      ...editingArticle,
      slug: editingArticle.slug?.trim() ? editingArticle.slug : slugify(editingArticle.title),
      active: editingArticle.active !== false,
    });

    setEditingArticle(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    await deleteArticle(id);
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      alert('Informe o tema para gerar o artigo.');
      return;
    }

    try {
      setIsGenerating(true);
      const generated = await generateArticleAI(aiTopic, aiContentType);
      setEditingArticle((prev) => ({
        ...(prev || {}),
        title: generated.title,
        slug: slugify(generated.title),
        excerpt: generated.excerpt,
        content: generated.content,
        tags: generated.tags || prev?.tags || '',
        active: prev?.active ?? true,
        orderIndex: prev?.orderIndex ?? articles.length + 1,
        publishedAt: prev?.publishedAt || new Date().toISOString().slice(0, 16),
      }));
    } catch (e: any) {
      alert(`Falha ao gerar conteúdo com IA: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (editingArticle) {
    return (
      <div className="bg-surface rounded-2xl shadow-sm border border-white/10 animate-fade-in">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {editingArticle.id ? 'Editar Artigo' : 'Novo Artigo'}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingArticle(null)}
              className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-background"
            >
              <X className="w-4 h-4 inline mr-1" />
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-primary px-5 py-2 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Artigo
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-white/10 bg-background/40">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Gerar com IA (Gemini)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Tema do artigo (ex: Como escolher iPhone usado)"
              className="input-field md:col-span-2"
            />
            <select
              value={aiContentType}
              onChange={(e) => setAiContentType(e.target.value as 'artigo' | 'post' | 'legenda')}
              className="input-field bg-surface"
            >
              <option value="artigo">Artigo</option>
              <option value="post">Post</option>
              <option value="legenda">Legenda</option>
            </select>
            <button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="btn-primary disabled:opacity-60"
            >
              {isGenerating ? 'Gerando...' : 'Gerar com IA'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">A IA preenche título, resumo, tags e conteúdo para você revisar e publicar.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Título</label>
            <input
              type="text"
              value={editingArticle.title || ''}
              onChange={(e) =>
                setEditingArticle((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: prev?.slug ? prev.slug : slugify(e.target.value),
                }))
              }
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={editingArticle.slug || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              className="input-field w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Resumo</label>
            <textarea
              value={editingArticle.excerpt || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Imagem de capa (URL)</label>
            <input
              type="text"
              value={editingArticle.coverImageUrl || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
              className="input-field w-full"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags (SEO)</label>
            <input
              type="text"
              value={editingArticle.tags || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, tags: e.target.value }))}
              className="input-field w-full"
              placeholder="iphone, xiaomi, celular usado"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data de publicação</label>
            <input
              type="datetime-local"
              value={(editingArticle.publishedAt || '').slice(0, 16)}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, publishedAt: e.target.value }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ordem</label>
            <input
              type="number"
              value={editingArticle.orderIndex || 0}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, orderIndex: Number(e.target.value) || 0 }))}
              className="input-field w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={editingArticle.active !== false}
                onChange={(e) => setEditingArticle((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Artigo ativo/publicado
            </label>
          </div>
        </div>

        <div className="p-6 pt-0">
          <label className="block text-sm text-gray-400 mb-2">Conteúdo</label>
          <RichTextEditor
            value={editingArticle.content || ''}
            onChange={(content) => setEditingArticle((prev) => ({ ...prev, content }))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Artigos do Site</h3>
          <p className="text-sm text-gray-400">Crie conteúdos manuais ou com IA Gemini para publicar no menu Artigos.</p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Artigo
        </button>
      </div>

      <div className="space-y-3">
        {sortedArticles.map((article) => (
          <div
            key={article.id}
            className="p-4 rounded-xl bg-background border border-white/5 flex items-center justify-between group hover:border-blue-500/30/30 transition-all"
          >
            <div>
              <h4 className="font-bold text-white">{article.title}</h4>
              <p className="text-xs text-gray-400 mt-1">/{article.slug} • {article.active ? 'Publicado' : 'Oculto'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/artigos/${article.slug}`}
                target="_blank"
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                title="Ver artigo"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleEdit(article)}
                className="p-2 text-gray-300 hover:bg-white/10 rounded-lg"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sortedArticles.length === 0 && (
          <div className="text-center py-12 text-gray-400 border border-dashed border-white/10 rounded-xl">
            Nenhum artigo criado ainda.
          </div>
        )}
      </div>
    </div>
  );
};
