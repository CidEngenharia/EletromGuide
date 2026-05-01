import React, { useState, useEffect } from 'react';
import { Search, Calendar, Eye, ChevronRight, Filter, X, Edit2, Trash2, Loader2, Save, ArrowLeft, User, Tag } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../lib/sanityClient';
import { User as UserType } from '../types';
import { cn } from '../lib/utils';
import RichTextEditor from './RichTextEditor';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  date: string;
  author: string;
  category: string;
  mainImageUrl?: string;
  slug?: { current: string };
  views: number;
  body?: any;
}

const CATEGORIES = [
  'Todas',
  'Eletrotécnica',
  'Eletromecânica',
  'Eletrônica',
  'Segurança',
  'Inovação'
];

export default function BlogModule({ user }: { user: UserType }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Visualização inline (substituiu o modal)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Lightbox da imagem
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Editor states
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const SANITY_TOKEN = import.meta.env.VITE_SANITY_TOKEN || '';

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await sanityClient.fetch(`
        *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
          _id,
          title,
          "excerpt": pt::text(body)[0..150],
          "status": "publish",
          "date": publishedAt,
          "author": author->name,
          "category": categories[0]->title,
          "mainImageUrl": mainImage.asset->url,
          slug,
          body
        }
      `);

      const formattedPosts: Post[] = data.map((item: any) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt ? item.excerpt + '...' : 'Sem resumo disponível.',
        status: item.status,
        date: item.date || new Date().toISOString(),
        author: item.author || 'Admin',
        category: item.category || 'Geral',
        mainImageUrl: item.mainImageUrl,
        slug: item.slug,
        views: Math.floor(Math.random() * 500),
        body: item.body
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ── Handlers ── */

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta postagem?')) return;

    if (!SANITY_TOKEN) {
      alert('Token do Sanity não configurado.');
      return;
    }

    setIsActionLoading(true);
    try {
      const authClient = sanityClient.withConfig({ token: SANITY_TOKEN });
      await authClient.delete(id);
      alert('Postagem excluída com sucesso!');
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert('Erro ao excluir postagem.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenEdit = (post: Post) => {
    setEditTitle(post.title);
    setEditCategory(post.category);
    let textContent = '';
    if (Array.isArray(post.body)) {
      textContent = post.body.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('\n\n');
    } else {
      textContent = post.body || '';
    }
    setEditContent(textContent);
    setIsEditModalOpen(true);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setEditTitle('');
    setEditCategory('Eletrotécnica');
    setEditContent('');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle || !editContent) {
      alert('Por favor, preencha o título e o conteúdo.');
      return;
    }

    if (!SANITY_TOKEN) {
      alert('Token do Sanity não configurado.');
      return;
    }

    setIsActionLoading(true);
    try {
      const authClient = sanityClient.withConfig({ token: SANITY_TOKEN });

      const doc: any = {
        _type: 'post',
        title: editTitle,
        slug: { _type: 'slug', current: editTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 50) },
        publishedAt: new Date().toISOString(),
        body: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: editContent }]
          }
        ],
      };

      if (selectedPost) {
        await authClient.patch(selectedPost.id).set({
          title: editTitle,
          body: doc.body
        }).commit();
        alert('Postagem atualizada com sucesso!');
      } else {
        await authClient.create(doc);
        alert('Postagem criada com sucesso!');
      }

      setIsEditModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      alert('Erro ao salvar postagem.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /* ═══════════════════════════════════════════
     VIEW INLINE — Detalhe do Post
  ═══════════════════════════════════════════ */
  if (selectedPost) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-0">
        {/* Barra superior de navegação */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50 rounded-xl font-bold transition-all shadow-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Voltar ao Blog
          </button>

          {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN') && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(selectedPost)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl font-bold transition-all shadow-sm"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button
                onClick={() => handleDeletePost(selectedPost.id)}
                disabled={isActionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Artigo — card com cantos levemente arredondados */}
        <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Imagem de capa reduzida */}
          {selectedPost.mainImageUrl && (
            <div className="p-6 pb-0">
              <div
                onClick={() => setIsImageExpanded(true)}
                className="relative overflow-hidden rounded-lg border border-slate-100 cursor-zoom-in group max-h-72 flex items-center justify-center bg-slate-50"
              >
                <img
                  src={selectedPost.mainImageUrl}
                  alt={selectedPost.title}
                  className="max-h-72 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                    <Eye size={13} /> Ampliar imagem
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto">
            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5">
                <Tag size={11} />
                {selectedPost.category}
              </span>
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(selectedPost.date).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </span>
              {selectedPost.author && (
                <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                  <User size={14} />
                  {selectedPost.author}
                </span>
              )}
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5 ml-auto">
                <Eye size={14} />
                {selectedPost.views} leituras
              </span>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
              {selectedPost.title}
            </h1>

            {/* Divisor */}
            <div className="h-px bg-slate-100 mb-8" />

            {/* Conteúdo */}
            <div className="prose prose-slate prose-lg max-w-none
              prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed
              prose-strong:font-black prose-strong:text-slate-800
              prose-a:text-violet-700 prose-a:no-underline hover:prose-a:underline
              prose-li:text-slate-600 prose-li:font-medium
              prose-blockquote:border-violet-500 prose-blockquote:bg-violet-50 prose-blockquote:rounded-xl prose-blockquote:px-6 prose-blockquote:not-italic
            ">
              {selectedPost.body ? (
                <PortableText value={selectedPost.body} />
              ) : (
                <p>{selectedPost.excerpt}</p>
              )}
            </div>

            {/* Rodapé do artigo */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 hover:text-violet-700 font-bold transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Voltar à lista
              </button>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                EletromGuide &middot; Blog
              </span>
            </div>
          </div>
        </article>

        {/* Lightbox de imagem */}
        {isImageExpanded && selectedPost.mainImageUrl && (
          <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsImageExpanded(false)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsImageExpanded(false)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
              <img
                src={selectedPost.mainImageUrl}
                alt={selectedPost.title}
                className="w-full h-auto rounded-xl shadow-2xl max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}

        {/* Modal de Edição */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">Editar Postagem</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto p-8 flex-1">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-violet-700 focus:ring-4 focus:ring-violet-700/10 transition-all text-xl font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo</label>
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                      <RichTextEditor
                        value={editContent}
                        onChange={setEditContent}
                        placeholder="Conteúdo do post..."
                        className="min-h-[300px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isActionLoading}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     LISTA DE POSTS
  ═══════════════════════════════════════════ */
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Blog
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Artigos e atualizações técnicas publicadas pela equipe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl w-full md:w-80 shadow-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium"
            />
          </div>
          {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN') && (
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/10 transition-all"
            >
              <span className="text-xl leading-none">+</span>
              <span className="hidden sm:inline">Novo Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all',
              selectedCategory === category
                ? 'bg-violet-700 text-white shadow-md shadow-violet-700/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-violet-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Lista de Posts */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-4" />
          <p className="font-medium text-lg">Carregando artigos...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 transition-all group overflow-hidden flex flex-col"
            >
              {/* Imagem clicável */}
              <div
                onClick={() => handleOpenPost(post)}
                className="aspect-[16/10] bg-slate-100 overflow-hidden relative cursor-pointer"
              >
                {post.mainImageUrl ? (
                  <img
                    src={post.mainImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                    <span className="font-bold text-sm tracking-widest uppercase">Sem Capa</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-violet-800 text-xs font-black uppercase tracking-wider rounded-lg shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h3
                  onClick={() => handleOpenPost(post)}
                  className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-violet-700 transition-colors line-clamp-2 cursor-pointer"
                >
                  {post.title}
                </h3>

                <p className="text-slate-500 font-medium line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
                    <Eye size={16} />
                    {post.views} leituras
                  </span>

                  {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN') ? (
                    /* Controles de admin no card */
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenPost(post); }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                        title="Visualizar"
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(post); }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                        Editar
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                        disabled={isActionLoading}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Excluir"
                      >
                        {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Excluir
                      </button>
                    </div>
                  ) : (
                    /* Link de leitura para usuário normal */
                    <button
                      onClick={() => handleOpenPost(post)}
                      className="flex items-center gap-1 text-sm font-bold text-violet-600 hover:gap-2 transition-all"
                    >
                      Ler artigo
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Nenhum artigo encontrado</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Não encontramos publicações para os filtros selecionados. Tente buscar por outros termos ou categorias.
          </p>
        </div>
      )}

      {/* Modal de Criação/Edição (sem post selecionado) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">
                {selectedPost ? 'Editar Postagem' : 'Nova Postagem'}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-8 flex-1">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-violet-700 focus:ring-4 focus:ring-violet-700/10 transition-all text-xl font-bold text-slate-800 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo</label>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                      placeholder="Conteúdo do post..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isActionLoading}
                className="px-8 py-2.5 rounded-xl font-bold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
