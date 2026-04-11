import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  Cloud, 
  Save,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Edit2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { APR, APRRisk } from '../types';
import { cn } from '../lib/utils';
import RichTextEditor from './RichTextEditor';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const APRModule = () => {
  const [aprs, setAprs] = useState<APR[]>([
    {
      id: 'APR-001',
      object: 'Manutenção do gasoduto instalado sob a Ponte de Igapó',
      observation: 'Instalação de estrutura para permitir acesso ao duto; Trabalho em alturas.',
      referenceDocs: 'NR-18 / NR-35',
      team: 'Thiago Fernandes; Aluisio Azevedo; Raphael Holanda.',
      areaGestora: 'O&M',
      approvalDate: '2024-04-30',
      status: 'APROVADA',
      risks: [
        {
          id: '1',
          hazard: 'Queda em altura',
          cause: 'Serviço realizado em altura',
          consequence: 'Escoriações; Trauma',
          frequency: 'IV',
          severity: 'B',
          riskLevel: 'M',
          mitigation: 'Todos os trabalhadores devem ser capacitados para o trabalho em altura; Realizar DDS antes do início da jornada; Emissão de PT pelo profissional de segurança; Uso de plataformas de trabalho apoiadas na estrutura da ponte; Uso de cinto de segurança tipo paraquedista dotado de dispositivo trava quedas, fixados nos suporte da tubulação.',
          responsible: 'Empresa Contratada'
        }
      ]
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentApr, setCurrentApr] = useState<Partial<APR>>({
    risks: []
  });

  const handleAddRisk = () => {
    const newRisk: APRRisk = {
      id: Math.random().toString(36).substr(2, 9),
      hazard: '',
      cause: '',
      consequence: '',
      frequency: '',
      severity: '',
      riskLevel: '',
      mitigation: '',
      responsible: ''
    };
    setCurrentApr({
      ...currentApr,
      risks: [...(currentApr.risks || []), newRisk]
    });
  };

  const handleRemoveRisk = (id: string) => {
    setCurrentApr({
      ...currentApr,
      risks: currentApr.risks?.filter(r => r.id !== id)
    });
  };

  const handleRiskChange = (id: string, field: keyof APRRisk, value: string) => {
    setCurrentApr({
      ...currentApr,
      risks: currentApr.risks?.map(r => r.id === id ? { ...r, [field]: value } : r)
    });
  };

  const handleSaveAPR = () => {
    if (!currentApr.object) return;
    
    if (currentApr.id && aprs.some(a => a.id === currentApr.id)) {
      setAprs(aprs.map(a => a.id === currentApr.id ? currentApr as APR : a));
    } else {
      const newApr: APR = {
        ...currentApr as APR,
        id: `APR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'PENDENTE',
        approvalDate: new Date().toISOString().split('T')[0]
      };
      setAprs([newApr, ...aprs]);
    }
    
    setIsFormOpen(false);
    setCurrentApr({ risks: [] });
  };

  const handleEditAPR = (apr: APR) => {
    setCurrentApr(apr);
    setIsFormOpen(true);
  };

  const handleDeleteAPR = (id: string) => {
    setAprs(aprs.filter(a => a.id !== id));
  };

  const generatePDF = (apr: APR) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    const stripHtml = (html: string) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    // Header
    doc.setFontSize(16);
    doc.text('ANEXO D - Análise Preliminar de Riscos - APR', 148, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.rect(10, 25, 277, 35); // Main header box
    
    doc.text(`Objeto de análise/ local: ${apr.object}`, 15, 32);
    doc.text(`Observação: ${apr.observation}`, 15, 40);
    doc.text(`Documentos de Referência: ${apr.referenceDocs}`, 15, 48);
    doc.text(`Equipe de APR: ${apr.team}`, 15, 56);
    
    doc.text(`Área Gestora: ${apr.areaGestora}`, 240, 32);
    doc.text(`Data da Aprovação: ${apr.approvalDate}`, 240, 40);

    // Table
    const tableData = apr.risks.map(r => [
      r.hazard,
      r.cause,
      r.consequence,
      r.frequency,
      r.severity,
      r.riskLevel,
      stripHtml(r.mitigation),
      r.responsible
    ]);

    doc.autoTable({
      startY: 65,
      head: [['Aspectos e Perigos', 'Causas', 'Impacto/Consequências', 'Freq.', 'Sev.', 'Risco', 'Ações Preventivas', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#1e293b', textColor: 255, fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 2 },
      columnStyles: {
        6: { cellWidth: 80 } // Mitigation column wider
      }
    });

    doc.save(`${apr.id}_APR.pdf`);
  };

  const RiskMatrix = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
      <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Matriz de Tolerabilidade de Riscos</h4>
      <table className="min-w-full text-[10px] border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 p-2" rowSpan={2}>SEVERIDADE</th>
            <th className="border border-slate-300 p-2" colSpan={5}>CATEGORIA DE FREQUÊNCIA</th>
          </tr>
          <tr className="bg-slate-50">
            <th className="border border-slate-300 p-1">A (Remota)</th>
            <th className="border border-slate-300 p-1">B (Remota)</th>
            <th className="border border-slate-300 p-1">C (Pouco Prov.)</th>
            <th className="border border-slate-300 p-1">D (Provável)</th>
            <th className="border border-slate-300 p-1">E (Frequente)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">IV (Catastrófica)</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-red-500 text-white text-center font-bold">NT</td>
            <td className="border border-slate-300 p-2 bg-red-500 text-white text-center font-bold">NT</td>
            <td className="border border-slate-300 p-2 bg-red-500 text-white text-center font-bold">NT</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">III (Crítica)</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-red-500 text-white text-center font-bold">NT</td>
            <td className="border border-slate-300 p-2 bg-red-500 text-white text-center font-bold">NT</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">II (Marginal)</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">I (Desprezível)</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-emerald-500 text-white text-center font-bold">T</td>
            <td className="border border-slate-300 p-2 bg-yellow-400 text-center font-bold">M</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[8px] font-bold uppercase">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500" /> Tolerável (T)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400" /> Moderado (M)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500" /> Não Tolerável (NT)</div>
      </div>
    </div>
  );

  const saveToDropbox = (apr: APR) => {
    // Mock functionality
    alert(`Simulando upload para Dropbox: ${apr.id}_APR.pdf\n\nEm um ambiente real, usaríamos a Dropbox API com um Access Token.`);
    window.open('https://www.dropbox.com/home', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Análise Preliminar de Riscos (APR)</h2>
          <p className="text-slate-500 text-sm">Gerenciamento e emissão de documentos de segurança.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nova APR
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">Cadastro de Nova APR</h3>
            <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Objeto de Análise / Local</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Ex: Manutenção de gasoduto..."
                  value={currentApr.object || ''}
                  onChange={e => setCurrentApr({...currentApr, object: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Área Gestora</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Ex: O&M"
                  value={currentApr.areaGestora || ''}
                  onChange={e => setCurrentApr({...currentApr, areaGestora: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Observação (Atividades / Equipamentos)</label>
                <textarea 
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                  placeholder="Descreva as atividades envolvidas..."
                  value={currentApr.observation || ''}
                  onChange={e => setCurrentApr({...currentApr, observation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Documentos de Referência</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Ex: NR-18 / NR-35"
                  value={currentApr.referenceDocs || ''}
                  onChange={e => setCurrentApr({...currentApr, referenceDocs: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Equipe de APR</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Nomes da equipe..."
                  value={currentApr.team || ''}
                  onChange={e => setCurrentApr({...currentApr, team: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900">Análise de Riscos</h4>
                    <button 
                      onClick={handleAddRisk}
                      className="text-brand-blue text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={16} /> Adicionar Perigo
                    </button>
                  </div>

                  <div className="space-y-6">
                    {currentApr.risks?.map((risk, idx) => (
                      <div key={risk.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative">
                        <button 
                          onClick={() => handleRemoveRisk(risk.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Aspectos e Perigos</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.hazard}
                              onChange={e => handleRiskChange(risk.id, 'hazard', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Causas</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.cause}
                              onChange={e => handleRiskChange(risk.id, 'cause', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Impacto / Consequências</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.consequence}
                              onChange={e => handleRiskChange(risk.id, 'consequence', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Freq.</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.frequency}
                              onChange={e => handleRiskChange(risk.id, 'frequency', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Sev.</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.severity}
                              onChange={e => handleRiskChange(risk.id, 'severity', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Nível Risco</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.riskLevel}
                              onChange={e => handleRiskChange(risk.id, 'riskLevel', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Ações Preventivas / Mitigadoras</label>
                            <RichTextEditor 
                              value={risk.mitigation}
                              onChange={content => handleRiskChange(risk.id, 'mitigation', content)}
                              placeholder="Descreva as ações..."
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Responsável</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                              value={risk.responsible}
                              onChange={e => handleRiskChange(risk.id, 'responsible', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-80 shrink-0">
                  <RiskMatrix />
                </div>
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
                onClick={handleSaveAPR}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Salvar APR
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {aprs.map((apr) => (
            <div key={apr.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-blue transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{apr.id}</h4>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        apr.status === 'APROVADA' ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                      )}>
                        {apr.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1">{apr.object}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aprovação: {apr.approvalDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 transition-opacity">
                    <button 
                      onClick={() => handleEditAPR(apr)}
                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAPR(apr.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => generatePDF(apr)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <Download size={16} /> PDF
                  </button>
                  <button 
                    onClick={() => saveToDropbox(apr)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <Cloud size={16} /> Dropbox
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default APRModule;
