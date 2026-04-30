import React, { useState, useEffect } from 'react';
import { Search, Calendar, Eye, ChevronRight, Filter } from 'lucide-react';
import { sanityClient } from '../lib/sanityClient';

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
}

const CATEGORIES = [
  'Todas',
  'Eletrotécnica',
  'Eletromecânica',
  'Eletrônica',
  'Segurança',
  'Inovação'
];

export default function BlogModule() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
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
            slug
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
          views: Math.floor(Math.random() * 500)
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Blog Interno
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Artigos, guias e atualizações técnicas para profissionais da área.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-violet-700 text-white shadow-md shadow-violet-700/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-violet-700'
            }`}
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
            <a 
              key={post.id}
              href={post.slug?.current ? `https://eletromguide.vercel.app/blog/${post.slug.current}` : '#'}
              target={post.slug?.current ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!post.slug?.current) {
                  e.preventDefault();
                  alert('Este post não possui link direto gerado.');
                }
              }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 transition-all group overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
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
                
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-violet-700 transition-colors line-clamp-2">
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
                  <span className="w-8 h-8 rounded-full bg-violet-50 text-violet-700 flex items-center justify-center group-hover:bg-violet-700 group-hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Nenhum artigo encontrado</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Não encontramos publicações para os filtros selecionados. Tente buscar por outros termos ou categorias.
          </p>
        </div>
      )}
    </div>
  );
}
