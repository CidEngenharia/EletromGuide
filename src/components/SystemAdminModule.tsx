import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Pause, 
  Play, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  Activity,
  CreditCard,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import BlogAdminModule from './BlogAdminModule';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Básico' | 'Profissional' | 'Enterprise';
  status: 'Online' | 'Offline';
  accessStatus: 'Ativo' | 'Pausado';
  lastLogin: string;
}

const MOCK_MANAGED_USERS: ManagedUser[] = [
  { id: '1', name: 'Sidney Sales', email: 'sidney@cidengenharia.com', plan: 'Enterprise', status: 'Online', accessStatus: 'Ativo', lastLogin: 'Agora' },
  { id: '2', name: 'Ana Paula', email: 'ana@teste.com', plan: 'Profissional', status: 'Offline', accessStatus: 'Ativo', lastLogin: '2 horas atrás' },
  { id: '3', name: 'Carlos Tech', email: 'carlos@manutencao.com', plan: 'Básico', status: 'Online', accessStatus: 'Ativo', lastLogin: '5 min atrás' },
  { id: '4', name: 'Lucas Oliveira', email: 'lucas@free.com', plan: 'Free', status: 'Offline', accessStatus: 'Pausado', lastLogin: '3 dias atrás' },
  { id: '5', name: 'Marcos Silva', email: 'marcos@eletrica.com', plan: 'Profissional', status: 'Online', accessStatus: 'Ativo', lastLogin: '10 min atrás' },
  { id: '6', name: 'Julia Costa', email: 'julia@projeto.com', plan: 'Básico', status: 'Offline', accessStatus: 'Ativo', lastLogin: '1 dia atrás' },
];

export default function SystemAdminModule() {
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'blog'>('users');


  const stats = {
    total: users.length,
    online: users.filter(u => u.status === 'Online').length,
    offline: users.filter(u => u.status === 'Offline').length,
    plans: {
      free: users.filter(u => u.plan === 'Free').length,
      basico: users.filter(u => u.plan === 'Básico').length,
      profissional: users.filter(u => u.plan === 'Profissional').length,
      enterprise: users.filter(u => u.plan === 'Enterprise').length,
    }
  };

  const planData = [
    { name: 'Free', value: stats.plans.free, color: '#94a3b8' },
    { name: 'Básico', value: stats.plans.basico, color: '#8b5cf6' },
    { name: 'Profissional', value: stats.plans.profissional, color: '#6d28d9' },
    { name: 'Enterprise', value: stats.plans.enterprise, color: '#10b981' },
  ];

  const handleToggleAccess = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, accessStatus: u.accessStatus === 'Ativo' ? 'Pausado' : 'Ativo' } 
        : u
    ));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário permanentemente?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Admin Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gerenciamento do Sistema</h2>
          <p className="text-slate-500 font-medium">Painel administrativo global - Acesso Restrito</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
            <Activity size={16} />
            Sistema Operacional
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('users')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest",
            activeTab === 'users' ? "bg-violet-100 text-violet-800" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Users size={18} />
          Usuários
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest",
            activeTab === 'blog' ? "bg-violet-100 text-violet-800" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <MessageSquare size={18} />
          Blog
        </button>
      </div>

      {activeTab === 'blog' ? (
        <BlogAdminModule />
      ) : (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-violet-50 text-violet-700 rounded-xl">
              <Users size={20} />
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total de Usuários</p>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck size={20} />
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">AO VIVO</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Usuários Online</p>
          <p className="text-3xl font-black text-slate-900">{stats.online}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
              <UserMinus size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Usuários Offline</p>
          <p className="text-3xl font-black text-slate-900">{stats.offline}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Faturamento Est.</p>
          <p className="text-3xl font-black text-slate-900">R$ 1.240</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Users size={18} className="text-violet-700" />
              Lista de Usuários
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-violet-500/20 outline-none font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plano</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                        user.plan === 'Enterprise' ? "bg-emerald-100 text-emerald-700" :
                        user.plan === 'Profissional' ? "bg-violet-100 text-violet-700" :
                        user.plan === 'Básico' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          user.status === 'Online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                        )} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleAccess(user.id)}
                          className={cn(
                            "p-2 rounded-lg transition-all hover:scale-105 active:scale-95",
                            user.accessStatus === 'Ativo' ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          )}
                          title={user.accessStatus === 'Ativo' ? "Pausar Acesso" : "Reativar Acesso"}
                        >
                          {user.accessStatus === 'Ativo' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all hover:scale-105 active:scale-95"
                          title="Excluir Usuário"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Distribution Chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-violet-700" />
            Distribuição de Planos
          </h3>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {planData.map((plan, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm font-bold text-slate-700">{plan.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{plan.value} usuários</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Quick Settings */}
      <div className="bg-[#1a1635] rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Settings size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <AlertCircle size={24} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Notificações do Sistema</h4>
              <p className="text-white/60 text-sm font-medium">Existem 2 faturas pendentes que requerem revisão manual.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-brand-green text-slate-900 font-black rounded-xl hover:scale-105 active:scale-95 transition-all">
            Ver Pendências
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
