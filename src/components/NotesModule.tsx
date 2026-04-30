import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import RichTextEditor from './RichTextEditor';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Tag, 
  MessageSquare,
  Upload,
  MoreVertical,
  ChevronDown,
  Filter,
  Maximize2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';

interface Note {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  date: string;
  sectionId: string;
}

interface NotesModuleProps {
  sectionId: string;
  title?: string;
}

const NotesModule: React.FC<NotesModuleProps> = ({ sectionId, title = "Anotações e Registros" }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Geral',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Geral', 'Técnico', 'Manutenção', 'Segurança', 'Esquema', 'Componente'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { 
        ...n, 
        ...formData,
        date: new Date().toLocaleString('pt-BR')
      } : n));
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date().toLocaleString('pt-BR'),
        sectionId
      };
      setNotes([newNote, ...notes]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'Geral', image: '' });
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      image: note.image || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.sectionId === sectionId && (filterCategory === 'All' || n.category === filterCategory)
  );

  return (
    <div className="mt-12 space-y-6 border-t border-slate-200 pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-brand-blue" />
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-light">Registre observações, fotos e detalhes técnicos desta seção.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-light focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Todas Categorias</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-violet-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-brand-green/20 hover:bg-violet-900 transition-all text-sm"
          >
            <Plus size={16} />
            Nova Nota
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-900 text-sm">{editingNote ? 'Editar Anotação' : 'Nova Anotação'}</h4>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-800 outline-none font-light text-sm"
                  placeholder="Ex: Observação sobre o disjuntor"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-800 outline-none font-light text-sm"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Conteúdo</label>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <RichTextEditor 
                  value={formData.content}
                  onChange={content => setFormData({...formData, content})}
                  placeholder="Descreva os detalhes aqui com formatação rica..."
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-light hover:bg-slate-50 transition-all"
                >
                  <Upload size={14} className="text-slate-400" />
                  {formData.image ? 'Trocar Imagem' : 'Adicionar Imagem'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-violet-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-green/20 hover:bg-violet-900 transition-all flex items-center gap-2 text-xs"
                >
                  <Save size={16} />
                  Salvar Nota
                </button>
              </div>
            </div>

            {formData.image && (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 mt-2">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, image: ''})}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-brand-blue transition-all duration-300">
            {note.image && (
              <div className="relative h-48 bg-slate-50 group/img overflow-hidden">
                <img 
                  src={note.image} 
                  alt={note.title} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                  <button 
                    onClick={() => setSelectedImage(note.image || null)}
                    className="p-2 bg-white rounded-full shadow-lg text-brand-blue hover:scale-110 transition-transform"
                    title="Ver em tamanho real"
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag size={10} />
                  {note.category}
                </span>
                <div className="flex gap-1 transition-opacity">
                  <button onClick={() => handleEdit(note)} className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">{note.title}</h4>
              <div 
                className="text-sm text-slate-600 font-light line-clamp-3 mb-4 flex-1 prose prose-slate prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
              />
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-light">{note.date}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && !isFormOpen && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
              <MessageSquare size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Nenhuma anotação encontrada</h4>
            <p className="text-slate-500 text-sm font-light max-w-xs mx-auto mt-1">
              {filterCategory === 'All' 
                ? "Comece a registrar informações importantes clicando em 'Nova Anotação'." 
                : `Nenhuma anotação na categoria "${filterCategory}".`}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 transition-colors"
              >
                <X size={32} />
              </button>
              <img 
                src={selectedImage} 
                alt="Visualização em tamanho real" 
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesModule;
