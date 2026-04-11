import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Cloud, 
  Save,
  CheckCircle2,
  X,
  AlertTriangle,
  Users,
  HardHat,
  Zap,
  ArrowUp,
  Flame,
  Box,
  Construction,
  Truck,
  Eye,
  Edit2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PT } from '../types';
import { cn } from '../lib/utils';

const POTENTIAL_RISKS = [
  'Explosão / Incêndio', 'Queimaduras', 'Animais peçonhentos', 'Excesso de particulados', 'Queda material/ objetos',
  'Acúmulo de Eletricidade Estática', 'Produtos químicos/ Corrosivos/ Tóxicos', 'Condições climáticas desfavoráveis', 'Atropelamento/ Abalroamento', 'Influência Externa de Terceiros',
  'Prensamento de membros / Cortes', 'Ergonomia', 'Tubulação e cabos enterrados', 'Projeção de materiais/ fagulhas', 'Cantos vivos /Arestas perfuro cortante',
  'Choque elétrico/ Magnéticos', 'Trabalhos elétricos em áreas classificadas', 'Contato Acidental em partes Energizadas', 'Piso escorregadio / Umidade', 'Ruído no local',
  'Desmoronamento / Soterramento', 'Possibilidade de rupturas em cabos de Aço', 'Queda de diferente nível (escada, plataforma, andaimes)'
];

const EQUIPMENTS_USED = [
  'Máquina de Solda', 'Maçarico', 'Equip. elétrico', 'Ferramenta Pneumática', 'Andaimes / Escadas', 'Ferramentas manuais'
];

const MANDATORY_PRECAUTIONS = [
  'As condições do ambiente são adequadas para execução do serviço?',
  'A equipe envolvida conhece o sistema de emergência?',
  'As rotas de fuga estão desobstruídas?',
  'O local foi isolado e sinalizado para limitar / impedir o acesso de pessoas e veículos ao local?',
  'O ambiente está protegido contra vazamentos de óleos lubrificantes?',
  'Os trabalhadores da área estão cientes da atividade que será desenvolvida?',
  'Todos os equipamentos que serão usados foram preparados, inspecionados e estão prontos para serem utilizados?',
  'As fontes de energias estão desligadas e bloqueadas?'
];

const SPECIFIC_PRECAUTIONS = [
  {
    category: 'TRABALHO A QUENTE',
    items: [
      'Materiais ou gases combustíveis estão ausentes ou controlados, no ambiente?',
      'Os cilindros de oxigênio e acetileno possuem válvula corta chama?',
      'A máquina de solda está com os cabos de aterramento em perfeitas condições?',
      'O local foi avaliado por bombeiro civil ou brigadista antes da atividade?',
      'O perigo de condução de calor para outras áreas está controlado?',
      'Os EPIS para trabalhos a quente estão adequados?',
      'Foi realizado o check-list dos equipamentos de trabalho a quente?',
      'No local há pessoas habilitadas/capacitadas para utilizar os equip. de combate a incêndio?',
      'O cenário de prevenção e combate a incêndio foi montada de forma adequada?',
      'O local está limpo, isolado e sinalizado para realizar a atividade?',
      'Verificar o trabalho a quente após 60 minutos do termino?'
    ]
  },
  {
    category: 'TRABALHO EM ALTURA',
    items: [
      'As condições atmosféricas são favoráveis (ausência de chuvas, ventos fortes)?',
      'As escadas utilizadas estão em boas condições de segurança?',
      'Os executantes estão em boas condições física e psicológica?',
      'Foi verificado condições, estabilidade e travamento de andaimes, plataforma e escadas?',
      'Os executantes estão capacitados e autorizados para realizar a atividade?',
      'Os andaimes foram inspecionados e aprovados pela segurança do trabalho?',
      'Foi fixado pranchões ou passarela em trabalhos no telhado?',
      'Os pontos de ancoragem / linha vida foram aprovados pela segurança do trabalho?',
      'Os andaimes, plataformas, escadas estão afastados da rede elétrica?',
      'Os equipamentos de prevenções de queda, estão em perfeitas condições?',
      'Foi realizado check list e aprovado para utilização da plataforma elevatória?'
    ]
  }
];

const EPIS_LIST = [
  'Capacete com Jugular', 'Botas de PVC', 'Aterramento Elétrico Temporário', 'Ferramenta Isolantes/ Anti-Faiscantes',
  'Protetor Facial', 'Luvas de Isolação / Alta Tensão', 'Impedimento Elétrico', 'Ordem, Limpeza e Arrumação',
  'Máscara Apropriadas (Respiradores)', 'Protetor Auricular (plug/ Concha)', 'Instalação de Invólucros/ Corta Faísca', 'Medição da Ausência de Tensão',
  'Cinto de Segurança tipo Paraquedista com Talabarte Duplo', 'Luva apropriada ao Risco', 'Equipamento de combate a incêndio', 'Iluminação Adequada (lanterna a prova de explosão)',
  'Óculos de Segurança (Impacto/ Incolor/ Ampla Visão)', 'Proteção contra fagulhas (Biombo/ Tapumes/ Manta Anti-chama)', 'Sinalização e Isolamento (Fita zebrada, Cones, Placas) de Segurança na Área', 'EPIs para Trabalho a Quente',
  'Calçado de Segurança', 'Bastão de Manobra/ Estrado de Borracha', 'Equipamento Autônomo de ar respirável'
];

const PTModule = () => {
  const [pts, setPts] = useState<PT[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPt, setCurrentPt] = useState<Partial<PT>>({
    gravityPotential: 'C',
    laborType: 'INTERNA',
    potentialRisks: [],
    equipmentUsed: [],
    mandatoryPrecautions: MANDATORY_PRECAUTIONS.map(label => ({ label, status: null })),
    specificPrecautions: SPECIFIC_PRECAUTIONS.map(cat => ({
      category: cat.category,
      items: cat.items.map(label => ({ label, status: null }))
    })),
    epis: [],
    authorizedWorkers: [],
    status: 'ABERTA'
  });

  const handleToggleList = (field: 'potentialRisks' | 'equipmentUsed' | 'epis', value: string) => {
    const list = currentPt[field] as string[];
    if (list.includes(value)) {
      setCurrentPt({ ...currentPt, [field]: list.filter(v => v !== value) });
    } else {
      setCurrentPt({ ...currentPt, [field]: [...list, value] });
    }
  };

  const handlePrecautionChange = (categoryIndex: number | null, itemIndex: number, status: 'S' | 'NA') => {
    if (categoryIndex === null) {
      const newPrecautions = [...(currentPt.mandatoryPrecautions || [])];
      newPrecautions[itemIndex] = { ...newPrecautions[itemIndex], status };
      setCurrentPt({ ...currentPt, mandatoryPrecautions: newPrecautions });
    } else {
      const newSpecific = [...(currentPt.specificPrecautions || [])];
      newSpecific[categoryIndex].items[itemIndex] = { ...newSpecific[categoryIndex].items[itemIndex], status };
      setCurrentPt({ ...currentPt, specificPrecautions: newSpecific });
    }
  };

  const handleAddWorker = () => {
    setCurrentPt({
      ...currentPt,
      authorizedWorkers: [...(currentPt.authorizedWorkers || []), { name: '', signature: '' }]
    });
  };

  const handleSavePT = () => {
    if (!currentPt.location || !currentPt.companyName) return;
    
    if (currentPt.id && pts.some(p => p.id === currentPt.id)) {
      setPts(pts.map(p => p.id === currentPt.id ? currentPt as PT : p));
    } else {
      const newPt: PT = {
        ...currentPt as PT,
        id: `PT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setPts([newPt, ...pts]);
    }
    
    setIsFormOpen(false);
    setCurrentPt({
      gravityPotential: 'C',
      laborType: 'INTERNA',
      potentialRisks: [],
      equipmentUsed: [],
      mandatoryPrecautions: MANDATORY_PRECAUTIONS.map(label => ({ label, status: null })),
      specificPrecautions: SPECIFIC_PRECAUTIONS.map(cat => ({
        category: cat.category,
        items: cat.items.map(label => ({ label, status: null }))
      })),
      epis: [],
      authorizedWorkers: [],
      status: 'ABERTA'
    });
  };

  const handleEditPT = (pt: PT) => {
    setCurrentPt(pt);
    setIsFormOpen(true);
  };

  const handleDeletePT = (id: string) => {
    setPts(pts.filter(p => p.id !== id));
  };

  const generatePDF = (pt: PT) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Header
    doc.setFontSize(18);
    doc.text('PERMISSÃO DE TRABALHO', 105, 15, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Distribuição: 1º via Campo e 2º Segurança do Trabalho', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.rect(10, 25, 190, 30);
    doc.text(`Potencial de Gravidade: ${pt.gravityPotential}`, 15, 32);
    doc.text(`Data: ${pt.date}`, 80, 32);
    doc.text(`Hora: ${pt.time}`, 140, 32);
    
    doc.text(`Mão de Obra: ${pt.laborType}`, 15, 40);
    doc.text(`Nome da Empresa: ${pt.companyName}`, 80, 40);
    
    doc.text(`Local: ${pt.location}`, 15, 48);
    doc.text(`Equipamento: ${pt.equipmentInvolved}`, 100, 48);

    // Risks
    doc.setFontSize(12);
    doc.text('Riscos Potenciais', 15, 65);
    doc.setFontSize(8);
    let y = 72;
    pt.potentialRisks.forEach((risk, i) => {
      if (i % 2 === 0) {
        doc.text(`[X] ${risk}`, 15, y);
      } else {
        doc.text(`[X] ${risk}`, 100, y);
        y += 5;
      }
    });

    // Precautions
    doc.setFontSize(12);
    doc.text('Precauções Obrigatórias', 15, y + 10);
    const precautionData = pt.mandatoryPrecautions.map(p => [p.label, p.status || '-']);
    doc.autoTable({
      startY: y + 15,
      head: [['Precaução', 'Status']],
      body: precautionData,
      theme: 'grid',
      styles: { fontSize: 7 }
    });

    doc.save(`${pt.id}_PT.pdf`);
  };

  const saveToDropbox = (pt: PT) => {
    alert(`Simulando upload para Dropbox: ${pt.id}_PT.pdf`);
    window.open('https://www.dropbox.com/home', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Permissões de Trabalho (PT)</h2>
          <p className="text-slate-500 text-sm">Emissão e controle de autorizações de serviço.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nova PT
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">Emissão de Permissão de Trabalho</h3>
            <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8 space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Potencial de Gravidade</label>
                <div className="flex gap-2">
                  {['A', 'B', 'C'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setCurrentPt({...currentPt, gravityPotential: v as any})}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-bold border transition-all",
                        currentPt.gravityPotential === v ? "bg-brand-blue border-brand-blue text-white" : "border-slate-200 text-slate-400"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Mão de Obra</label>
                <div className="flex gap-2">
                  {['INTERNA', 'EXTERNA'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setCurrentPt({...currentPt, laborType: v as any})}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-bold border transition-all",
                        currentPt.laborType === v ? "bg-brand-blue border-brand-blue text-white" : "border-slate-200 text-slate-400"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome da Empresa</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  value={currentPt.companyName || ''}
                  onChange={e => setCurrentPt({...currentPt, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Local do Trabalho</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  value={currentPt.location || ''}
                  onChange={e => setCurrentPt({...currentPt, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Equipamento Envolvido</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  value={currentPt.equipmentInvolved || ''}
                  onChange={e => setCurrentPt({...currentPt, equipmentInvolved: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Equipamento Desligado?</label>
                <div className="flex gap-2">
                  {[true, false].map(v => (
                    <button 
                      key={v.toString()}
                      onClick={() => setCurrentPt({...currentPt, isEquipmentOff: v})}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-bold border transition-all",
                        currentPt.isEquipmentOff === v ? "bg-brand-blue border-brand-blue text-white" : "border-slate-200 text-slate-400"
                      )}
                    >
                      {v ? 'SIM' : 'NÃO'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Risks & Equipments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 border-b pb-2">Riscos Potenciais</h4>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                  {POTENTIAL_RISKS.map(risk => (
                    <button 
                      key={risk}
                      onClick={() => handleToggleList('potentialRisks', risk)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all",
                        currentPt.potentialRisks?.includes(risk) ? "bg-brand-blue/5 border-brand-blue text-brand-blue" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded border flex items-center justify-center", currentPt.potentialRisks?.includes(risk) ? "bg-brand-blue border-brand-blue text-white" : "border-slate-300")}>
                        {currentPt.potentialRisks?.includes(risk) && <CheckCircle2 size={12} />}
                      </div>
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 border-b pb-2">Equipamentos Utilizados</h4>
                <div className="grid grid-cols-1 gap-2">
                  {EQUIPMENTS_USED.map(eq => (
                    <button 
                      key={eq}
                      onClick={() => handleToggleList('equipmentUsed', eq)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all",
                        currentPt.equipmentUsed?.includes(eq) ? "bg-brand-blue/5 border-brand-blue text-brand-blue" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded border flex items-center justify-center", currentPt.equipmentUsed?.includes(eq) ? "bg-brand-blue border-brand-blue text-white" : "border-slate-300")}>
                        {currentPt.equipmentUsed?.includes(eq) && <CheckCircle2 size={12} />}
                      </div>
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Precautions */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b pb-2">Precauções Obrigatórias</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPt.mandatoryPrecautions?.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-700 pr-4">{p.label}</span>
                    <div className="flex gap-1 shrink-0">
                      {['S', 'NA'].map(s => (
                        <button 
                          key={s}
                          onClick={() => handlePrecautionChange(null, idx, s as any)}
                          className={cn(
                            "w-8 h-8 rounded-lg font-bold text-[10px] border transition-all",
                            p.status === s ? "bg-brand-blue border-brand-blue text-white" : "bg-white border-slate-200 text-slate-400"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EPIs */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b pb-2">Equipamento de Proteção Obrigatória (EPI)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
                {EPIS_LIST.map(epi => (
                  <button 
                    key={epi}
                    onClick={() => handleToggleList('epis', epi)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left text-[10px] transition-all",
                      currentPt.epis?.includes(epi) ? "bg-brand-blue/5 border-brand-blue text-brand-blue" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center", currentPt.epis?.includes(epi) ? "bg-brand-blue border-brand-blue text-white" : "border-slate-300")}>
                      {currentPt.epis?.includes(epi) && <CheckCircle2 size={12} />}
                    </div>
                    {epi}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSavePT}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Emitir Permissão
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pts.map((pt) => (
            <div key={pt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-blue transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{pt.id}</h4>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        "bg-brand-blue/10 text-brand-blue"
                      )}>
                        {pt.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1">{pt.location} - {pt.companyName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Emissão: {pt.date} {pt.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 transition-opacity">
                    <button 
                      onClick={() => handleEditPT(pt)}
                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeletePT(pt.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => generatePDF(pt)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <Download size={16} /> PDF
                  </button>
                  <button 
                    onClick={() => saveToDropbox(pt)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <Cloud size={16} /> Dropbox
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pts.length === 0 && (
            <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nenhuma PT emitida</h3>
              <p className="text-slate-500 text-sm max-w-xs">Clique no botão "Nova PT" para iniciar o processo de autorização de serviço.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PTModule;
