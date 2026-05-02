import { Search, Calendar, Eye, ChevronRight, Filter, X, Edit2, Trash2, Loader2, Save, ArrowLeft, User, Tag, Upload, Image as ImageIcon, ChevronLeft } from 'lucide-react';
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
  'Inovação',
  'Manutenção',
  'Normas Técnicas'
];

const POSTS_PER_PAGE = 6;

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
  const [editCategory, setEditCategory] = useState('Eletrotécnica');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);

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
        excerpt: item.excerpt ? item.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : 'Sem resumo disponível.',
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
    // Não scrollar para o topo se for dentro do dashboard, 
    // mas o modal já lida com isso.
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
    setEditImageUrl(post.mainImageUrl || '');
    setImageFile(null);
    let content = '';
    
    if (Array.isArray(post.body)) {
      if (post.body.length === 1 && post.body[0].children?.[0]?.text?.includes('<')) {
        content = post.body[0].children[0].text;
      } else {
        content = post.body.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('\n\n');
      }
    } else {
      content = post.body || '';
    }
    
    setEditContent(content);
    setIsEditModalOpen(true);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setEditTitle('');
    setEditCategory('Eletrotécnica');
    setEditImageUrl('');
    setImageFile(null);
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
      
      let mainImage: any = null;

      // 1. Lógica de Imagem: Upload de Arquivo ou URL
      if (imageFile) {
        // Upload do arquivo para o Sanity
        const asset = await authClient.assets.upload('image', imageFile);
        mainImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        };
      } else if (editImageUrl) {
        // Se for apenas uma URL externa, o Sanity geralmente prefere assets, 
        // mas podemos tentar salvar como uma URL customizada se o schema permitir.
        // Como o padrão é asset, vamos tentar baixar e subir ou apenas manter como está.
        // Para simplificar, vamos assumir que o usuário quer que a URL seja salva.
        // Se o schema for o padrão do Sanity Blog, ele EXIGE um asset.
        // Vamos tentar baixar a imagem e fazer upload se for uma URL externa.
        try {
          const response = await fetch(editImageUrl);
          const blob = await response.blob();
          const asset = await authClient.assets.upload('image', blob, { filename: 'cover-image' });
          mainImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          };
        } catch (e) {
          console.warn('Não foi possível processar a URL da imagem externa. Usando apenas metadados se possível.');
        }
      }

      // 2. Buscar ou criar categoria (simplificado: vamos tentar referenciar por título se soubermos o ID, 
      // ou apenas omitir se não tivermos o sistema de categorias completo no Sanity agora)
      // Para este projeto, vamos focar no título direto se o schema permitir, 
      // ou tentar buscar a categoria.
      const categoryData = await authClient.fetch(`*[_type == "category" && title == $title][0]._id`, { title: editCategory });
      
      const doc: any = {
        _type: 'post',
        title: editTitle,
        slug: { _type: 'slug', current: editTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 50) + '-' + Math.random().toString(36).substring(2, 7) },
        publishedAt: new Date().toISOString(),
        body: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: editContent }]
          }
        ],
        mainImage: mainImage,
        categories: categoryData ? [{ _type: 'reference', _ref: categoryData }] : []
      };

      if (selectedPost) {
        const patchData: any = {
          title: editTitle,
          body: doc.body,
          categories: doc.categories
        };
        if (mainImage) patchData.mainImage = mainImage;

        await authClient.patch(selectedPost.id).set(patchData).commit();
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

  // Paginação
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  /* ═══════════════════════════════════════════
     VIEW INLINE — Detalhe do Post
  ═══════════════════════════════════════════ */
  if (selectedPost) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-slate-50 w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Header do Modal */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-violet-700 font-bold transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Voltar ao Blog</span>
            </button>
            
            <div className="flex items-center gap-2">
              {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN') && (
                <>
                  <button
                    onClick={() => handleOpenEdit(selectedPost)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />
              <button
                onClick={handleBack}
                className="p-2 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
            {/* Artigo */}
            <article className="max-w-4xl mx-auto py-12 px-6 sm:px-10 md:px-16">
              
              {/* Imagem de capa */}
              {selectedPost.mainImageUrl && (
                <div className="mb-12">
                  <div
                    onClick={() => setIsImageExpanded(true)}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 cursor-zoom-in group bg-slate-50 shadow-sm"
                  >
                    <img
                      src={selectedPost.mainImageUrl}
                      alt={selectedPost.title}
                      className="w-full h-auto max-h-[500px] object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-black px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl border border-slate-200">
                        <Eye size={14} /> CLIQUE PARA AMPLIAR
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadados */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(selectedPost.date).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </span>
                  {selectedPost.author && (
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {selectedPost.author}
                    </span>
                  )}
                </div>
              </div>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
                {selectedPost.title}
              </h1>

              {/* Divisor */}
              <div className="h-1.5 w-24 bg-violet-600 rounded-full mb-12" />

              {/* Conteúdo */}
              <div className="prose prose-slate prose-base sm:prose-lg max-w-none break-words
                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                prose-strong:font-black prose-strong:text-slate-900
                prose-img:rounded-2xl prose-img:shadow-xl
                prose-table:border-collapse
              ">
                <style dangerouslySetInnerHTML={{ __html: `
                  .prose img { max-width: 100%; height: auto; display: block; margin: 2.5rem auto; }
                  .prose table { width: 100%; border-collapse: collapse; margin: 2.5rem 0; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
                  .prose th, .prose td { border: 1px solid #e2e8f0; padding: 1.25rem; text-align: left; min-width: 140px; }
                  .prose th { background-color: #f8fafc; font-weight: 900; color: #0f172a; }
                  .prose pre { white-space: pre-wrap; word-break: break-all; background: #0f172a; color: #f8fafc; padding: 2rem; border-radius: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; }
                  .prose blockquote { border-left-width: 4px; border-left-color: #7c3aed; background-color: #f5f3ff; padding: 1.5rem 2rem; border-radius: 0 1rem 1rem 0; font-style: italic; color: #4c1d95; }
                `}} />
                
                {selectedPost.body ? (
                  Array.isArray(selectedPost.body) && 
                  selectedPost.body.length === 1 && 
                  selectedPost.body[0].children?.[0]?.text?.includes('<') ? (
                    <div className="ql-editor p-0" dangerouslySetInnerHTML={{ __html: selectedPost.body[0].children[0].text }} />
                  ) : (
                    <PortableText value={selectedPost.body} />
                  )
                ) : (
                  <p className="text-xl text-slate-500 italic">{selectedPost.excerpt}</p>
                )}
              </div>

              {/* Rodapé do artigo */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <Eye size={18} />
                  <span>{selectedPost.views} leituras</span>
                </div>
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
                  EletromGuide &bull; Excelência Técnica
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Lightbox de imagem */}
        {isImageExpanded && selectedPost.mainImageUrl && (
          <div
            className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
            onClick={() => setIsImageExpanded(false)}
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsImageExpanded(false)}
                className="absolute -top-14 right-0 p-3 text-white/50 hover:text-white transition-all bg-white/5 rounded-full"
              >
                <X size={28} />
              </button>
              <img
                src={selectedPost.mainImageUrl}
                alt={selectedPost.title}
                className="w-full h-auto rounded-2xl shadow-2xl max-h-[85vh] object-contain border border-white/10"
              />
            </div>
          </div>
        )}

        {/* Modal de Edição (Copia exata para manter funcionalidade dentro do view) */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">Editar Postagem</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-8 flex-1">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-700 focus:ring-4 focus:ring-violet-700/10 transition-all text-xl md:text-2xl font-black text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo</label>
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-inner">
                      <RichTextEditor
                        value={editContent}
                        onChange={setEditContent}
                        placeholder="Conteúdo do post..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isActionLoading}
                  className="px-10 py-3 rounded-xl font-bold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 transition-all flex items-center gap-2 disabled:opacity-60"
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map(post => (
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-bold transition-all",
                    currentPage === page
                      ? "bg-violet-700 text-white shadow-lg shadow-violet-700/20"
                      : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
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

            <div className="overflow-y-auto p-4 sm:p-8 flex-1 bg-white">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Título e Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título da Postagem</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Ex: Guia de Segurança em Instalações Elétricas"
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-700 focus:ring-4 focus:ring-violet-700/10 transition-all text-xl font-black text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-700 transition-all text-sm font-bold text-slate-800 outline-none appearance-none"
                    >
                      {CATEGORIES.filter(c => c !== 'Todas').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Imagem de Capa */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Imagem de Capa</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                        <ImageIcon size={18} />
                      </div>
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => {
                          setEditImageUrl(e.target.value);
                          setImageFile(null);
                        }}
                        placeholder="Cole a URL da imagem aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-700 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="cover-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setEditImageUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label
                        htmlFor="cover-upload"
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-violet-300 cursor-pointer transition-all text-slate-500 font-bold text-sm"
                      >
                        <Upload size={18} />
                        {imageFile ? imageFile.name : 'Ou suba um arquivo'}
                      </label>
                    </div>
                  </div>
                  
                  {/* Preview da Imagem */}
                  {(editImageUrl) && (
                    <div className="relative mt-4 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-w-sm mx-auto shadow-sm">
                      <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setEditImageUrl('');
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo do Artigo</label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-inner">
                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                      placeholder="Comece a escrever seu artigo incrível..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isActionLoading}
                className="px-10 py-3 rounded-xl font-bold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {selectedPost ? 'Salvar Alterações' : 'Publicar Postagem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
