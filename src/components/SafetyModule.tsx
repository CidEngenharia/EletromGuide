import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileCheck, 
  Users, 
  ClipboardCheck, 
  Plus, 
  Search,
  Download,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SafetyModuleProps {
  initialTab?: string;
}

const SafetyModule = ({ initialTab = 'inspecoes' }: SafetyModuleProps) => {
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

  const tabs = [
    { id: 'inspecoes', label: 'Inspeções', icon: ClipboardCheck },
    { id: 'pgr', label: 'PGR / PCMAT', icon: ShieldAlert },
    { id: 'treinamentos', label: 'Treinamentos NR', icon: Users },
    { id: 'relatorios', label: 'Relatórios Mensais', icon: FileCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Segurança do Trabalho</h2>
          <p className="text-slate-500 text-sm">Gestão de conformidade, riscos e treinamentos.</p>
        </div>
        <button className="bg-violet-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-violet-700/20 hover:bg-violet-900 transition-all text-sm">
          <Plus size={16} />
          Nova Atividade
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeSubTab === tab.id 
                ? "bg-white text-violet-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeSubTab === 'inspecoes' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Histórico de Atividades</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-700/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Inspeção de Campo - NR-10', date: '15/05/2024', status: 'Conforme' },
                  { title: 'Checklist de Empilhadeira', date: '14/05/2024', status: 'Conforme' },
                  { title: 'Auditoria de EPI - Galpão 02', date: '12/05/2024', status: 'Atenção' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-violet-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        item.status === 'Conforme' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <ClipboardCheck size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500">Realizada em: {item.date} • Sidney Sales</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        item.status === 'Conforme' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {item.status}
                      </span>
                      <button className="p-2 text-slate-400 hover:text-violet-700 transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'treinamentos' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-900 mb-6">Matriz de Treinamentos NR</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sidney Sales', nrs: ['NR-10', 'NR-35'], status: 'Em Dia' },
                  { name: 'Marcos Oliveira', nrs: ['NR-10'], status: 'Vencendo' },
                  { name: 'Ana Costa', nrs: ['NR-06', 'NR-18'], status: 'Em Dia' },
                ].map((user, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <div className="flex gap-1 mt-1">
                          {user.nrs.map(nr => (
                            <span key={nr} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-bold">{nr}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded uppercase",
                      user.status === 'Em Dia' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'pgr' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-900 mb-6">Documentação PGR / PCMAT</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                  <ShieldAlert size={32} className="text-violet-200 mb-2" />
                  <p className="text-sm font-bold text-slate-900">PGR 2024</p>
                  <p className="text-xs text-slate-500 mb-4">Versão 2.1 • Atualizado em Março</p>
                  <button className="text-violet-700 text-xs font-black uppercase hover:underline">Visualizar PDF</button>
                </div>
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                  <Plus size={32} className="text-slate-200 mb-2" />
                  <p className="text-sm font-bold text-slate-400">Novo Documento</p>
                  <p className="text-xs text-slate-300 mb-4">Arraste ou clique para subir</p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'relatorios' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-900 mb-6">Relatórios Mensais de SST</h3>
              <div className="p-12 text-center">
                <FileCheck size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 text-sm">Selecione o período para gerar o fechamento mensal consolidado.</p>
                <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Gerar Relatório de Maio</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-violet-900 rounded-xl p-6 text-white shadow-xl shadow-violet-900/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-400" size={24} />
              <h3 className="font-bold">Alertas Críticos</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <p className="text-xs font-bold uppercase text-white/60 mb-1">Vencimento de Treinamento</p>
                <p className="text-sm font-medium">NR-35 (Trabalho em Altura) expira em 5 dias para 3 colaboradores.</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <p className="text-xs font-bold uppercase text-white/60 mb-1">Renovação PGR</p>
                <p className="text-sm font-medium">Atualização anual do Programa de Gerenciamento de Riscos pendente.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Estatísticas de Segurança</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Taxa de Conformidade</span>
                <span className="font-bold text-emerald-600">94%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[94%]" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Treinamentos em Dia</span>
                <span className="font-bold text-violet-700">88%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-700 h-full w-[88%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyModule;
