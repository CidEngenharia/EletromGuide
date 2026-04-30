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
  ArrowRight,
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
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  CreditCard,
  Mail,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Utility for conditional classes
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

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
  Pie,
  AreaChart,
  Area
} from 'recharts';

import APRModule from './components/APRModule';
import PTModule from './components/PTModule';
import NotesModule from './components/NotesModule';
import RichTextEditor from './components/RichTextEditor';
import CalculatorsModule from './components/CalculatorsModule';
import BlogModule from './components/BlogModule';
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
  { name: 'Queda de Altura', value: 7.2, color: '#6D28D9' },
  { name: 'Choque Elétrico', value: 4.8, color: '#EF4444' },
  { name: 'Espaço Confinado', value: 3.8, color: '#F59E0B' },
  { name: 'Incêndio/Explosão', value: 3.2, color: '#64748b' },
  { name: 'Soterramento', value: 2.8, color: '#94a3b8' },
];

const COLORS = ['#6D28D9', '#5B21B6', '#F59E0B', '#EF4444'];

// --- Components ---

const BrandLogo = ({ size = 24, className = "", iconClassName = "text-white" }: { size?: number, className?: string, iconClassName?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <Settings size={size} className={cn("animate-[spin_20s_linear_infinite]", iconClassName)} />
    <Zap size={size * 0.5} className={cn("absolute fill-current", iconClassName)} />
  </div>
);

const UpgradeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-50 w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-10 scrollbar-hide">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors z-10">
          <X size={20} />
        </button>
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Escolha o plano ideal</h2>
          <p className="text-slate-500 font-medium">Sem necessidade de cartão de crédito, cancele quando quiser.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Free</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Para quem trabalha sozinho e quer organizar a gestão.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">R$ 0</span>
              <span className="text-slate-400 font-bold">/mês</span>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-8 pb-8 border-b border-slate-100">Gratuito para sempre</p>
            <button onClick={onClose} className="w-full mt-auto py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
              Plano Atual
            </button>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Básico</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Organização, segurança e controle.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">R$ 19</span>
              <span className="text-slate-400 font-bold">,90/mês</span>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-8 pb-8 border-b border-slate-100">Cobrado mensalmente</p>
            <button className="w-full mt-auto py-4 rounded-2xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={18} /> Pagar via Stripe
            </button>
          </div>
          <div className="bg-white rounded-[2rem] border-2 border-violet-500 shadow-2xl shadow-violet-500/20 p-8 relative flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-[10px] py-1 px-4 rounded-full font-bold tracking-widest uppercase">Mais Vendido</div>
            <h3 className="text-xl font-black text-violet-700 uppercase tracking-tight mb-2">Premium</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Ideal para quem quer tudo que uma assistência precisa.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">R$ 29</span>
              <span className="text-slate-400 font-bold">,90/mês</span>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-8 pb-8 border-b border-slate-100">Cobrado mensalmente</p>
            <button className="w-full mt-auto py-4 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2">
              <CreditCard size={18} /> Pagar via Stripe
            </button>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Profissional</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Para quem quer extrair o máximo da sua assistência.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">R$ 49</span>
              <span className="text-slate-400 font-bold">,90/mês</span>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-8 pb-8 border-b border-slate-100">Cobrado mensalmente</p>
            <button className="w-full mt-auto py-4 rounded-2xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={18} /> Pagar via Stripe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isMobile, setIsOpen, onUpgradeClick }: { activeTab: string, setActiveTab: (t: string) => void, isMobile?: boolean, setIsOpen?: (b: boolean) => void, onUpgradeClick?: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['eletrotecnica', 'eletrotecnica-gestao']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'eletrotecnica', 
      label: 'Eletrotécnica', 
      icon: Zap,
      subItems: [
        {
          id: 'eletrotecnica-gestao',
          label: 'Gestão & Relatórios',
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
        { id: 'eletrotecnica-padroes', label: 'Padrões Técnicos', icon: Library },
      ]
    },
    {
      id: 'eletronica',
      label: 'Eletrônica',
      icon: Cpu,
      subItems: [
        {
          id: 'eletronica-gestao',
          label: 'Gestão & Relatórios',
          icon: BarChart3,
          subItems: [
            { id: 'pt', label: 'Permissões (PT)', icon: FileText },
            { id: 'apr', label: 'Análises (APR)', icon: ShieldCheck },
            { id: 'loto', label: 'Sistema LOTO', icon: Lock },
          ]
        },
        { id: 'eletronica-componentes', label: 'Componentes', icon: CircuitBoard },
        { id: 'eletronica-epi', label: 'Controle de EPI', icon: HardHat },
        { id: 'eletronica-calculadoras', label: 'Calculadoras', icon: Calculator },
        { id: 'eletronica-esquemas', label: 'Esquemas Elétricos', icon: FileCode },
        { id: 'eletronica-padroes', label: 'Padrões Técnicos', icon: Library },
      ]
    },
    {
      id: 'eletromecanica',
      label: 'Eletromecânica',
      icon: Settings,
      subItems: [
        {
          id: 'eletromecanica-gestao',
          label: 'Gestão & Relatórios',
          icon: BarChart3,
          subItems: [
            { id: 'pt', label: 'Permissões (PT)', icon: FileText },
            { id: 'apr', label: 'Análises (APR)', icon: ShieldCheck },
            { id: 'loto', label: 'Sistema LOTO', icon: Lock },
          ]
        },
        { id: 'eletromecanica-componentes', label: 'Componentes', icon: CircuitBoard },
        { id: 'eletromecanica-epi', label: 'Controle de EPI', icon: HardHat },
        { id: 'eletromecanica-calculadoras', label: 'Calculadoras', icon: Calculator },
        { id: 'eletromecanica-esquemas', label: 'Esquemas Elétricos', icon: FileCode },
        { id: 'eletromecanica-padroes', label: 'Padrões Técnicos', icon: Library },
      ]
    },
    { id: 'blog', label: 'Blog Interno', icon: MessageCircle },
    { id: 'nrs', label: 'Biblioteca NRs', icon: BookOpen },
    { id: 'auditoria', label: 'Auditoria', icon: Eye },
  ];

  const renderMenuItem = (item: any, depth = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeTab === item.id || (item.subItems?.some((s: any) => s.id === activeTab || s.subItems?.some((ss: any) => ss.id === activeTab)));

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
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group",
            isActive && depth === 0
              ? "bg-violet-50 text-violet-800 shadow-sm shadow-violet-700/5" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            depth > 0 && "py-2"
          )}
        >
          <item.icon size={isActive && depth === 0 ? 20 : 18} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "text-violet-700" : "text-slate-400")} />
          <span className={cn(
            "flex-1 text-left truncate",
            depth === 0 ? "text-[13px] font-black uppercase tracking-tight" : "text-[13px] font-bold"
          )}>
            {item.label}
          </span>
          {hasSubItems && (
            <ChevronDown size={14} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
          )}
        </button>
        
        <AnimatePresence>
          {hasSubItems && isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn("mt-1 space-y-1", depth === 0 ? "ml-4 border-l border-slate-100 pl-2" : "ml-4")}
            >
              {item.subItems.map((subItem: any) => renderMenuItem(subItem, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-white",
      isMobile ? "w-full" : "w-64"
    )}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-700/20"
          style={{ background: 'linear-gradient(135deg, #6D28D9, #5B21B6)' }}>
          <BrandLogo size={20} />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">EletromGuide</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Safety & Tech</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer Info / Support */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/30">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Zap size={16} className="fill-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Premium Tools</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Trial: 7 dias</p>
            </div>
          </div>
          <button 
            onClick={onUpgradeClick ? onUpgradeClick : () => window.open('https://cidengenharia.vercel.app/#/', '_blank')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Fazer Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

const GaugeChart = ({ value, max, label, subLabel }: { value: number, max: number, label?: string, subLabel?: string }) => {
  const data = [
    { value: value, fill: '#6D28D9' },
    { value: max - value, fill: '#f1f5f9' }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell fill="url(#gaugeGradient)" />
              <Cell fill="#f1f5f9" />
            </Pie>
            <defs>
              <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center">
        <p className="text-3xl font-black text-slate-900 leading-none">{value.toLocaleString()}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{subLabel}</p>
      </div>
      <div className="flex justify-between w-full px-8 -mt-4">
        <span className="text-[10px] font-black text-slate-300">0</span>
        <span className="text-[10px] font-black text-slate-300">{max}</span>
      </div>
    </div>
  );
};

const BulletChart = ({ value, target, label }: { value: number, target: number, label: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-slate-900">{value}%</span>
        <span className="text-[10px] font-bold text-slate-400">/ {target}% meta</span>
      </div>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-violet-500 to-violet-800 rounded-full relative z-10" 
      />
      <div 
        className="h-full bg-slate-200 absolute left-0 top-0 rounded-full" 
        style={{ width: `${target}%` }} 
      />
      <div 
        className="absolute top-0 h-full w-0.5 bg-slate-900 z-20" 
        style={{ left: `${target}%` }} 
      />
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="relative bg-white rounded-[2rem] p-6 overflow-hidden group border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl shadow-lg transition-transform group-hover:scale-110", color)}>
        <Icon className="text-white" size={20} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 bg-violet-50 text-violet-800 px-2.5 py-1 rounded-full border border-violet-100">
          <TrendingUp size={12} />
          <span className="text-[10px] font-black">{trend}</span>
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
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
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-violet-700 to-transparent" />
          <Zap size={300} className="absolute -right-20 -top-20 text-violet-700 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-800 text-[10px] font-black uppercase tracking-widest border border-violet-100">
              {greeting}, Sidney
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-[11px] font-bold text-yellow-700 uppercase tracking-widest">
              Você está usando o plano Free, algumas funcionalidades vão expirar em 7 dias, faça o Upgrade!
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
            Eletrom<span className="text-violet-700">Guide</span> Dashboard
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-white bg-violet-700 text-white flex items-center justify-center text-xs font-bold">
                +12
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Sua equipe está com <span className="text-violet-800 font-bold">98% de conformidade</span> hoje. <br className="hidden md:block" /> 
              Foram emitidas <span className="text-slate-900 font-bold">14 novas permissões</span> nas últimas 24 horas.
            </p>
            
            <div className="md:ml-auto">
              <button 
                onClick={onNewActivity}
                className="group relative px-8 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-800 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus size={20} strokeWidth={3} className="relative z-10" />
                <span className="relative z-10">Nova Atividade Técnica</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section - Refined */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Conformidade NR" 
          value="98.2%" 
          icon={ShieldCheck} 
          color="bg-violet-700" 
          trend="+2.4%" 
        />
        <StatCard 
          title="Permissões Ativas" 
          value={activities.filter(a => a.status === 'ABERTA').length} 
          icon={FileText} 
          color="bg-slate-900" 
          trend="+12%" 
        />
        <StatCard 
          title="Bloqueios LOTO" 
          value="42" 
          icon={Lock} 
          color="bg-violet-800" 
        />
        <StatCard 
          title="Segurança" 
          value="342 Dias" 
          icon={CheckCircle2} 
          color="bg-violet-900" 
          trend="Meta OK"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Produtividade & Segurança</h3>
                <p className="text-slate-400 text-sm font-medium">Histórico de emissão de PTs e conformidade</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-[10px] font-black text-slate-900 uppercase">Mensal</button>
                <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase">Semanal</button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PT_CREATION_DATA}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6D28D9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a',
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
                      padding: '12px' 
                    }}
                    itemStyle={{ color: '#6D28D9', fontWeight: 900, fontSize: '12px' }}
                    cursor={{ stroke: '#6D28D9', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6D28D9" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activities List - Simplified and Premium */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Atividades Recentes</h3>
                <p className="text-slate-400 text-sm font-medium">Controle em tempo real de permissões</p>
              </div>
              <button 
                onClick={onNewActivity}
                className="flex items-center gap-2 px-6 py-3 bg-violet-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-800 transition-all shadow-lg active:scale-95"
              >
                <Plus size={16} /> Nova PT
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Atividade</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Técnico</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activities.length > 0 ? activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-violet-700 font-bold text-xs border border-slate-200">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">#{activity.id}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[150px]">{activity.description || 'Manutenção Elétrica'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center text-[10px] font-black text-violet-900">
                            {activity.authorizedWorkers[0]?.name?.charAt(0) || 'S'}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{activity.authorizedWorkers[0]?.name || 'Sidney Sales'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center justify-center gap-1.5 mx-auto w-fit",
                          activity.status === 'ABERTA' ? "bg-violet-50 text-violet-800 border-violet-100" : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", activity.status === 'ABERTA' ? "bg-violet-700 animate-pulse" : "bg-slate-400")} />
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onEditActivity?.(activity)} className="p-2 text-slate-400 hover:text-violet-700 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => onDeleteActivity?.(activity.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto">
                          <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Activity size={24} className="text-slate-300" />
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">Aguardando registros</h4>
                          <p className="text-xs text-slate-400 font-bold">As atividades técnicas aparecerão aqui após a emissão.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trial / Subscription Widget */}
          {trialEndDate && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-700/30 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                    <Zap size={24} className="text-violet-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-violet-700/10 text-violet-500 text-[10px] font-black uppercase tracking-widest border border-violet-700/20">
                    {daysLeft} dias restantes
                  </span>
                </div>
                
                <h3 className="text-xl font-black mb-2 tracking-tight uppercase">Plano Premium</h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-tight">
                  Libere relatórios em PDF, gestão de equipes e armazenamento ilimitado.
                </p>
                
                <button 
                  onClick={() => window.open('https://cidengenharia.vercel.app/#/', '_blank')}
                  className="w-full py-4 bg-violet-700 hover:bg-violet-500 text-slate-950 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-violet-700/20 active:scale-95"
                >
                  Assinar Agora
                </button>
              </div>
            </div>
          )}

          {/* Training Widget */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center border border-violet-100">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Treinamentos</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualificação NR</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'NR-10 Básico', progress: 100, status: 'Válido' },
                { name: 'NR-35 Altura', progress: 85, status: 'Vencendo' },
                { name: 'SEP - Elétrica', progress: 40, status: 'Andamento' },
              ].map((course, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{course.name}</span>
                    <span className={cn(
                      "font-black uppercase text-[10px]",
                      course.progress === 100 ? "text-violet-700" : "text-amber-500"
                    )}>{course.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        course.progress === 100 ? "bg-violet-700" : "bg-amber-500"
                      )} 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              Ver Certificados
            </button>
          </div>

          {/* Quick Support Widget */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <MessageSquare size={48} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
            
            <h3 className="text-sm font-black mb-2 uppercase tracking-widest">Suporte Técnico</h3>
            <p className="text-indigo-100 text-xs font-medium mb-6">Dúvida sobre alguma NR ou funcionalidade? Fale conosco agora.</p>
            <a 
              href="https://wa.me/5571984184782" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Chamar no WhatsApp
            </a>
          </div>
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
    { id: 'ELETRICO', label: 'Serviço Elétrico', icon: Zap, color: 'bg-violet-700' },
    { id: 'ALTURA', label: 'Trabalho em Altura', icon: ArrowUp, color: 'bg-violet-700' },
    { id: 'QUENTE', label: 'Trabalho a Quente', icon: Flame, color: 'bg-violet-700' },
    { id: 'CONFINADO', label: 'Espaço Confinado', icon: Box, color: 'bg-violet-700' },
    { id: 'ESCAVACAO', label: 'Escavação', icon: Construction, color: 'bg-violet-700' },
    { id: 'ICAMENTO', label: 'Içamento de Carga', icon: Truck, color: 'bg-violet-700' },
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
        style={{ background: 'linear-gradient(135deg, #3B0764 0%, #065f46 50%, #3B0764 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.3) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-violet-200 uppercase tracking-widest mb-0.5">Emissão de Documento</p>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>Nova Atividade de Risco</h2>
            </div>
            <button onClick={onCancel} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-violet-100">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: step >= s ? '100%' : '0%',
                    background: '#6D28D9'
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
              <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>Tipo de Serviço</h3>
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-violet-700 focus:border-transparent outline-none"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Local da Atividade</label>
                <input 
                  type="text" 
                  placeholder="Ex: Galpão de Pintura"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-violet-700 focus:border-transparent outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Equipamento Envolvido</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ponte Rolante 02"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-violet-700 focus:border-transparent outline-none"
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
                className="bg-violet-800 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-violet-800/20 hover:bg-violet-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <ShieldCheck size={14} className="text-violet-800" />
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
                      ? "bg-violet-50 border-violet-200 text-slate-900" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                    item.checked ? "bg-violet-800 border-violet-800 text-white" : "border-slate-300"
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
                className="bg-violet-800 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-violet-800/20 hover:bg-violet-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-700 outline-none text-sm"
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
                    pt.status === 'EM_ANDAMENTO' ? "bg-violet-50 text-violet-800" : "bg-violet-50 text-violet-800"
                  )}>
                    {pt.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(pt.startTime).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition-colors">
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
          <p className="text-sm font-bold text-violet-700 uppercase tracking-widest mb-0.5">Segurança em Eletricidade</p>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>Sistema LOTO</h2>
          <p className="text-slate-500 text-sm mt-0.5">Lockout & Tagout - Bloqueio e Etiquetagem</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-violet-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all text-sm"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-700 outline-none text-sm"
                value={formData.equipment}
                onChange={e => setFormData({...formData, equipment: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Energia</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-700 outline-none text-sm"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-700 outline-none text-sm"
                value={formData.lockNumber}
                onChange={e => setFormData({...formData, lockNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-violet-700 uppercase tracking-widest mb-0.5">Checklist de Bloqueio</p>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>Etapas de Bloqueio</h3>
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
                    step.completed ? "bg-violet-50 border-violet-200 text-violet-900" : "border-slate-100 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center", step.completed ? "bg-violet-800 border-violet-800 text-white" : "border-slate-300")}>
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
              className="bg-violet-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all flex items-center gap-2 text-sm"
            >
              <Save size={16} />
              Salvar Bloqueio
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lotos.map(loto => (
          <div key={loto.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-violet-700 transition-all">
            <div className={cn(
              "p-4 flex justify-between items-center text-white",
              loto.status === 'BLOQUEADO' ? "bg-violet-800" : "bg-violet-800"
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
                        step.completed ? "bg-violet-800 text-white" : "bg-slate-200 text-slate-500"
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
                <button className="text-violet-800 font-bold text-sm hover:underline">
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
          <div className="bg-violet-50 text-violet-800 px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
            <ShieldCheck size={16} />
            Conformidade Legal
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-violet-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1 shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all text-sm shrink-0"
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
              <input type="text" placeholder="Ex: NR-10" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
              <input type="text" placeholder="Ex: Segurança em Instalações..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Resumo</label>
              <textarea placeholder="Resumo da norma..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" rows={2} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Principais Pontos (Um por linha)</label>
              <textarea placeholder="Ponto 1&#10;Ponto 2" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" rows={3} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Link Completo (Opcional)</label>
              <input type="text" placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={resetForm} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-violet-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all flex items-center gap-1 text-sm">
              <Save size={16} /> Salvar NR
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((nr) => (
          <div key={nr.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-violet-700 transition-colors flex flex-col">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => { setEditingPost(nr); setFormData({ ...nr, details: nr.details.join('\n') }); setIsFormOpen(true); }} className="p-1.5 bg-slate-50 text-slate-400 hover:text-violet-800 border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
                <Edit2 size={14} />
              </button>
              <button onClick={() => setPosts(posts.filter(p => p.code !== nr.code))} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg shadow-sm transition-all" title="Excluir">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-4 pr-12">
              <div className="bg-violet-800 text-white px-3 py-1 rounded-lg font-mono text-sm font-bold">
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
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-800 mt-2 shrink-0" />
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
          className="bg-violet-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1 shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all text-sm shrink-0"
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
              <input type="text" placeholder="Ex: 2. Esquema Multifilar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
              <textarea placeholder="Descrição detalhada do esquema..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" rows={2} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Exemplo de Aplicação</label>
              <input type="text" placeholder="Ex: Acionamento de motor trifásico." value={formData.example} onChange={e => setFormData({...formData, example: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-violet-800 uppercase">Vantagem Principal</label>
              <input type="text" placeholder="Ex: Maior clareza nos comandos." value={formData.advantage} onChange={e => setFormData({...formData, advantage: e.target.value})} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 bg-violet-50/50 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-red-600 uppercase">Desvantagem Principal</label>
              <input type="text" placeholder="Ex: Mais complexo de desenhar." value={formData.disadvantage} onChange={e => setFormData({...formData, disadvantage: e.target.value})} className="w-full px-3 py-2 border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-red-50/50 text-sm" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem (Opcional)</label>
              <input type="text" placeholder="Link da imagem representativa..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-700 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={resetForm} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="bg-violet-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-violet-800/20 hover:bg-violet-900 transition-all flex items-center gap-1 text-sm">
              <Save size={16} /> Salvar Postagem
            </button>
          </div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group hover:border-violet-700 transition-colors">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={() => { setEditingPost(post); setFormData(post); setIsFormOpen(true); }} className="p-1.5 bg-slate-50 text-slate-400 hover:text-violet-800 border border-slate-200 rounded-lg shadow-sm transition-all" title="Editar">
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
                <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
                  <p className="text-xs font-bold text-violet-900 mb-0.5">Vantagem:</p>
                  <p className="text-xs text-violet-800">{post.advantage}</p>
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
          className="w-12 h-12 bg-violet-800 rounded-full flex items-center justify-center text-white shadow-xl shadow-violet-800/30 border-4 border-white"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  </div>
);

const FAQSection = () => {
  const faqs = [
    { q: 'Como funciona o período de teste?', a: 'Você tem acesso total a todas as funcionalidades por 7 dias. Não é necessário cartão de crédito para começar.' },
    { q: 'Os relatórios são válidos legalmente?', a: 'Sim, todos os nossos modelos de PT, APR e LOTO seguem rigorosamente as normas NR-10, NR-12 e NR-35.' },
    { q: 'Posso usar o sistema offline?', a: 'O EletromGuide é um Hub Web, mas você pode baixar os modelos e cartilhas para consulta offline sempre que precisar.' },
    { q: 'Como é feita a assinatura?', a: 'Trabalhamos com planos mensais e anuais via cartão, boleto ou PIX, com renovação automática e cancelamento simples.' },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 bg-[#0f0814]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-white mb-4">Dúvidas Frequentes</h2>
          <p className="text-slate-400">Tudo o que você precisa saber sobre o EletromGuide</p>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-white/10 last:border-b last:border-white/10">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className={cn(
                  "text-base transition-colors duration-200",
                  openIndex === i ? "text-white" : "text-white/70 group-hover:text-white"
                )}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 ml-4 transition-all duration-300",
                    openIndex === i ? "rotate-180 text-violet-500" : "text-slate-500 group-hover:text-violet-400"
                  )}
                />
              </button>
              {openIndex === i && (
                <p className="pb-6 text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonTable = () => {
  const features = [
    { name: 'Gestão de O.S. & PT', desc: 'Abertura e fechamento completo', plans: [true, true, true, true] },
    { name: 'Checklist Customizável', desc: 'Personalize conforme sua necessidade', plans: [false, true, true, true] },
    { name: 'Sistema LOTO Digital', desc: 'Bloqueios e etiquetas via App', plans: [false, false, true, true] },
    { name: 'Relatórios em PDF', desc: 'Emissão ilimitada com logo própria', plans: [true, true, true, true] },
    { name: 'Suporte Prioritário', desc: 'Atendimento via WhatsApp 24/7', plans: [false, false, false, true] },
  ];

  return (
    <section id="planos" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Escolha o plano ideal</h2>
          <p className="text-slate-500 font-medium">Sem necessidade de cartão de crédito, cancele quando quiser.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {/* FREE */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Free</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Para quem trabalha sozinho e quer organizar a gestão.</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-lg font-bold text-slate-800">R$</span>
              <span className="text-6xl font-black text-slate-900 mx-1 tracking-tighter">0</span>
              <span className="text-sm text-slate-500 font-medium">/mês</span>
            </div>
            <div className="text-xs text-slate-400 mb-8 font-medium">Gratuito para sempre</div>
            
            <div className="text-sm font-bold text-violet-700 mb-4">1 usuário (administrador)</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Gestão de O.S.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Relatórios em PDF</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
              Começar Grátis
            </button>
          </div>

          {/* BÁSICO */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Básico</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Organização, segurança e controle.</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-lg font-bold text-slate-800">R$</span>
              <span className="text-6xl font-black text-slate-900 mx-1 tracking-tighter">19</span>
              <span className="text-sm text-slate-500 font-medium">,90/mês</span>
            </div>
            <div className="text-xs text-slate-400 mb-8 font-medium">Cobrado mensalmente</div>
            
            <div className="text-sm font-bold text-violet-700 mb-4">3 usuários (administrador, atendente, técnico)</div>
            <div className="bg-violet-50 text-violet-700 text-xs font-bold py-2 px-3 rounded-lg mb-4 text-center">
              + Tudo do Free, mais:
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Checklist Customizável</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Gerenciamento de Permissões</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition-colors">
              Assinar Básico
            </button>
          </div>

          {/* PREMIUM (MAIS VENDIDO) */}
          <div className="bg-white rounded-[2rem] border-2 border-violet-500 shadow-2xl shadow-violet-500/20 p-8 relative flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-[11px] font-black uppercase tracking-widest py-1.5 px-5 rounded-full shadow-md">
              Mais Vendido
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Premium</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Ideal para quem quer tudo que uma assistência precisa.</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-lg font-bold text-slate-800">R$</span>
              <span className="text-6xl font-black text-slate-900 mx-1 tracking-tighter">29</span>
              <span className="text-sm text-slate-500 font-medium">,90/mês</span>
            </div>
            <div className="text-xs text-slate-400 mb-8 font-medium">Cobrado mensalmente</div>
            
            <div className="text-sm font-bold text-violet-700 mb-4">5 usuários (administrador, gerente, atendente, técnicos)</div>
            <div className="bg-violet-50 text-violet-700 text-xs font-bold py-2 px-3 rounded-lg mb-4 text-center">
              + Tudo do Básico, mais:
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Sistema LOTO Digital</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Integração com WhatsApp</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/30">
              Assinar Premium
            </button>
          </div>

          {/* PROFISSIONAL */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Profissional</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Para quem quer extrair o máximo da sua assistência.</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-lg font-bold text-slate-800">R$</span>
              <span className="text-6xl font-black text-slate-900 mx-1 tracking-tighter">49</span>
              <span className="text-sm text-slate-500 font-medium">,90/mês</span>
            </div>
            <div className="text-xs text-slate-400 mb-8 font-medium">Cobrado mensalmente</div>
            
            <div className="text-sm font-bold text-violet-700 mb-4">7 usuários (administrador, gerente, atendente, técnicos)</div>
            <div className="bg-violet-50 text-violet-700 text-xs font-bold py-2 px-3 rounded-lg mb-4 text-center">
              + Tudo do Premium, mais:
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Suporte Prioritário 24/7</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 shrink-0" />
                <span>Treinamento Online</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition-colors">
              Assinar Profissional
            </button>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Comparativo Detalhado</h2>
          <p className="text-slate-500 font-medium">Veja em detalhes o que cada plano inclui</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-8 py-6 bg-slate-50 text-slate-800 font-black uppercase tracking-widest text-sm">Recurso</th>
                <th className="px-6 py-6 bg-slate-50 text-slate-800 font-black uppercase tracking-widest text-xs text-center">Free</th>
                <th className="px-6 py-6 bg-slate-50 text-slate-800 font-black uppercase tracking-widest text-xs text-center">Básico</th>
                <th className="px-6 py-6 bg-violet-50 text-violet-700 font-black uppercase tracking-widest text-xs text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="bg-[#F59E0B] text-white text-[10px] py-0.5 px-3 rounded-full tracking-wider">MAIS VENDIDO</span>
                    <span>Premium</span>
                  </div>
                </th>
                <th className="px-6 py-6 bg-slate-50 text-slate-800 font-black uppercase tracking-widest text-xs text-center">Profissional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{f.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{f.desc}</p>
                  </td>
                  {f.plans.map((p, j) => (
                    <td key={j} className={cn("px-6 py-6 text-center", j === 2 && "bg-violet-50/30")}>
                      {p ? (
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-violet-700/10 flex items-center justify-center">
                            <Check size={14} className="text-violet-800" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-200">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const LandingHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-violet-700 flex items-center justify-center text-white font-black">E</div>
        <span className="text-white font-black uppercase tracking-tighter text-lg">EletromGuide</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a href="#recursos" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Recursos</a>
        <a href="#planos" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Planos</a>
        <a href="#faq" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Dúvidas</a>
      </nav>
      <button className="px-5 py-2.5 rounded-xl bg-violet-800 text-white font-black text-sm shadow-lg shadow-violet-800/30 hover:scale-105 active:scale-95 transition-all">
        Testar Grátis
      </button>
    </div>
  </header>
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
        setError('Credenciais inválidas.');
      }
    } else {
        setError('Apenas usuários autorizados podem se cadastrar nesta demonstração.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0814] flex flex-col font-sans overflow-hidden">
      <LandingHeader />
      
      {/* Hero Section */}
      <div className="flex flex-col pt-20">
        <div className="relative w-full p-6 md:p-12 flex flex-col items-center justify-center text-center overflow-hidden min-h-[70vh]"
          style={{ background: '#0f0814' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated Blobs - Lilás e Verde discretos */}
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute"
              style={{
                width: '600px', height: '600px',
                left: '-10%', top: '10%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)'
              }}
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 120, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute"
              style={{
                width: '500px', height: '500px',
                right: '10%', bottom: '10%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)'
              }}
            />
          </div>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(15,8,20,0.2) 0%, rgba(15,8,20,0.4) 40%, rgba(15,8,20,0.8) 80%, rgba(15,8,20,1) 100%)'
          }} />

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl pt-10 flex flex-col items-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter text-center"
            >
              Hub de serviços técnicos.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">Tudo na palma de sua mão.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 mb-10 leading-relaxed font-medium max-w-2xl text-base md:text-xl text-center"
            >
              Sua central completa para gestão de ordens de serviço, relatórios técnicos e conformidade NR em um só lugar.
            </motion.p>

            <div className="mb-16 flex flex-col sm:flex-row gap-4 justify-center w-full">
              <button 
                onClick={() => {
                  onLogin({
                    id: 'trial-user',
                    name: 'Usuário de Teste',
                    email: 'teste@eletromguide.com.br',
                    role: 'TECNICO',
                    companyId: 'trial-comp'
                  }, 7);
                }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 mx-auto"
              >
                Testar Grátis Agora
                <ArrowRight size={20} className="ml-1" />
              </button>
            </div>

            <div id="recursos" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{[
                { icon: ShieldCheck, title: "Conformidade NR", desc: "Digitalização de NRs com validação em tempo real." },
                { icon: FileText, title: "Relatórios Digitais", desc: "Emissão instantânea de PTs e APRs." },
                { icon: Lock, title: "Sistema LOTO", desc: "Isolamento de energia com fluxogramas." },
                { icon: BarChart3, title: "Indicadores de Risco", desc: "Análise preditiva de incidentes." },
                { icon: Calculator, title: "Calculadoras Técnicas", desc: "Cálculo de medidas e conversões." },
                { icon: MessageSquare, title: "Blog Integrado", desc: "Gerenciamento de posts do WordPress." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + (idx * 0.08) }}
                  className="relative flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 group cursor-default"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                  whileHover={{ borderColor: 'rgba(109,40,217,0.4)', background: 'rgba(109,40,217,0.08)' }}
                >
                  <div className="p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform bg-violet-700/10">
                    <feature.icon size={22} className="text-violet-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold mb-1 text-sm md:text-base">{feature.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        
        </div>

      {/* Comparison Table Section */}
      <ComparisonTable />

      {/* FAQ Section */}
      <FAQSection />

      {/* FOOTER */}
      <footer className="bg-[#2D2561] py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo_eletro.fw.png" alt="Logo" className="h-10" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              A plataforma definitiva para engenheiros e técnicos que buscam excelência operacional e conformidade total.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-violet-700 hover:border-violet-700/50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-violet-700 hover:border-violet-700/50 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-violet-700 hover:border-violet-700/50 transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Produto</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><a href="#recursos" className="hover:text-violet-700 transition-colors">Funcionalidades</a></li>
              <li><a href="#planos" className="hover:text-violet-700 transition-colors">Planos e Preços</a></li>
              <li><a href="#" className="hover:text-violet-700 transition-colors">Segurança</a></li>
              <li><a href="#" className="hover:text-violet-700 transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><a href="#faq" className="hover:text-violet-700 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-violet-700 transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-violet-700 transition-colors">Comunidade</a></li>
              <li><a href="#" className="hover:text-violet-700 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Novidades</h4>
            <p className="text-slate-500 text-sm mb-4">Inscreva-se para receber atualizações técnicas e novidades.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white text-sm outline-none focus:border-violet-700/50 transition-all"
              />
              <button className="absolute right-2 top-1.5 p-1 text-violet-700 hover:scale-110 transition-transform">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            © 2026 EletromGuide — todos os direitos reservados
          </p>
          <div className="flex gap-8 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            <a href="#" className="hover:text-slate-400 transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>

      {/* TOP HEADER BAR - fixo com glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 md:h-18 pointer-events-none"
        style={{ background: 'rgba(45,37,97,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
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
          <div className="absolute inset-0 bg-[#1E1B4B]/90 backdrop-blur-xl" />
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
                className="w-full bg-gradient-to-r from-brand-green to-violet-800 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-brand-green/20 transition-all flex items-center justify-center gap-3"
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
        case 'blog': return <BlogModule />;
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
      <div className={cn("min-h-screen flex bg-slate-50", !isAuthenticated && "bg-[#1E1B4B]")}>
      {!isAuthenticated ? (
        <div className="flex-1">{renderContent()}</div>
      ) : (
        <>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <motion.div 
              initial={false}
              animate={{ 
                width: isSidebarOpen ? 256 : 0,
                opacity: isSidebarOpen ? 1 : 0
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sticky top-0 h-screen overflow-hidden border-r border-white/5"
            >
              <div className="w-64 h-full">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
              </div>
            </motion.div>
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
                  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile setIsOpen={setIsSidebarOpen} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-100 px-6 py-3 flex justify-between items-center"
              style={{ background: 'rgba(248,250,252,0.85)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="p-2.5 hover:bg-slate-200/50 rounded-xl transition-all text-slate-600 hover:scale-105 active:scale-95 group"
                    title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
                  >
                    <Menu size={20} className={cn("transition-transform duration-300", isSidebarOpen && "rotate-90")} />
                  </button>
                  
                  <div className="flex items-center gap-2 md:hidden">
                    <BrandLogo size={24} iconClassName="text-violet-700" />
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">EletromGuide</h1>
                  </div>

                  {!isMobile && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest ml-2">
                      <span className="text-slate-900">EletromGuide</span>
                      <span className="text-slate-300 font-normal">/</span>
                      <span className="text-slate-500 font-black">{activeTab.replace(/-/g, ' ')}</span>
                    </div>
                  )}
                </div>

                {/* Global Search */}
                {!isMobile && (
                  <div className="relative max-w-md w-full group hidden lg:block">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-700 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Pesquisar ferramentas, NRs, ou PTs..." 
                      className="w-full bg-slate-100/50 border border-transparent focus:border-violet-700/20 focus:bg-white rounded-xl py-2 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-black text-slate-500">
                      ⌘K
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border-r border-slate-100 pr-4 mr-1">
                  <button className="p-2.5 text-slate-400 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all relative">
                    <Activity size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-violet-700 rounded-full border-2 border-slate-50" />
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all">
                    <Library size={18} />
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all">
                    <Settings size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-tight">{currentUser.name}</p>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="w-1.5 h-1.5 bg-violet-700 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</span>
                    </div>
                  </div>
                  
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-violet-700/20 transition-transform group-hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #6D28D9, #5B21B6)' }}>
                      {currentUser.name.charAt(0)}
                    </div>
                    {trialEndDate && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center">
                        <Zap size={8} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-violet-800 hover:text-white transition-all text-[10px] font-semibold">
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
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </>
  );
}
