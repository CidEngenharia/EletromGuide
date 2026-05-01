import React, { useState } from 'react';
import { 
  ThermometerSnowflake, 
  Wind, 
  Droplets, 
  Settings2, 
  Plus, 
  Calculator,
  Download,
  Gauge
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RefrigerationModuleProps {
  initialTab?: string;
}

const RefrigerationModule = ({ initialTab = 'carga' }: RefrigerationModuleProps) => {
  const [activeSubTab, setActiveSubTab] = useState(initialTab);
  
  // Estados para o cálculo de carga térmica
  const [formData, setFormData] = useState({
    area: '',
    pessoas: '',
    eletronicos: '',
    sol: 'nao'
  });
  const [resultado, setResultado] = useState<number | null>(null);

  const tabs = [
    { id: 'carga', label: 'Carga Térmica', icon: ThermometerSnowflake },
    { id: 'diagnostico', label: 'Diagnóstico de Ciclo', icon: Gauge },
    { id: 'pmoc', label: 'PMOC / Manutenção', icon: Settings2 },
    { id: 'fluidos', label: 'Fluidos e Gases', icon: Droplets },
  ];

  const calcularCarga = () => {
    const areaVal = parseFloat(formData.area) || 0;
    const pessoasVal = (parseInt(formData.pessoas) || 0) - 1; // Primeira pessoa não conta os 600 extras
    const eletronicosVal = parseInt(formData.eletronicos) || 0;
    
    // Cálculo base: 600 BTU por m²
    let totalBTU = areaVal * 600;
    
    // Adicional por pessoa (600 BTU cada, exceto a primeira)
    if (pessoasVal > 0) totalBTU += pessoasVal * 600;
    
    // Adicional por eletrônico (600 BTU cada)
    totalBTU += eletronicosVal * 600;
    
    // Adicional por sol (800 BTU por m² ao invés de 600 se tiver sol direto)
    if (formData.sol === 'sim') {
      totalBTU = (areaVal * 800) + (pessoasVal > 0 ? pessoasVal * 800 : 0) + (eletronicosVal * 800);
    }

    setResultado(totalBTU);
  };

  const limparCalculo = () => {
    setFormData({ area: '', pessoas: '', eletronicos: '', sol: 'nao' });
    setResultado(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Refrigeração e Climatização</h2>
          <p className="text-slate-500 text-sm">Cálculos técnicos, PMOC e diagnósticos de sistemas.</p>
        </div>
        <button className="bg-violet-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-violet-700/20 hover:bg-violet-900 transition-all text-sm">
          <Plus size={16} />
          Novo Chamado
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
        <div className="lg:col-span-2">
          {activeSubTab === 'carga' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Cálculo de Carga Térmica Estimada</h3>
                  <p className="text-xs text-slate-500">Determine a capacidade ideal (BTUs) para o ambiente.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Área do Ambiente (m²)</label>
                  <input 
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="Ex: 20"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Nº de Pessoas</label>
                  <input 
                    type="number"
                    value={formData.pessoas}
                    onChange={(e) => setFormData({...formData, pessoas: e.target.value})}
                    placeholder="Ex: 2"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Nº de Aparelhos Eletrônicos</label>
                  <input 
                    type="number"
                    value={formData.eletronicos}
                    onChange={(e) => setFormData({...formData, eletronicos: e.target.value})}
                    placeholder="Ex: 1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Incidência Solar Direta?</label>
                  <select 
                    value={formData.sol}
                    onChange={(e) => setFormData({...formData, sol: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 outline-none transition-all font-medium"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim (Manhã ou Tarde)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={calcularCarga}
                  className="flex-1 bg-violet-800 text-white py-4 rounded-xl font-bold hover:bg-violet-900 transition-all shadow-lg shadow-violet-800/10"
                >
                  Calcular BTUs
                </button>
                <button 
                  onClick={limparCalculo}
                  className="px-6 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Novo Cálculo
                </button>
              </div>

              {resultado !== null && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 animate-in slide-in-from-top-4 duration-500">
                  <p className="text-emerald-700 text-sm font-bold mb-1">Resultado Estimado:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-800">{resultado.toLocaleString()}</span>
                    <span className="text-xl font-bold text-emerald-600">BTU/h</span>
                  </div>
                  <p className="text-emerald-600/70 text-xs mt-2 italic">
                    *Sugestão de equipamento: {resultado <= 9000 ? '9.000 BTU' : resultado <= 12000 ? '12.000 BTU' : resultado <= 18000 ? '18.000 BTU' : '24.000+ BTU'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'diagnostico' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Ferramentas de Diagnóstico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Gauge className="text-violet-700 mb-2" size={20} />
                  <p className="text-sm font-bold">Relação Pressão x Temperatura</p>
                  <p className="text-xs text-slate-500">Superaquecimento e Sub-resfriamento.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Wind className="text-violet-700 mb-2" size={20} />
                  <p className="text-sm font-bold">Teste de Estanqueidade</p>
                  <p className="text-xs text-slate-500">Registro de queda de pressão (N2).</p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'pmoc' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Gestão de PMOC</h3>
              <div className="space-y-3">
                {[
                  { tag: 'AC-001', local: 'Sala Reunião', prox: '20/06/2024' },
                  { tag: 'AC-002', local: 'TI Servidores', prox: '15/06/2024' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.tag} - {item.local}</p>
                      <p className="text-xs text-slate-500">Próxima Manutenção: {item.prox}</p>
                    </div>
                    <button className="text-violet-700 text-xs font-black uppercase">Abrir Checklist</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'fluidos' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Calculadora de Fluido Refrigerante</h3>
              <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Droplets size={32} className="mx-auto text-violet-300 mb-2" />
                <p className="text-slate-500 text-sm">Selecione o fluido para calcular o peso por metro de tubulação adicional.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-4">Manual Técnico</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Tabela de Erros Split</p>
                  <p className="text-[10px] text-white/40 italic text-slate-400">PDF • 1.2 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Manual de Instalação Inverter</p>
                  <p className="text-[10px] text-white/40 italic text-slate-400">PDF • 4.5 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefrigerationModule;
