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
  Trash2,
  Infinity,
  User as UserIcon
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
import CalculatorsModule from './components/CalculatorsModule';
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

const COLORS = ['#10B981', '#059669', '#F59E0B', '#EF4444'];

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
    { id: 'blog', label: 'Blog Técnico', icon: MessageCircle, url: 'https://eletromguide.wordpress.com' },
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
            if (item.url) {
              window.open(item.url, '_blank');
              return;
            }
            if (hasSubItems) {
              toggleExpand(item.id);
            } else {
              setActiveTab(item.id);
              if (setIsOpen) setIsOpen(false);
            }
          }}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200",
            isActive 
              ? "text-white shadow-lg shadow-emerald-600/30" 
              : "text-slate-500 hover:bg-white/[0.05] hover:text-white",
            depth > 0 && "ml-3 py-1.5"
          )}
          style={isActive ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } : undefined}
        >
          <item.icon size={18 - depth * 2} className={cn("shrink-0", isActive ? "text-white" : "text-slate-600")} />
          <span className={cn(
            "flex-1 text-left truncate",
            depth === 0 ? "text-xs font-bold uppercase tracking-wider" : "text-sm font-normal"
          )}>
            {item.label}
          </span>
          {hasSubItems && (
            <span className="text-current opacity-50">
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </span>
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
      "h-full flex flex-col text-white border-r border-white/5",
      isMobile ? "w-full" : "w-64"
    )}
    style={{ background: 'linear-gradient(180deg, #020617 0%, #0a1628 50%, #020617 100%)' }}>
      {/* Logo area with gradient accent */}
      <div className="relative p-6 flex flex-col items-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(37,99,235,0.2) 0%, transparent 70%)' }} />
        <img 
          src="/logo_eletro.fw.png" 
          alt="EletromGuide" 
          className="relative h-12 w-auto object-contain drop-shadow-2xl"
        />
      </div>
      
      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      <div className="mx-4 h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

      <div className={cn(
        "p-4 space-y-3",
        isMobile && "pb-32"
      )}>
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              SS
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-brand-green rounded-full border-2 border-slate-950">
              <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-50" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white/90">{MOCK_USER.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{MOCK_USER.role}</p>
          </div>
          <button className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

const GaugeChart = ({ value, max, label, subLabel }: { value: number, max: number, label?: string, subLabel?: string }) => {
  const data = [
    { value: value, fill: '#10B981' },
    { value: max - value, fill: '#e2e8f0' }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={65}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#10B981" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 text-center">
        <p className="text-2xl font-bold text-slate-900 leading-none">{value.toLocaleString()}</p>
        <p className="text-xs font-bold text-slate-400 uppercase mt-1">{subLabel}</p>
      </div>
      <div className="flex justify-between w-full px-6 -mt-2">
        <span className="text-xs font-bold text-slate-400">0</span>
        <span className="text-xs font-bold text-slate-400">{max}</span>
      </div>
    </div>
  );
};

const BulletChart = ({ value, target, label }: { value: number, target: number, label: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <p className="text-sm font-bold text-slate-600">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}%</p>
    </div>
    <div className="h-4 w-full bg-slate-100 rounded-sm relative overflow-hidden">
      <div 
        className="h-full bg-slate-500/30 absolute left-0 top-0" 
        style={{ width: `${target}%` }} 
      />
      <div 
        className="h-1.5 bg-brand-green absolute left-0 top-1/2 -translate-y-1/2" 
        style={{ width: `${value}%` }} 
      />
      <div 
        className="h-3 w-0.5 bg-slate-900 absolute top-1/2 -translate-y-1/2" 
        style={{ left: `${target}%` }} 
      />
    </div>
    <div className="flex justify-between text-xs font-bold text-slate-400">
      <span>0</span>
      <span>25</span>
      <span>50</span>
      <span>75</span>
      <span>100</span>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="relative bg-white rounded-xl p-4 overflow-hidden group card-hover"
    style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
    <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'radial-gradient(circle at top right, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
    <div className="flex justify-between items-start mb-3">
      <div className={cn("p-2 rounded-xl shadow-lg", color)}
        style={{ boxShadow: `0 4px 8px -2px currentColor` }}>
        <Icon className="text-white" size={16} />
      </div>
      {trend && (
        <span className="text-sm font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full border border-brand-green/20">
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-1">{title}</p>
    <p className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{value}</p>
  </div>
);

const Dashboard = ({ 
  onNewActivity, 
  activities = [], 
  onEditActivity, 
  onDeleteActivity,
  trialEndDate
}: { 
  onNewActivity: () => void,
  activities?: PT[],
  onEditActivity?: (activity: PT) => void,
  onDeleteActivity?: (id: string) => void,
  trialEndDate?: number | null
}) => {
  const daysLeft = trialEndDate ? Math.max(0, Math.ceil((trialEndDate - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {trialEndDate && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Período de Demonstração Ativo</p>
              <p className="text-sm text-slate-600">Seu acesso gratuito expira em <strong>{daysLeft} dias</strong>.</p>
            </div>
          </div>
          <button 
            onClick={() => window.open('https://cidengenharia.vercel.app/#/', '_blank')}
            className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
          >
            Upgrade
          </button>
        </motion.div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Visão Geral</p>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Painel Gerencial</h2>
          <p className="text-slate-500 text-sm mt-0.5">Conformidade técnica e indicadores.</p>
        </div>
        <button 
          onClick={onNewActivity}
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-white transition-all hover:shadow-lg hover:shadow-brand-green/30 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}
        >
          <Plus size={14} />
          Nova Atividade
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Conformidade Geral', value: '82%', icon: ShieldCheck, trend: '+3%', color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
          { label: 'PTs Abertas', value: '24', icon: FileText, trend: '+5', color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
          { label: 'Equipamentos LOTO', value: '3', icon: Lock, trend: 'OK', color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
          { label: 'Incidentes Evitados', value: '620', icon: TrendingUp, trend: '+14%', color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3 group hover:-translate-y-0.5 transition-all duration-200"
            style={{ boxShadow: '0 2px 10px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ background: kpi.bg }}>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest truncate">{kpi.label}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <p className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{kpi.value}</p>
                <span className="text-sm font-bold px-1 py-0 rounded-full" style={{ color: kpi.color, background: kpi.bg }}>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Conformidade vs Meta</h3>
            <BulletChart label="Conformidade Geral" value={82} target={90} />
            
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">PTs Abertas</h3>
                <GaugeChart value={5.321} max={6} subLabel="Média Diária" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">Inspeções</h3>
                <GaugeChart value={1.329} max={6} subLabel="Média Semanal" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Período de Emissão</p>
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>PTs Emitidas</h3>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PT_CREATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 5px 10px -2px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[2, 2, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Período de Fechamento</p>
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Incidentes Evitados</h3>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACCIDENT_RATE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 5px 10px -2px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <div className="p-3" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }}>
              <h3 className="text-sm font-bold text-white">Relação de Segurança</h3>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rotate-45 flex items-center justify-center shrink-0">
                  <div className="-rotate-45 text-white"><Target size={14} /></div>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">0.9 : 1</p>
                  <p className="text-sm font-bold text-slate-400 uppercase">Meta de Inspeção</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-emerald-500 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-slate-900">2.5 : 1</p>
                  <p className="text-sm font-bold text-slate-400 uppercase">Risco Crítico</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Frequência Relativa</p>
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Principais Riscos</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_RISKS_DATA} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={70} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 5px 10px -2px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={15}>
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

      <div className="bg-white p-4 rounded-xl overflow-hidden"
        style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)' }}>
            <ShieldCheck size={14} className="text-brand-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Auditoria</p>
            <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Conformidade por Norma (NR)</h3>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPLIANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 5px 10px -2px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'compliance' ? 'Conformidade' : 'Não Conformidade'
                ]}
              />
              <Bar dataKey="compliance" fill="#10B981" radius={[2, 2, 0, 0]} barSize={10} />
              <Bar dataKey="nonCompliance" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.05)' }}>
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)' }}>
              <Activity size={14} className="text-brand-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Histórico</p>
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Atividades Recentes</h3>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'rgba(248,250,252,0.8)' }}>
                <th className="px-4 py-2 text-sm font-bold text-slate-400 uppercase tracking-widest">ID / Empresa</th>
                <th className="px-4 py-2 text-sm font-bold text-slate-400 uppercase tracking-widest">Local / Equipamento</th>
                <th className="px-4 py-2 text-sm font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-2 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900 text-sm font-mono">{activity.id}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{activity.companyName || 'Empresa não informada'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700 font-medium">{activity.location}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{activity.equipmentInvolved}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-sm font-bold uppercase tracking-wide",
                      activity.status === 'ABERTA' 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    )}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditActivity?.(activity)}
                        className="p-1 text-slate-400 hover:text-brand-green hover:bg-brand-green/8 rounded-lg transition-all"
                        title="Editar Atividade"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => onDeleteActivity?.(activity.id)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir Atividade"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                        <Activity size={14} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">Nenhuma atividade registrada</p>
                    </div>
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
    { id: 'ELETRICO', label: 'Serviço Elétrico', icon: Zap, color: 'bg-emerald-500' },
    { id: 'ALTURA', label: 'Trabalho em Altura', icon: ArrowUp, color: 'bg-emerald-500' },
    { id: 'QUENTE', label: 'Trabalho a Quente', icon: Flame, color: 'bg-emerald-500' },
    { id: 'CONFINADO', label: 'Espaço Confinado', icon: Box, color: 'bg-emerald-500' },
    { id: 'ESCAVACAO', label: 'Escavação', icon: Construction, color: 'bg-emerald-500' },
    { id: 'ICAMENTO', label: 'Içamento de Carga', icon: Truck, color: 'bg-emerald-500' },
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
    <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
      style={{ boxShadow: '0 16px 32px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' }}>
      <div className="p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-emerald-200 uppercase tracking-widest mb-0.5">Emissão de Documento</p>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Nova Atividade de Risco</h2>
              <p className="text-emerald-100 text-sm mt-0.5">Passo {step} de 3</p>
            </div>
            <button onClick={onCancel} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-emerald-100">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: step >= s ? '100%' : '0%',
                    background: '#10B981'
                  }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">Passo 1 de 3</p>
              <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Tipo de Serviço</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectService(type.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all group hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(248,250,252,0.6)' }}
                >
                  <div className={cn("p-2 rounded-xl text-white transition-all group-hover:scale-105", type.color)}>
                    <type.icon size={22} />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm text-center leading-tight">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Informações da Atividade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
                <input 
                  type="text" 
                  placeholder="Ex: Petrobras / Vale"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Local da Atividade</label>
                <input 
                  type="text" 
                  placeholder="Ex: Galpão de Pintura"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Equipamento Envolvido</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ponte Rolante 02"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  value={formData.equipmentInvolved}
                  onChange={e => setFormData({...formData, equipmentInvolved: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-bold text-slate-700">Descrição do Serviço</label>
                <RichTextEditor 
                  value={formData.description}
                  onChange={content => setFormData({...formData, description: content})}
                  placeholder="Descreva detalhadamente o que será executado..."
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-lg transition-colors">
                Voltar
              </button>
              <button 
                disabled={!formData.location || !formData.description || !formData.companyName}
                onClick={() => setStep(3)} 
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Próximo: Checklist
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Checklist de Segurança (PT)</h3>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-500 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-emerald-600" />
                Baseado na {SERVICE_CONFIG[formData.serviceType!].nrs.join(', ')}
              </div>
            </div>

            <div className="space-y-2">
              {formData.checklist?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCheck(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    item.checked 
                      ? "bg-emerald-50 border-emerald-200 text-slate-900" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                    item.checked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                  )}>
                    {item.checked && <CheckCircle2 size={12} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.isCritical && (
                      <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Item Crítico Obrigatório</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!isChecklistValid && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                <AlertTriangle size={16} />
                <p className="text-sm font-bold">Atenção: Itens críticos não conformes impedem a liberação.</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-lg transition-colors">
                Voltar
              </button>
              <button 
                disabled={!isChecklistValid}
                onClick={() => onComplete(formData)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Permissões de Trabalho (PT)</h2>
        <div className="flex gap-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar PT..."
              className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <Filter size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-4 py-3 text-sm font-bold text-slate-500 uppercase">ID / Atividade</th>
              <th className="px-4 py-3 text-sm font-bold text-slate-500 uppercase">Local</th>
              <th className="px-4 py-3 text-sm font-bold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-sm font-bold text-slate-500 uppercase">Início</th>
              <th className="px-4 py-3 text-sm font-bold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PTS.map((pt) => (
              <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-900 text-sm">{pt.id}</p>
                  <p className="text-sm text-slate-500">{SERVICE_CONFIG[pt.serviceType].label}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{pt.location}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-sm font-bold uppercase",
                    pt.status === 'EM_ANDAMENTO' ? "bg-emerald-50 text-emerald-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {pt.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(pt.startTime).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Download size={16} />
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Segurança em Eletricidade</p>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Sistema LOTO</h2>
          <p className="text-slate-500 text-sm mt-0.5">Lockout & Tagout - Bloqueio e Etiquetagem</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm"
        >
          <Lock size={16} />
          Novo Bloqueio
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">{editingLoto ? 'Editar Bloqueio' : 'Novo Bloqueio LOTO'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Equipamento</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.equipment}
                onChange={e => setFormData({...formData, equipment: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Energia</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Número do Cadeado</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.lockNumber}
                onChange={e => setFormData({...formData, lockNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Checklist de Bloqueio</p>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Etapas de Bloqueio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {formData.steps?.map((step, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    const newSteps = [...(formData.steps || [])];
                    newSteps[idx].completed = !newSteps[idx].completed;
                    setFormData({...formData, steps: newSteps});
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all",
                    step.completed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center", step.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300")}>
                    {step.completed && <CheckCircle2 size={14} />}
                  </div>
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={resetForm} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm"
            >
              <Save size={16} />
              Salvar Bloqueio
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lotos.map(loto => (
          <div key={loto.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-500 transition-all">
            <div className={cn(
              "p-4 flex justify-between items-center text-white",
              loto.status === 'BLOQUEADO' ? "bg-emerald-600" : "bg-emerald-600"
            )}>
              <div>
                <h3 className="text-sm font-bold">{loto.equipment}</h3>
                <p className="text-white/80 text-xs">Cadeado: {loto.lockNumber} • {loto.energyType}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm font-bold text-xs uppercase">
                  {loto.status}
                </div>
                <div className="flex gap-1 transition-opacity">
                  <button onClick={() => handleEdit(loto)} className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Editar">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(loto.id)} className="p-1 bg-white/20 hover:bg-red-500 rounded-lg transition-colors" title="Excluir">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-3">
                  {loto.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-center gap-3 pl-8">
                      <div className={cn(
                        "absolute left-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold z-10",
                        step.completed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {step.completed ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        step.completed ? "text-slate-900" : "text-slate-400"
                      )}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users size={14} className="text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Responsável: {MOCK_USER.name}</span>
                </div>
                <button className="text-emerald-600 font-bold text-sm hover:underline">
                  Detalhes
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cartilha de NRs</h1>
          <p className="text-slate-500 text-sm">Guia rápido das Normas Regulamentadoras.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
            <ShieldCheck size={16} />
            Conformidade Legal
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm shrink-0"
          >
            <Plus size={16} />
            Nova NR
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">{editingPost ? 'Editar NR' : 'Nova NR'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Código</label>
              <input type="text" placeholder="Ex: NR-10" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
              <input type="text" placeholder="Ex: Segurança em Instalações..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Resumo</label>
              <textarea placeholder="Resumo da norma..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" rows={2} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Principais Pontos (Um por linha)</label>
              <textarea placeholder="Ponto 1&#10;Ponto 2" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" rows={3} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Link Completo (Opcional)</label>
              <input type="text" placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={resetForm} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-1 text-sm">
              <Save size={16} /> Salvar NR
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((nr) => (
          <div key={nr.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-emerald-500 transition-colors flex flex-col">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => { setEditingPost(nr); setFormData({ ...nr, details: nr.details.join('\n') }); setIsFormOpen(true); }} className="p-1.5 bg-slate-50 text-slate-400 hover:text-emerald-600 border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
                <Edit2 size={14} />
              </button>
              <button onClick={() => setPosts(posts.filter(p => p.code !== nr.code))} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg shadow-sm transition-all" title="Excluir">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-4 pr-12">
              <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-mono text-sm font-bold">
                {nr.code}
              </div>
              <BookOpen size={20} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{nr.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
              {nr.summary}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Principais Pontos</p>
              <ul className="space-y-1.5">
                {nr.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
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
                className="mt-6 w-full py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors text-center"
              >
                Ver Norma Completa
              </a>
            )}
          </div>
        ))}
      </div>
      {posts.length === 0 && !isFormOpen && (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
          <FileCode size={32} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Nenhuma NR encontrada</p>
          <p className="text-sm mb-4">Crie um novo registro clicando no botão acima.</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Normas Regulamentadoras vigentes:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
          {ALL_NRS_LIST.map((nr, idx) => (
            <div key={idx} className="text-sm text-slate-600 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              {nr}
            </div>
          ))}
        </div>
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Esquemas Elétricos</h2>
          <p className="text-slate-500 text-sm">Representações gráficas de instalações e circuitos.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm shrink-0"
        >
          <Plus size={16} />
          Nova Postagem
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">{editingPost ? 'Editar Postagem' : 'Nova Postagem de Esquema'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
              <input type="text" placeholder="Ex: 2. Esquema Multifilar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
              <textarea placeholder="Descrição detalhada do esquema..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" rows={2} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Exemplo de Aplicação</label>
              <input type="text" placeholder="Ex: Acionamento de motor trifásico." value={formData.example} onChange={e => setFormData({...formData, example: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-600 uppercase">Vantagem Principal</label>
              <input type="text" placeholder="Ex: Maior clareza nos comandos." value={formData.advantage} onChange={e => setFormData({...formData, advantage: e.target.value})} className="w-full px-3 py-2 border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/50 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-red-600 uppercase">Desvantagem Principal</label>
              <input type="text" placeholder="Ex: Mais complexo de desenhar." value={formData.disadvantage} onChange={e => setFormData({...formData, disadvantage: e.target.value})} className="w-full px-3 py-2 border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-red-50/50 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem (Opcional)</label>
              <input type="text" placeholder="Link da imagem representativa..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={resetForm} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-1 text-sm">
              <Save size={16} /> Salvar Postagem
            </button>
          </div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group hover:border-emerald-500 transition-colors">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={() => { setEditingPost(post); setFormData(post); setIsFormOpen(true); }} className="p-1.5 bg-slate-50 text-slate-400 hover:text-emerald-600 border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
              <Edit2 size={16} />
            </button>
            <button onClick={() => setPosts(posts.filter(p => p.id !== post.id))} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg shadow-sm transition-all" title="Excluir">
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="space-y-2 pr-12">
            <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {post.description}
            </p>
            {post.example && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-1">Exemplo:</p>
                <p className="text-xs text-slate-600">{post.example}</p>
              </div>
            )}
          </div>

          {(post.advantage || post.disadvantage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {post.advantage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-700 mb-0.5">Vantagem:</p>
                  <p className="text-xs text-emerald-600">{post.advantage}</p>
                </div>
              )}
              {post.disadvantage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-xs font-bold text-red-700 mb-0.5">Desvantagem:</p>
                  <p className="text-xs text-red-600">{post.disadvantage}</p>
                </div>
              )}
            </div>
          )}

          {post.image && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Exemplo Visual</p>
              <div className="rounded-lg overflow-hidden border border-slate-200 shadow-inner bg-white p-2">
                <img 
                  src={post.image}
                  alt={post.title} 
                  className="w-full h-auto max-h-64 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {posts.length === 0 && !isFormOpen && (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
          <FileCode size={32} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Nenhuma postagem encontrada</p>
          <p className="text-sm mb-4">Crie um novo esquema elétrico clicando no botão acima.</p>
        </div>
      )}
    </div>
  );
};

const MobileNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
    <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-1 flex justify-center items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="relative -top-4">
        <button 
          onClick={() => setActiveTab('new')}
          className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 border-4 border-white"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  </div>
);

const LandingPage = ({ onLogin }: { onLogin: (user: User, trialDays?: number) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email === 'teste@eletromguide.com.br' && password === 'admin') {
        onLogin({
          id: 'trial-user',
          name: 'Usuário de Teste',
          email: email,
          role: 'TECNICO',
          companyId: 'trial-comp'
        }, 7);
      } else {
        setError('Credenciais inválidas. Use teste@eletromguide.com.br / admin');
      }
    } else {
      setError('Apenas usuários autorizados podem se cadastrar nesta demonstração.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans overflow-hidden">
      <div className="relative w-full md:w-3/5 p-6 md:p-12 flex flex-col justify-center overflow-hidden min-h-[50vh] md:min-h-screen"
        style={{ background: '#050e1a' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute" style={{
            width: '500px', height: '500px',
            left: '-100px', top: '50%', transform: 'translateY(-50%)',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 35%, transparent 70%)',
            filter: 'blur(50px)'
          }} />
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(5,14,26,0.2) 0%, rgba(5,14,26,0.4) 40%, rgba(5,14,26,0.8) 80%, rgba(5,14,26,1) 100%)'
        }} />

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-xl pt-20"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-emerald-500 leading-[1.1] mb-2 tracking-tight"
          >
            Engenharia Técnica
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 mb-6 leading-relaxed font-light max-w-md text-base md:text-lg"
          >
            Pare de perder tempo procurando materiais na internet, encontre tudo em único lugar - Materiais Técnicos na palma das suas mãos.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, title: "Conformidade NR", desc: "Digitalização de NRs com validação em tempo real.", num: '01' },
              { icon: FileText, title: "Relatórios Digitais", desc: "Emissão instantânea de PTs e APRs.", num: '02' },
              { icon: Lock, title: "Sistema LOTO", desc: "Isolamento de energia com fluxogramas.", num: '03' },
              { icon: BarChart3, title: "Indicadores de Risco", desc: "Análise preditiva de incidentes.", num: '04' },
              { icon: Calculator, title: "Calculadoras Técnicas", desc: "Cálculo de medidas e conversões.", num: '05' },
              { icon: BookOpen, title: "Blog Técnico", desc: "Espaço com dicas técnicas.", num: '06' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + (idx * 0.08) }}
                className="relative flex items-start gap-2 p-3 rounded-xl border transition-all duration-300 group cursor-default"
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.05)',
                }}
                whileHover={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' }}
              >
                <div className="absolute top-2 right-2 text-xs font-bold text-slate-700 font-mono">{feature.num}</div>
                <div className="p-2 rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <feature.icon size={20} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-0.5 text-sm md:text-base">{feature.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-1/3 min-h-[60vh] md:min-h-screen flex items-center justify-center p-6 relative bg-slate-900/40 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[400px] relative z-10"
        >
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] p-5 relative overflow-hidden">
            <div className="mb-4 text-center">
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30"
                >
                  <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">✦ Teste 7 Dias Grátis</span>
                </motion.div>
              )}
              <motion.h2 
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-white tracking-tight"
              >
                {isLogin ? 'Acesse o sistema' : 'cadastro técnico'}
              </motion.h2>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (isLogin) {
                if (email === 'teste@eletromguide.com' && password === 'admin') {
                  onLogin({
                    id: 'trial-user',
                    name: 'Usuário de Teste',
                    email: email,
                    role: 'TECNICO',
                    companyId: 'trial-comp'
                  }, 7);
                } else if (email && password) {
                  onLogin({
                    id: 'user-' + Math.random(),
                    name: fullName || 'Usuário',
                    email: email,
                    role: 'TECNICO',
                    companyId: 'comp-1'
                  });
                } else {
                  setError('Por favor preencha as credenciais.');
                }
              } else {
                if (fullName && email && password) {
                  onLogin({
                    id: 'user-' + Math.random(),
                    name: fullName,
                    email: email,
                    role: 'TECNICO',
                    companyId: 'comp-1'
                  });
                } else {
                  setError('Por favor preencha todos os campos.');
                }
              }
            }} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Nome Completo</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        required
                        placeholder="Nome Sobrenome"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 lowercase tracking-[0.2em] pl-1">e-mail</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="email@empresa.com.br"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1 pr-1">
                  <label className="text-[10px] font-bold text-slate-500 lowercase tracking-[0.2em]">senha</label>
                  {isLogin && <a href="#" className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors lowercase tracking-widest">recuperar</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs font-medium">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-2.5 rounded-lg shadow-xl shadow-emerald-500/20 transition-all mt-2 flex items-center justify-center gap-2 group"
              >
                <span className="text-sm tracking-widest">{isLogin ? 'Login' : 'Cadastro'}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              {isLogin && (
                <div className="mt-3 p-2 bg-slate-400/5 rounded-lg border border-white/5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Acesso Demonstração (7 Dias)</p>
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <span className="text-xs">E-mail: teste@eletromguide.com</span>
                    <span className="text-xs">Senha: admin</span>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm font-light">
                {isLogin ? 'Novo por aqui?' : 'Já possui perfil técnico?'}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="ml-2 text-emerald-500 font-bold hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-emerald-500/30"
                >
                  {isLogin ? 'Crie sua conta' : 'Fazer login'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* TOP HEADER BAR - fixo com glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 md:h-18 pointer-events-none"
        style={{ background: 'rgba(5,14,26,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 pointer-events-auto"
        >
          <img src="/logo_eletro.fw.png" alt="EletromGuide" className="h-9 md:h-11 object-contain" />
          <span className="text-[11px] font-bold bg-brand-green/20 text-brand-green border border-brand-green/30 px-2 py-0.5 rounded-full tracking-widest lowercase">beta</span>
        </motion.div>

        {/* Social Icons - sem fundo, cor no hover */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 pointer-events-auto"
        >
          {/* Instagram */}
          <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center text-slate-500 transition-all duration-300 hover:scale-110 group" title="Instagram @cidengenharia">
            <Instagram size={18} strokeWidth={1.5} className="group-hover:text-[#E1306C] transition-colors duration-300" />
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com/in/sidney.sales" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center text-slate-500 transition-all duration-300 hover:scale-110 group" title="LinkedIn Sidney Sales">
            <Linkedin size={18} strokeWidth={1.5} className="group-hover:text-[#0A66C2] transition-colors duration-300" />
          </a>

          {/* YouTube */}
          <a href="https://youtube.com/@cidengenharia" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center text-slate-500 transition-all duration-300 hover:scale-110 group" title="YouTube @cidengenharia">
            <Youtube size={18} strokeWidth={1.5} className="group-hover:text-[#FF0000] transition-colors duration-300" />
          </a>

          {/* CidEngenharia - Infinity SVG */}
          <a href="https://cidengenharia.vercel.app/#/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110" title="CidEngenharia">
            <svg viewBox="0 0 46 22" className="w-[22px] h-[11px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="metaGradHdr" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E91E8C" />
                  <stop offset="50%" stopColor="#9B5CFF" />
                  <stop offset="100%" stopColor="#3B1FD8" />
                </linearGradient>
              </defs>
              <path
                d="M6 11 C6 6.5, 9.5 3, 14 3 C18.5 3, 21 7.5, 23 11 C25 14.5, 27.5 19, 32 19 C36.5 19, 40 15.5, 40 11 C40 6.5, 36.5 3, 32 3 C27.5 3, 25 7.5, 23 11 C21 14.5, 18.5 19, 14 19 C9.5 19, 6 15.5, 6 11 Z"
                stroke="url(#metaGradHdr)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>


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
  
  // Trial States
  const [trialEndDate, setTrialEndDate] = useState<number | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);

  useEffect(() => {
    // Check trial on mount if authenticated
    if (isAuthenticated && trialEndDate) {
      const now = Date.now();
      if (now > trialEndDate) {
        setIsTrialExpired(true);
      }
    }
  }, [isAuthenticated, trialEndDate]);

  const handleLogin = (user: User, trialDays?: number) => {
    setCurrentUser(user);
    if (trialDays) {
      // For testing purposes, we use localStorage to persist trial start if needed
      // Or just set it for the session if that's what's requested
      const end = Date.now() + (trialDays * 24 * 60 * 60 * 1000);
      setTrialEndDate(end);
      setIsTrialExpired(false);
    } else {
      setTrialEndDate(null);
      setIsTrialExpired(false);
    }
    setIsAuthenticated(true);
  };

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
      return <LandingPage onLogin={handleLogin} />;
    }

    if (isTrialExpired) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[40px] max-w-lg w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
              <Zap size={40} className="text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Seu teste grátis expirou!</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Obrigado por testar o <strong>EletromGuide</strong>. Sua conta de 7 dias chegou ao fim. Para continuar transformando sua gestão técnica, escolha um plano de assinatura.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.open('https://cidengenharia.vercel.app/#/', '_blank')}
                className="w-full bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-brand-green/20 transition-all flex items-center justify-center gap-3"
              >
                Escolher Plano de Assinatura
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full py-4 text-slate-500 hover:text-white transition-colors font-medium text-sm"
              >
                Voltar para o Login
              </button>
            </div>
          </motion.div>
        </div>
      );
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
              trialEndDate={trialEndDate}
            />
          );
        case 'pt': return <PTModule />;
        case 'apr': return <APRModule />;
        case 'loto': return <LOTOSystem />;
        case 'nrs': return <NRHandbook />;
        case 'eletrotecnica-calculadoras': return <CalculatorsModule category="eletrotecnica" />;
        case 'eletronica-calculadoras': return <CalculatorsModule category="eletronica" />;
        case 'eletromecanica-calculadoras': return <CalculatorsModule category="eletromecanica" />;
        case 'esquemas-eletricos': return <ElectricalSchematics />;
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
    <>
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
            <header className="sticky top-0 z-30 border-b border-slate-100 px-6 py-3.5 flex justify-between items-center"
              style={{ background: 'rgba(248,250,252,0.85)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <Menu size={20} className="text-slate-600" />
                  </button>
                )}
                <div className="flex items-center gap-2 md:hidden">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <BrandLogo size={18} />
                  </div>
                  <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">EletromGuide</h1>
                </div>
                {!isMobile && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <BrandLogo size={16} iconClassName="text-emerald-500" />
                      <span className="font-semibold text-slate-900 text-sm">EletromGuide</span>
                    </div>
                    <span className="text-slate-300">/</span>
                    <span className="font-medium text-slate-600 capitalize"
                      style={{ fontFamily: 'Outfit, sans-serif' }}>{activeTab.replace(/-/g, ' ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="w-2 h-2 bg-brand-green rounded-full" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Online</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {currentUser.name.charAt(0)}
                  </div>
                  {trialEndDate && (
                    <div className="ml-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hidden md:flex flex-col items-end">
                      <span className="text-xs font-bold text-yellow-600 uppercase tracking-tighter">Trial</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-yellow-600" />
                        <span className="text-sm font-black text-slate-700">
                          {Math.max(0, Math.ceil((trialEndDate - Date.now()) / (1000 * 60 * 60 * 24)))} dias restantes
                        </span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                    title="Sair"
                  >
                    <LogOut size={18} />
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
                <footer className="mt-20 pt-8 flex flex-col items-center gap-5">
                  <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(203,213,225,0.5) 30%, rgba(203,213,225,0.5) 70%, transparent)' }} />
                  <div className="flex items-center gap-2">
                    <a href="https://linkedin.com/in/sidney.sales" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-semibold">
                      <Linkedin size={12} /> LinkedIn
                    </a>
                    <a href="https://youtube.com/@cidengenharia" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-semibold">
                      <Youtube size={12} /> YouTube
                    </a>
                    <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-pink-500 hover:text-white transition-all text-[10px] font-semibold">
                      <Instagram size={12} /> Instagram
                    </a>
                    <a href="https://wa.me/5571984184782" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-green-500 hover:text-white transition-all text-[10px] font-semibold">
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                    <a href="https://twitter.com/cidengeharia" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-sky-500 hover:text-white transition-all text-[10px] font-semibold">
                      <Twitter size={12} /> Twitter
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
    </>
  );
}
