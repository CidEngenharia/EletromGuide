import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Globe, 
  Save, 
  Eye, 
  MessageSquare, 
  Calendar, 
  User,
  ChevronRight,
  Send,
  RefreshCw,
  Image as ImageIcon,
  Settings,
  FileCode,
  Loader2,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { sanityClient } from '../lib/sanityClient';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  status: 'publish' | 'draft' | 'future' | string;
  date: string;
  author: string;
  category: string;
  views: number;
  body?: any;
  mainImageUrl?: string;
  slug?: { current: string };
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Manutenção Preventiva em Cabines Primárias',
    excerpt: 'Guia completo sobre os principais pontos de inspeção em cabines de média tensão...',
    status: 'publish',
    date: '2024-04-25',
    author: 'Sidney Silva',
    category: 'Eletrotécnica',
    views: 1240
  },
  {
    id: '2',
    title: 'Novas Normas de Segurança NR-10 em 2024',
    excerpt: 'Entenda o que mudou na regulamentação de segurança em instalações elétricas...',
    status: 'publish',
    date: '2024-04-20',
    author: 'Equipe Técnica',
    category: 'Segurança',
    views: 856
  },
  {
    id: '3',
    title: 'Vantagens do Monitoramento de Energia por IOT',
    excerpt: 'Como a tecnologia de internet das coisas está revolucionando o consumo industrial...',
    status: 'draft',
    date: '2024-04-28',
    author: 'Sidney Silva',
    category: 'Inovação',
    views: 0
  }
];

interface BlogAdminProps {
  userRole?: 'ADMIN_GLOBAL' | 'ADMIN' | 'TECNICO';
}

const BlogAdminModule = ({ userRole = 'TECNICO' }: BlogAdminProps) => {
  const canEdit = userRole === 'ADMIN_GLOBAL' || userRole === 'ADMIN';
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({
    id: '',
    title: '',
    excerpt: '',
    status: 'draft',
    category: 'Eletrotécnica',
    mainImageUrl: ''
  });
  const [content, setContent] = useState('');
  
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Preview states
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Variáveis de ambiente para conexão com Sanity
  const SANITY_TOKEN = import.meta.env.VITE_SANITY_TOKEN || '';

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await sanityClient.fetch(`
        *[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          "excerpt": pt::text(body)[0..150],
          "status": "publish",
          "date": publishedAt,
          "author": author->name,
          "category": categories[0]->title,
          body,
          "mainImageUrl": mainImage.asset->url,
          slug
        }
      `);
      
      const formattedPosts: Post[] = data.map((item: any) => ({
        id: item._id,
        title: item.title,
        excerpt: item.excerpt ? item.excerpt + '...' : 'Sem resumo',
        status: item.status,
        date: item.date || new Date().toISOString(),
        author: item.author || 'Admin',
        category: item.category || 'Geral', 
        views: Math.floor(Math.random() * 500),
        body: item.body,
        mainImageUrl: item.mainImageUrl,
        slug: item.slug
      }));
      setPosts(formattedPosts.length > 0 ? formattedPosts : mockPosts);
    } catch (error) {
      console.error('Aviso: Erro ao buscar no Sanity. Exibindo dados de teste.', error);
      setPosts(mockPosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetEditor = () => {
    setCurrentPost({ id: '', title: '', excerpt: '', status: 'draft', category: 'Eletrotécnica', mainImageUrl: '' });
    setContent('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!SANITY_TOKEN) {
      alert('O token de API do Sanity (VITE_SANITY_TOKEN) não está configurado.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const authClient = sanityClient.withConfig({ token: SANITY_TOKEN });
      const asset = await authClient.assets.upload('image', file, {
        filename: file.name
      });
      setCurrentPost({ ...currentPost, mainImageUrl: asset.url, _imageId: asset._id } as any);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    if (!currentPost.title || !content) {
      alert('O título e o conteúdo são obrigatórios para publicar.');
      return;
    }

    if (!SANITY_TOKEN) {
      alert('O token de API do Sanity (VITE_SANITY_TOKEN) não está configurado no arquivo .env.\n\nAplicativo rodando em modo simulação. Postagem seria enviada para o Sanity.');
      setView('list');
      resetEditor();
      return;
    }

    setIsPublishing(true);
    try {
      const authClient = sanityClient.withConfig({ token: SANITY_TOKEN });
      
      const postDoc: any = {
        _type: 'post',
        title: currentPost.title,
        body: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: content.replace(/<[^>]*>?/gm, '') }]
          }
        ],
      };

      const imageId = (currentPost as any)._imageId;
      if (imageId) {
        postDoc.mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageId }
        };
      }

      if (currentPost.id) {
        await authClient.patch(currentPost.id).set(postDoc).commit();
        alert('Sucesso! Artigo atualizado com sucesso no Sanity!');
      } else {
        postDoc.publishedAt = new Date().toISOString();
        await authClient.create(postDoc);
        alert('Sucesso! Artigo publicado diretamente no seu Sanity!');
      }

      fetchPosts(); 
      setView('list');
      resetEditor();
    } catch (error) {
      console.error('Erro ao conectar ao Sanity:', error);
      alert('Erro de conexão ao tentar enviar os dados. Verifique as permissões do token no Sanity.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = (post: Post) => {
    setCurrentPost({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      status: post.status,
      category: post.category,
      mainImageUrl: post.mainImageUrl,
    });
    
    let textContent = '';
    if (Array.isArray(post.body)) {
      textContent = post.body.map(block => block.children?.map((c: any) => c.text).join('')).join('\n\n');
    } else {
      textContent = post.body || '';
    }
    setContent(textContent);
    setView('editor');
  };

  const handlePreviewPost = (post: Post) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta postagem permanentemente do Sanity?')) return;
    
    if (!SANITY_TOKEN) {
      alert('Token do Sanity não configurado.');
      return;
    }

    setIsLoading(true);
    try {
      const authClient = sanityClient.withConfig({ token: SANITY_TOKEN });
      await authClient.delete(id);
      alert('Postagem excluída com sucesso!');
      fetchPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert('Erro ao excluir postagem do Sanity.');
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'editor') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-700/10 flex items-center justify-center text-violet-800">
                <Plus size={24} />
              </div>
              Nova Postagem
            </h2>
            <p className="text-slate-500 font-medium">Editor interno integrado ao WordPress</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setView('list'); resetEditor(); }}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200"
            >
              Cancelar
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-violet-700/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)' }}
            >
              {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {isPublishing ? 'Publicando...' : 'Publicar no Blog'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Título do Artigo</label>
                <input 
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                  placeholder="Ex: Guia de Manutenção de Transformadores"
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-700 focus:ring-4 focus:ring-violet-700/10 transition-all text-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo</label>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <RichTextEditor 
                    value={content}
                    onChange={setContent}
                    placeholder="Comece a escrever seu artigo técnico aqui..."
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 space-y-6">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Settings size={18} className="text-violet-700" />
                Configurações do Post
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-700 transition-all font-bold text-slate-700"
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                  >
                    <option>Eletrotécnica</option>
                    <option>Eletrônica</option>
                    <option>Segurança</option>
                    <option>Inovação</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resumo (Excerpt)</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-700 transition-all font-medium text-slate-600 h-24 resize-none"
                    placeholder="Um pequeno resumo para atrair leitores..."
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  />
                </div>

                <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                  <div className="flex items-center gap-3 text-violet-900 font-bold text-sm mb-2">
                    <Globe size={16} />
                    Sincronização Sanity
                  </div>
                  <p className="text-xs text-violet-800 font-medium">
                    Ao publicar, este artigo será enviado automaticamente para sua API do <span className="underline">Sanity CMS</span> de forma segura.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl text-white space-y-4">
              <h3 className="font-black flex items-center gap-2">
                <ImageIcon size={18} className="text-violet-500" />
                Imagem de Capa
              </h3>
              <label className="relative aspect-video rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-violet-700/50 transition-all cursor-pointer group overflow-hidden bg-slate-800">
                {currentPost.mainImageUrl ? (
                  <img src={currentPost.mainImageUrl} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Plus className="text-slate-500 group-hover:text-violet-500 transition-all" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">
                      {isUploadingImage ? 'Enviando...' : 'Upload Capa'}
                    </span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  disabled={isUploadingImage}
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                     <Loader2 size={24} className="animate-spin text-violet-500" />
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtragem local dos posts listados
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-700 flex items-center justify-center text-white shadow-lg shadow-violet-700/20">
              <MessageSquare size={28} />
            </div>
            Gerenciar Blog
          </h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            Central de publicações integrada ao seu site externo
            <span className="w-1.5 h-1.5 bg-violet-700 rounded-full animate-pulse" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canEdit && (
            <button 
              onClick={() => { resetEditor(); setView('editor'); }}
              className="px-6 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-violet-700/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)' }}
            >
              <Plus size={20} />
              Nova Postagem
            </button>
          )}
          <button 
            onClick={fetchPosts}
            className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            title="Sincronizar Agora"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin text-violet-700' : ''} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Posts', value: posts.length.toString(), icon: FileCode, color: 'violet' },
          { label: 'Visualizações', value: '12.4k', icon: Eye, color: 'blue' },
          { label: 'Comentários', value: '48', icon: MessageSquare, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-800">Postagens Recentes</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar posts..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-700 transition-all text-sm font-medium w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Título</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-violet-800 transition-colors" dangerouslySetInnerHTML={{ __html: post.title }} />
                      <span className="text-xs text-slate-400 font-medium">{post.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      post.status === 'publish' ? 'bg-violet-100 text-violet-900' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.status === 'publish' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button 
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Editar Post"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handlePreviewPost(post)}
                        className="p-2 rounded-lg text-slate-400 hover:text-violet-800 hover:bg-violet-50 transition-all"
                        title="Visualizar Post"
                      >
                        <Eye size={18} />
                      </button>
                      {canEdit && (
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Excluir Post"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {post.slug?.current && (
                        <a 
                          href={`https://eletromguide.vercel.app/blog/${post.slug.current}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                          title="Ver no Site Externo"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPosts.length === 0 && (
             <div className="p-8 text-center text-slate-500 font-medium">
               Nenhum post encontrado.
             </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isViewModalOpen && selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {selectedPost.category}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {new Date(selectedPost.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-8 md:p-12">
              <div className="max-w-2xl mx-auto space-y-8">
                {selectedPost.mainImageUrl && (
                  <img 
                    src={selectedPost.mainImageUrl} 
                    alt={selectedPost.title} 
                    className="w-full max-w-sm mx-auto aspect-video object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setExpandedImage(selectedPost.mainImageUrl!)}
                  />
                )}
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {selectedPost.title}
                </h1>
                
                <div className="prose prose-slate prose-lg max-w-none">
                   {selectedPost.body ? (
                     <div className="whitespace-pre-wrap font-medium text-slate-600">
                        {Array.isArray(selectedPost.body) 
                          ? selectedPost.body.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('\n\n')
                          : selectedPost.body
                        }
                     </div>
                   ) : (
                     <p className="text-slate-600 font-medium">{selectedPost.excerpt}</p>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" onClick={() => setExpandedImage(null)}>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={expandedImage} 
              alt="Ampliada" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-md transition-colors"
              onClick={() => setExpandedImage(null)}
            >
              <X size={24} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogAdminModule;
