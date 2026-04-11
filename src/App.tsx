import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Users, 
  BarChart3, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Menu, 
  X,
  LogOut,
  Search,
  Filter,
  Download,
  HardHat,
  Zap,
  ArrowUp,
  Flame,
  Box,
  Construction,
  Truck,
  Eye,
  BookOpen,
  Linkedin,
  Youtube,
  Instagram,
  MessageCircle,
  Twitter,
  TrendingUp,
  Activity,
  Target,
  AlertCircle,
  Cpu,
  CircuitBoard,
  Calculator,
  Settings,
  FileCode,
  Library,
  Save,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie
} from 'recharts';
import { cn } from './lib/utils';
import APRModule from './components/APRModule';
import PTModule from './components/PTModule';
import NotesModule from './components/NotesModule';
import RichTextEditor from './components/RichTextEditor';
import { 
  User, 
  UserRole, 
  PT, 
  APR, 
  APRRisk,
  LOTO, 
  EPI, 
  ServiceType, 
  ChecklistItem 
} from './types';
import { SERVICE_CONFIG, NR_HANDBOOK, ALL_NRS_LIST } from './constants';

// --- Mock Data ---
const MOCK_USER: User = {
  id: '1',
  name: 'Sidney Sales',
  email: 'sidney.sales@gmail.com',
  role: 'TECNICO',
  companyId: 'comp-1'
};

const MOCK_PTS: any[] = []; // Clear old mocks as interface changed

const MOCK_EPIS: EPI[] = [
  { id: '1', name: 'Capacete de Segurança', ca: '12345', deliveryDate: '2023-01-10', expiryDate: '2024-01-10', employeeName: 'João Silva', status: 'VENCIDO' },
  { id: '2', name: 'Cinto de Segurança', ca: '54321', deliveryDate: '2023-06-15', expiryDate: '2024-06-15', employeeName: 'Maria Oliveira', status: 'VALIDO' },
  { id: '3', name: 'Luva Dielétrica', ca: '98765', deliveryDate: '2023-11-20', expiryDate: '2024-03-15', employeeName: 'Carlos Souza', status: 'ALERTA' }
];

const MOCK_LOTO: LOTO[] = [
  {
    id: 'L-001',
    equipment: 'Motor Bomba 05',
    energyType: 'Elétrica',
    lockNumber: 'CAD-44',
    responsibleId: '1',
    status: 'BLOQUEADO',
    steps: [
      { label: 'Desligamento', completed: true },
      { label: 'Isolamento', completed: true },
      { label: 'Bloqueio', completed: true },
      { label: 'Dissipação', completed: true },
      { label: 'Teste de Ausência', completed: true }
    ]
  }
];

const COMPLIANCE_DATA = [
  { name: 'NR-10', compliance: 85, nonCompliance: 15 },
  { name: 'NR-35', compliance: 92, nonCompliance: 8 },
  { name: 'NR-33', compliance: 78, nonCompliance: 22 },
  { name: 'NR-18', compliance: 88, nonCompliance: 12 },
  { name: 'NR-12', compliance: 75, nonCompliance: 25 },
  { name: 'NR-20', compliance: 82, nonCompliance: 18 },
];

const PT_CREATION_DATA = [
  { month: '09-2025', count: 250 },
  { month: '10-2025', count: 1100 },
  { month: '11-2025', count: 550 },
  { month: '12-2025', count: 600 },
  { month: '01-2026', count: 1600 },
  { month: '02-2026', count: 1650 },
  { month: '03-2026', count: 1500 },
];

const ACCIDENT_RATE_DATA = [
  { month: '09-2025', rate: 50 },
  { month: '10-2025', rate: 720 },
  { month: '11-2025', rate: 380 },
  { month: '12-2025', rate: 420 },
  { month: '01-2026', rate: 530 },
  { month: '02-2026', rate: 550 },
  { month: '03-2026', rate: 620 },
];

const TOP_RISKS_DATA = [
  { name: 'Queda de Altura', value: 7.2, color: '#10B981' },
  { name: 'Choque Elétrico', value: 4.8, color: '#EF4444' },
  { name: 'Espaço Confinado', value: 3.8, color: '#F59E0B' },
  { name: 'Incêndio/Explosão', value: 3.2, color: '#64748b' },
  { name: 'Soterramento', value: 2.8, color: '#94a3b8' },
];

const COLORS = ['#1E40AF', '#10B981', '#F59E0B', '#EF4444'];

// --- Components ---

const BrandLogo = ({ size = 24, className = "", iconClassName = "text-white" }: { size?: number, className?: string, iconClassName?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <Settings size={size} className={cn("animate-[spin_20s_linear_infinite]", iconClassName)} />
    <Zap size={size * 0.5} className={cn("absolute fill-current", iconClassName)} />
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, isMobile, setIsOpen }: { activeTab: string, setActiveTab: (t: string) => void, isMobile?: boolean, setIsOpen?: (b: boolean) => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['eletrotecnica', 'eletrotecnica-relatorios']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const menuItems: any[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'eletrotecnica', 
      label: 'Eletrotécnica', 
      icon: Zap,
      subItems: [
        {
          id: 'eletrotecnica-relatorios',
          label: 'Relatórios',
          icon: BarChart3,
          subItems: [
            { id: 'pt', label: 'Permissões (PT)', icon: FileText },
            { id: 'apr', label: 'Análises (APR)', icon: ShieldCheck },
            { id: 'loto', label: 'Sistema LOTO', icon: Lock },
          ]
        },
        { id: 'eletrotecnica-componentes', label: 'Componentes', icon: CircuitBoard },
        { id: 'epi', label: 'Controle de EPI', icon: HardHat },
        { id: 'eletrotecnica-calculadoras', label: 'Calculadoras', icon: Calculator },
        { id: 'esquemas-eletricos', label: 'Esquemas Elétricos', icon: FileCode },
        { id: 'eletrotecnica-padroes', label: 'Padrões', icon: Library },
      ]
    },
    {
      id: 'eletronica',
      label: 'Eletrônica',
      icon: Cpu,
      subItems: [
        { id: 'eletronica-componentes', label: 'Componentes', icon: CircuitBoard },
        { id: 'eletronica-calculadoras', label: 'Calculadoras', icon: Calculator },
        { id: 'eletronica-esquemas', label: 'Esquema Elétrico', icon: FileCode },
        { id: 'eletronica-padroes', label: 'Padrões', icon: Library },
      ]
    },
    {
      id: 'eletromecanica',
      label: 'Eletromecânica',
      icon: Settings,
      subItems: [
        { id: 'eletromecanica-componentes', label: 'Componentes', icon: CircuitBoard },
        { id: 'eletromecanica-calculadoras', label: 'Calculadoras', icon: Calculator },
        { id: 'eletromecanica-relatorios', label: 'Relatórios', icon: BarChart3 },
        { id: 'eletromecanica-esquemas', label: 'Esquema Elétrico', icon: FileCode },
        { id: 'eletromecanica-padroes', label: 'Padrões', icon: Library },
      ]
    },
    { id: 'nrs', label: 'Cartilha NRs', icon: BookOpen },
    { id: 'auditoria', label: 'Auditoria', icon: Eye },
  ];

  const renderMenuItem = (item: any, depth = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeTab === item.id;

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.id);
            } else {
              setActiveTab(item.id);
              if (setIsOpen) setIsOpen(false);
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200",
            isActive 
              ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
              : "text-slate-400 hover:bg-white/5 hover:text-white",
            depth > 0 && "ml-4 py-1.5"
          )}
        >
          <item.icon size={18 - depth * 2} className="shrink-0" />
          <span className={cn(
            "flex-1 text-left truncate font-light", // font-light for "fontes mais finas"
            depth === 0 ? "text-sm" : "text-xs"
          )}>
            {item.label}
          </span>
          {hasSubItems && (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </button>
        
        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems.map((subItem: any) => renderMenuItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-brand-dark/95 backdrop-blur-xl text-white border-r border-white/5",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
          <BrandLogo size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">EletromGuide</h1>
          <p className="text-xs text-slate-400">"Tecnical Services"</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      <div className={cn(
        "p-4 border-t border-white/10 space-y-4",
        isMobile && "pb-32"
      )}>
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              SS
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green rounded-full border-2 border-brand-dark">
              <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-75" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase font-light leading-tight">Você está logado como:</p>
            <p className="text-sm font-light truncate">{MOCK_USER.name}</p>
            <p className="text-xs text-slate-500 truncate font-light">{MOCK_USER.role}</p>
          </div>
          <button className="text-slate-500 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>

        <div className="px-4 pt-2 border-t border-white/5" />
      </div>
    </div>
  );
};

const GaugeChart = ({ value, max, label, subLabel }: { value: number, max: number, label?: string, subLabel?: string }) => {
  const data = [
    { value: value, fill: '#F59E0B' },
    { value: max - value, fill: '#e2e8f0' }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#F59E0B" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
        <p className="text-3xl font-bold text-slate-900 leading-none">{value.toLocaleString()}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{subLabel}</p>
      </div>
      <div className="flex justify-between w-full px-8 -mt-4">
        <span className="text-[10px] font-bold text-slate-400">0</span>
        <span className="text-[10px] font-bold text-slate-400">{max}</span>
      </div>
    </div>
  );
};

const BulletChart = ({ value, target, label }: { value: number, target: number, label: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <p className="text-xs font-bold text-slate-600">{label}</p>
      <p className="text-xs font-bold text-slate-900">{value}%</p>
    </div>
    <div className="h-6 w-full bg-slate-100 rounded-sm relative overflow-hidden">
      <div 
        className="h-full bg-slate-500/30 absolute left-0 top-0" 
        style={{ width: `${target}%` }} 
      />
      <div 
        className="h-2 bg-brand-orange absolute left-0 top-1/2 -translate-y-1/2" 
        style={{ width: `${value}%` }} 
      />
      <div 
        className="h-4 w-0.5 bg-slate-900 absolute top-1/2 -translate-y-1/2" 
        style={{ left: `${target}%` }} 
      />
    </div>
    <div className="flex justify-between text-[8px] font-bold text-slate-400">
      <span>0</span>
      <span>25</span>
      <span>50</span>
      <span>75</span>
      <span>100</span>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="text-white" size={24} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-brand-green bg-brand-green/10 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = ({ 
  onNewActivity, 
  activities = [], 
  onEditActivity, 
  onDeleteActivity 
}: { 
  onNewActivity: () => void,
  activities?: PT[],
  onEditActivity?: (activity: PT) => void,
  onDeleteActivity?: (id: string) => void
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Painel Gerencial</h2>
          <p className="text-slate-500">Visão detalhada da conformidade e indicadores de segurança.</p>
        </div>
        <button 
          onClick={onNewActivity}
          className="bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nova Atividade
        </button>
      </div>

      {/* Main Grid Layout inspired by reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Gauges & Bullet */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Taxa de Conformidade vs Meta</h3>
            <BulletChart label="Conformidade Geral" value={82} target={90} />
            
            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">PTs Abertas vs Ano Anterior</h3>
                <GaugeChart value={5.321} max={6} subLabel="Média Diária" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Inspeções vs Ano Anterior</h3>
                <GaugeChart value={1.329} max={6} subLabel="Média Semanal" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-slate-400" /> Ano Anterior
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-slate-200" /> Meta de Crescimento
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-brand-orange" /> Resultado Atual
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Bar & Line Charts */}
        <div className="lg:col-span-6 space-y-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">PTs Emitidas</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Período de Emissão</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PT_CREATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[2, 2, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Incidentes Evitados</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Período de Fechamento</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACCIDENT_RATE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Ratios & Top Risks */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ratios Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4">
              <h3 className="text-sm font-bold text-white">Relação de Segurança</h3>
            </div>
            <div className="p-6 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-emerald-500 rotate-45 flex items-center justify-center shrink-0">
                  <div className="-rotate-45 text-white"><Target size={20} /></div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">0.9 : 1</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Meta de Inspeção: 1.00 ou superior</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-red-500 shrink-0" />
                <div>
                  <p className="text-3xl font-bold text-slate-900">2.5 : 1</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Risco Crítico: 3.0 ou inferior</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Principais Riscos (Frequência)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_RISKS_DATA} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={100} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                    {TOP_RISKS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Compliance Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-brand-blue" />
          Conformidade Detalhada por Norma (NR)
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPLIANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'compliance' ? 'Conformidade' : 'Não Conformidade'
                ]}
              />
              <Bar dataKey="compliance" fill="#10B981" radius={[4, 4, 0, 0]} barSize={15} />
              <Bar dataKey="nonCompliance" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity size={20} className="text-brand-blue" />
            Atividades Recentes e Relatórios
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">ID / Empresa</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Local / Equipamento</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900">{activity.id}</p>
                    <p className="text-xs text-slate-500">{activity.companyName || 'Empresa não informada'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 font-medium">{activity.location}</p>
                    <p className="text-xs text-slate-400">{activity.equipmentInvolved}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      activity.status === 'ABERTA' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEditActivity?.(activity)}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all"
                        title="Editar Atividade"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteActivity?.(activity.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir Atividade"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-400 italic text-sm">
                    Nenhuma atividade registrada recentemente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewActivityWizard = ({ 
  onCancel, 
  onComplete,
  initialData
}: { 
  onCancel: () => void, 
  onComplete: (pt: Partial<PT>) => void,
  initialData?: PT
}) => {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [formData, setFormData] = useState<Partial<PT>>(initialData || {
    serviceType: undefined,
    location: '',
    equipmentInvolved: '',
    companyName: '',
    description: '',
    team: [],
    checklist: []
  });

  const serviceTypes: { id: ServiceType, label: string, icon: any, color: string }[] = [
    { id: 'ELETRICO', label: 'Serviço Elétrico', icon: Zap, color: 'bg-yellow-500' },
    { id: 'ALTURA', label: 'Trabalho em Altura', icon: ArrowUp, color: 'bg-blue-500' },
    { id: 'QUENTE', label: 'Trabalho a Quente', icon: Flame, color: 'bg-orange-500' },
    { id: 'CONFINADO', label: 'Espaço Confinado', icon: Box, color: 'bg-slate-600' },
    { id: 'ESCAVACAO', label: 'Escavação', icon: Construction, color: 'bg-amber-700' },
    { id: 'ICAMENTO', label: 'Içamento de Carga', icon: Truck, color: 'bg-indigo-500' },
  ];

  const handleSelectService = (type: ServiceType) => {
    const config = SERVICE_CONFIG[type];
    setFormData({
      ...formData,
      serviceType: type,
      checklist: config.checklist.map((item, idx) => ({
        ...item,
        id: `c-${idx}`,
        checked: false
      })) as ChecklistItem[]
    });
    setStep(2);
  };

  const handleCheck = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist?.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    });
  };

  const isChecklistValid = useMemo(() => {
    return formData.checklist?.every(item => !item.isCritical || item.checked);
  }, [formData.checklist]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-brand-dark p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Nova Atividade de Risco</h2>
            <p className="text-slate-400 text-sm">Passo {step} de 3</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-brand-blue" : "bg-slate-700"
            )} />
          ))}
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Selecione o Tipo de Serviço</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectService(type.id)}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 hover:border-brand-blue hover:bg-blue-50 transition-all group"
                >
                  <div className={cn("p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110", type.color)}>
                    <type.icon size={32} />
                  </div>
                  <span className="font-bold text-slate-700 text-center">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Informações da Atividade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
                <input 
                  type="text" 
                  placeholder="Ex: Petrobras / Vale"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Local da Atividade</label>
                <input 
                  type="text" 
                  placeholder="Ex: Galpão de Pintura"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Equipamento Envolvido</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ponte Rolante 02"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                  value={formData.equipmentInvolved}
                  onChange={e => setFormData({...formData, equipmentInvolved: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Descrição do Serviço</label>
                <RichTextEditor 
                  value={formData.description}
                  onChange={content => setFormData({...formData, description: content})}
                  placeholder="Descreva detalhadamente o que será executado..."
                />
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                Voltar
              </button>
              <button 
                disabled={!formData.location || !formData.description || !formData.companyName}
                onClick={() => setStep(3)} 
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Próximo: Checklist
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Checklist de Segurança (PT)</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-brand-green" />
                Baseado na {SERVICE_CONFIG[formData.serviceType!].nrs.join(', ')}
              </div>
            </div>

            <div className="space-y-3">
              {formData.checklist?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCheck(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                    item.checked 
                      ? "bg-brand-green/5 border-brand-green/30 text-slate-900" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    item.checked ? "bg-brand-green border-brand-green text-white" : "border-slate-300"
                  )}>
                    {item.checked && <CheckCircle2 size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    {item.isCritical && (
                      <span className="text-[10px] font-bold text-brand-red uppercase tracking-tighter">Item Crítico Obrigatório</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!isChecklistValid && (
              <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl flex items-center gap-3 text-brand-red">
                <AlertTriangle size={20} />
                <p className="text-sm font-bold">Atenção: Itens críticos não conformes impedem a liberação da atividade.</p>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                Voltar
              </button>
              <button 
                disabled={!isChecklistValid}
                onClick={() => onComplete(formData)}
                className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-green/20 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Gerar PT e APR Digital
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PTList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Permissões de Trabalho (PT)</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar PT..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none text-sm"
            />
          </div>
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50">
            <Filter size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID / Atividade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Local</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Início</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PTS.map((pt) => (
              <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{pt.id}</p>
                  <p className="text-xs text-slate-500">{SERVICE_CONFIG[pt.serviceType].label}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{pt.location}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    pt.status === 'EM_ANDAMENTO' ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                  )}>
                    {pt.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(pt.startTime).toLocaleDateString('pt-BR')} {new Date(pt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LOTOSystem = () => {
  const [lotos, setLotos] = useState<LOTO[]>(MOCK_LOTO);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoto, setEditingLoto] = useState<LOTO | null>(null);
  const [formData, setFormData] = useState<Partial<LOTO>>({
    equipment: '',
    energyType: 'Elétrica',
    lockNumber: '',
    status: 'BLOQUEADO',
    steps: [
      { label: 'Desligamento', completed: false },
      { label: 'Isolamento', completed: false },
      { label: 'Bloqueio', completed: false },
      { label: 'Dissipação', completed: false },
      { label: 'Teste de Ausência', completed: false }
    ]
  });

  const handleSave = () => {
    if (!formData.equipment || !formData.lockNumber) return;

    if (editingLoto) {
      setLotos(lotos.map(l => l.id === editingLoto.id ? { ...l, ...formData } as LOTO : l));
    } else {
      const newLoto: LOTO = {
        ...formData as LOTO,
        id: `L-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        responsibleId: '1'
      };
      setLotos([newLoto, ...lotos]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      equipment: '',
      energyType: 'Elétrica',
      lockNumber: '',
      status: 'BLOQUEADO',
      steps: [
        { label: 'Desligamento', completed: false },
        { label: 'Isolamento', completed: false },
        { label: 'Bloqueio', completed: false },
        { label: 'Dissipação', completed: false },
        { label: 'Teste de Ausência', completed: false }
      ]
    });
    setEditingLoto(null);
    setIsFormOpen(false);
  };

  const handleEdit = (loto: LOTO) => {
    setEditingLoto(loto);
    setFormData(loto);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setLotos(lotos.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Sistema LOTO (Lockout/Tagout)</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-red/20 hover:bg-red-600 transition-all"
        >
          <Lock size={20} />
          Novo Bloqueio
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">{editingLoto ? 'Editar Bloqueio' : 'Novo Bloqueio LOTO'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Equipamento</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                value={formData.equipment}
                onChange={e => setFormData({...formData, equipment: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Energia</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                value={formData.energyType}
                onChange={e => setFormData({...formData, energyType: e.target.value})}
              >
                <option value="Elétrica">Elétrica</option>
                <option value="Mecânica">Mecânica</option>
                <option value="Hidráulica">Hidráulica</option>
                <option value="Pneumática">Pneumática</option>
                <option value="Química">Química</option>
                <option value="Térmica">Térmica</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Número do Cadeado</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                value={formData.lockNumber}
                onChange={e => setFormData({...formData, lockNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Etapas de Bloqueio</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.steps?.map((step, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    const newSteps = [...(formData.steps || [])];
                    newSteps[idx].completed = !newSteps[idx].completed;
                    setFormData({...formData, steps: newSteps});
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                    step.completed ? "bg-brand-green/5 border-brand-green text-brand-green" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", step.completed ? "bg-brand-green border-brand-green text-white" : "border-slate-300")}>
                    {step.completed && <CheckCircle2 size={12} />}
                  </div>
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button onClick={resetForm} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button 
              onClick={handleSave}
              className="bg-brand-red text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-brand-red/20 hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              Salvar Bloqueio
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {lotos.map(loto => (
          <div key={loto.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-brand-red transition-all">
            <div className={cn(
              "p-6 flex justify-between items-center text-white",
              loto.status === 'BLOQUEADO' ? "bg-brand-red" : "bg-brand-green"
            )}>
              <div>
                <h3 className="text-xl font-bold">{loto.equipment}</h3>
                <p className="text-white/80 text-sm">Cadeado: {loto.lockNumber} • {loto.energyType}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm font-bold text-sm uppercase">
                  {loto.status}
                </div>
                <div className="flex gap-1 transition-opacity">
                  <button onClick={() => handleEdit(loto)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Editar">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(loto.id)} className="p-1.5 bg-white/20 hover:bg-red-500 rounded-lg transition-colors" title="Excluir">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-6">
                  {loto.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-center gap-4 pl-10">
                      <div className={cn(
                        "absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold z-10",
                        step.completed ? "bg-brand-green text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {step.completed ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <span className={cn(
                        "font-medium",
                        step.completed ? "text-slate-900" : "text-slate-400"
                      )}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users size={14} className="text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Responsável: {MOCK_USER.name}</span>
                </div>
                <button className="text-brand-blue font-bold text-sm hover:underline">
                  Detalhes do Bloqueio
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NRHandbook = () => {
  const [posts, setPosts] = useState(NR_HANDBOOK);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '', title: '', summary: '', details: '', link: ''
  });

  const resetForm = () => {
    setFormData({ code: '', title: '', summary: '', details: '', link: '' });
    setEditingPost(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.code) return;
    const newPost = {
      ...formData,
      details: formData.details.split('\n').map(d => d.trim()).filter(d => d !== '')
    };
    if (editingPost) {
      setPosts(posts.map(p => p.code === editingPost.code ? { ...editingPost, ...newPost } : p));
    } else {
      setPosts([{ ...newPost }, ...posts]);
    }
    resetForm();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Cartilha de NRs</h2>
          <p className="text-slate-500">Guia rápido das Normas Regulamentadoras aplicáveis.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
            <ShieldCheck size={18} />
            Conformidade Legal
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all text-sm shrink-0"
          >
            <Plus size={18} />
            Nova NR
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">{editingPost ? 'Editar NR' : 'Nova NR'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Código</label>
              <input type="text" placeholder="Ex: NR-10" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
              <input type="text" placeholder="Ex: Segurança em Instalações..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Resumo</label>
              <textarea placeholder="Resumo da norma..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" rows={2} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Principais Pontos (Um por linha)</label>
              <textarea placeholder="Ponto 1&#10;Ponto 2" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" rows={4} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Link Completo (Opcional)</label>
              <input type="text" placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={resetForm} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-brand-blue text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm">
              <Save size={18} /> Salvar NR
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((nr) => (
          <div key={nr.code} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative group hover:border-brand-blue transition-colors flex flex-col">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => { setEditingPost(nr); setFormData({ ...nr, details: nr.details.join('\n') }); setIsFormOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-brand-blue border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setPosts(posts.filter(p => p.code !== nr.code))} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg shadow-sm transition-all" title="Excluir">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6 pr-16">
              <div className="bg-brand-green-dark text-white px-4 py-1.5 rounded-lg font-mono text-lg font-bold">
                {nr.code}
              </div>
              <BookOpen size={24} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{nr.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
              {nr.summary}
            </p>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principais Pontos</p>
              <ul className="space-y-2">
                {nr.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green-dark mt-1.5 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            {nr.link && (
              <a 
                href={nr.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors text-center"
              >
                Ver Norma Completa (Gov.br)
              </a>
            )}
          </div>
        ))}
      </div>
      {posts.length === 0 && !isFormOpen && (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-500">
          <FileCode size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-bold text-slate-700">Nenhuma NR encontrada</p>
          <p className="text-sm mb-6">Crie um novo registro clicando no botão acima.</p>
        </div>
      )}

      <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Atualmente, conforme diretrizes estabelecidas pelo Ministério do Trabalho e Emprego (MTE), são 36 normas regulamentadoras vigentes:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
          {ALL_NRS_LIST.map((nr, idx) => (
            <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              {nr}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center space-y-4">
        <p className="text-slate-500 text-sm max-w-2xl">
          Para Detalhes das demais NRs. Consulte o portal oficial do Governo Federal para acessar todas as Normas Regulamentadoras vigentes e atualizadas.
        </p>
        <a 
          href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
        >
          <img 
            src="https://flagcdn.com/w40/br.png" 
            alt="Brasil" 
            className="w-6 h-auto rounded-sm shadow-sm"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
            Gov.br Normas Regulamentadoras
          </span>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

const INITIAL_SCHEMATICS = [
  {
    id: '1',
    title: '1. Esquema Unifilar',
    description: 'Representa todo o circuito com uma única linha por circuito. Não mostra todos os fios individualmente. Muito usado em projetos residenciais e industriais.',
    example: 'Quadro de distribuição com disjuntores.',
    advantage: 'Simples e rápido de entender.',
    disadvantage: 'Não mostra detalhes completos.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000'
  }
];

const ElectricalSchematics = () => {
  const [posts, setPosts] = useState(INITIAL_SCHEMATICS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', example: '', advantage: '', disadvantage: '', image: ''
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', example: '', advantage: '', disadvantage: '', image: '' });
    setEditingPost(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    if (!formData.title) return;
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...editingPost, ...formData } : p));
    } else {
      setPosts([...posts, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    resetForm();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Esquemas Elétricos</h2>
          <p className="text-slate-500">Representações gráficas de instalações e circuitos.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all text-sm shrink-0"
        >
          <Plus size={18} />
          Nova Postagem
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">{editingPost ? 'Editar Postagem' : 'Nova Postagem de Esquema'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
              <input type="text" placeholder="Ex: 2. Esquema Multifilar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
              <textarea placeholder="Descrição detalhada do esquema..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" rows={3} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Exemplo de Aplicação</label>
              <input type="text" placeholder="Ex: Acionamento de motor trifásico." value={formData.example} onChange={e => setFormData({...formData, example: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-600 uppercase">Vantagem Principal</label>
              <input type="text" placeholder="Ex: Maior clareza nos comandos." value={formData.advantage} onChange={e => setFormData({...formData, advantage: e.target.value})} className="w-full px-4 py-2 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-red-600 uppercase">Desvantagem Principal</label>
              <input type="text" placeholder="Ex: Mais complexo de desenhar." value={formData.disadvantage} onChange={e => setFormData({...formData, disadvantage: e.target.value})} className="w-full px-4 py-2 border border-red-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-red-50/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem (Opcional)</label>
              <input type="text" placeholder="Link da imagem representativa..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={resetForm} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-brand-blue text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm">
              <Save size={18} /> Salvar Postagem
            </button>
          </div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative group hover:border-brand-blue transition-colors">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button onClick={() => { setEditingPost(post); setFormData(post); setIsFormOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-brand-blue border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
              <Edit2 size={16} />
            </button>
            <button onClick={() => setPosts(posts.filter(p => p.id !== post.id))} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg shadow-sm transition-all" title="Excluir">
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="space-y-4 pr-16">
            <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {post.description}
            </p>
            {post.example && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700 mb-2">Exemplo:</p>
                <p className="text-sm text-slate-600">{post.example}</p>
              </div>
            )}
          </div>

          {(post.advantage || post.disadvantage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.advantage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-700 mb-1">Vantagem:</p>
                  <p className="text-sm text-emerald-600">{post.advantage}</p>
                </div>
              )}
              {post.disadvantage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                  <p className="text-sm font-bold text-red-700 mb-1">Desvantagem:</p>
                  <p className="text-sm text-red-600">{post.disadvantage}</p>
                </div>
              )}
            </div>
          )}

          {post.image && (
            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Exemplo Visual</p>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-white p-4">
                <img 
                  src={post.image}
                  alt={post.title} 
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {posts.length === 0 && !isFormOpen && (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-500">
          <FileCode size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-bold text-slate-700">Nenhuma postagem encontrada</p>
          <p className="text-sm mb-6">Crie um novo esquema elétrico clicando no botão acima.</p>
        </div>
      )}
    </div>
  );
};

const MobileNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
    <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-2 flex justify-center items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="relative -top-6">
        <button 
          onClick={() => setActiveTab('new')}
          className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-blue/30 border-4 border-white"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  </div>
);

const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'teste@eletromguide.com.br' && password === 'admin') {
      onLogin();
    } else {
      setError('Credenciais inválidas. Use teste@eletromguide.com.br / admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-slate-800 bg-slate-900/50">
            <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-blue/20">
              <BrandLogo size={36} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">EletromGuide</h1>
            <p className="text-slate-400 text-sm mt-1">Seu guia de Serviços Técnicos</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@eletromguide.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Senha</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-xs font-medium">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-2"
              >
                {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
                <ChevronRight size={18} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-brand-blue font-bold hover:underline"
                >
                  {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Acesso de Teste Local</p>
          <div className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-4 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-[10px] text-slate-400 font-mono">
            <span>E-mail: teste@eletromguide.com.br</span>
            <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full" />
            <span>Senha: admin</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activities, setActivities] = useState<PT[]>([]);
  const [editingActivity, setEditingActivity] = useState<PT | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSaveActivity = (data: Partial<PT>) => {
    if (editingActivity) {
      setActivities(activities.map(a => a.id === editingActivity.id ? { ...editingActivity, ...data } as PT : a));
    } else {
      const newActivity: PT = {
        ...data as PT,
        id: `PT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'ABERTA'
      };
      setActivities([newActivity, ...activities]);
    }
    setEditingActivity(null);
    setActiveTab('dashboard');
  };

  const handleEditActivity = (activity: PT) => {
    setEditingActivity(activity);
    setActiveTab('new');
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LandingPage onLogin={() => setIsAuthenticated(true)} />;
    }

    if (activeTab === 'new') {
      return (
        <NewActivityWizard 
          initialData={editingActivity || undefined}
          onCancel={() => {
            setEditingActivity(null);
            setActiveTab('dashboard');
          }} 
          onComplete={handleSaveActivity} 
        />
      );
    }

    const getContent = () => {
      switch (activeTab) {
        case 'dashboard': 
          return (
            <Dashboard 
              onNewActivity={() => {
                setEditingActivity(null);
                setActiveTab('new');
              }} 
              activities={activities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          );
        case 'pt': return <PTModule />;
        case 'apr': return <APRModule />;
        case 'loto': return <LOTOSystem />;
        case 'nrs': return <NRHandbook />;
        case 'esquemas-eletricos': return <ElectricalSchematics />;
        case 'eletronica-esquemas': return <ElectricalSchematics />;
        case 'eletromecanica-esquemas': return <ElectricalSchematics />;
        default: return null;
      }
    };

    const isTechnicalTab = 
      activeTab.startsWith('eletrotecnica') || 
      activeTab.startsWith('eletronica') || 
      activeTab.startsWith('eletromecanica') ||
      ['pt', 'apr', 'loto', 'epi', 'esquemas-eletricos'].includes(activeTab);

    return (
      <div className="space-y-8">
        {getContent()}
        {isTechnicalTab && <NotesModule sectionId={activeTab} />}
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen flex bg-slate-50", !isAuthenticated && "bg-slate-950")}>
      {!isAuthenticated ? (
        <div className="flex-1">{renderContent()}</div>
      ) : (
        <>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="sticky top-0 h-screen">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          )}

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobile && isSidebarOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 w-72 z-50"
                >
                  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile setIsOpen={setIsSidebarOpen} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <Menu size={20} />
                  </button>
                )}
                <div className="flex items-center gap-2 md:hidden">
                  <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                    <BrandLogo size={18} />
                  </div>
                  <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">EletromGuide</h1>
                </div>
                {!isMobile && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                      <BrandLogo size={18} iconClassName="text-brand-blue" />
                      <span className="uppercase font-bold text-slate-900">EletromGuide</span>
                    </div>
                    <ChevronRight size={14} />
                    <span className="font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Logado como:</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{MOCK_USER.name}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold shadow-lg shadow-brand-blue/20">
                    {MOCK_USER.name.charAt(0)}
                  </div>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-all"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className={cn(
              "flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col",
              isMobile ? "pb-32" : "pb-10"
            )}>
              <div className="flex-1">
                {renderContent()}
              </div>
              
              {/* Desktop/Global Footer */}
              {!isMobile && (
                <footer className="mt-20 pt-8 border-t border-slate-200 flex flex-col items-center gap-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Developer: CidEngenharia - Sidney Sales
                  </p>
                  <div className="flex items-center gap-6">
                    <a href="https://linkedin.com/in/sidney.sales" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue transition-colors flex items-center gap-2 text-[10px] font-medium">
                      <Linkedin size={14} /> sidney.sales
                    </a>
                    <a href="https://youtube.com/@cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] font-medium">
                      <Youtube size={14} /> @cidengenharia
                    </a>
                    <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-2 text-[10px] font-medium">
                      <Instagram size={14} /> @cidengenharia
                    </a>
                    <a href="https://wa.me/5571984184782" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-500 transition-colors flex items-center gap-2 text-[10px] font-medium">
                      <MessageCircle size={14} /> 71984184782
                    </a>
                    <a href="https://twitter.com/cidengeharia" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2 text-[10px] font-medium">
                      <Twitter size={14} /> @cidengeharia
                    </a>
                  </div>
                </footer>
              )}
            </div>
          </main>

          {/* Mobile Navigation */}
          {isMobile && <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />}
        </>
      )}
    </div>
  );
}
