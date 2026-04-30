export type UserRole = 'TECNICO' | 'SUPERVISOR' | 'GERENTE' | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
}

export type ServiceType = 
  | 'ELETRICO' 
  | 'ALTURA' 
  | 'QUENTE' 
  | 'CONFINADO' 
  | 'ESCAVACAO' 
  | 'ICAMENTO';

export interface NR {
  code: string;
  title: string;
  summary: string;
  details: string[];
  link?: string;
}

export interface APRRisk {
  id: string;
  hazard: string;           // Aspectos e Perigos
  cause: string;            // Causas
  consequence: string;      // Impacto ou Consequências
  frequency: string;        // Classe de frequencia
  severity: string;         // Grau de severidade
  riskLevel: string;        // Nível de risco
  mitigation: string;       // Ações preventivas / mitigadoras
  responsible: string;      // Responsável
}

export interface APR {
  id: string;
  object: string;           // Objeto de análise/ local
  observation: string;      // Observação
  referenceDocs: string;    // Documentos de Referência
  team: string;             // Equipe de APR
  areaGestora: string;      // Área Gestora
  approvalDate: string;     // Data da Aprovação
  risks: APRRisk[];
  status: 'PENDENTE' | 'APROVADA' | 'ARQUIVADA';
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCritical: boolean;
}

export interface PT {
  id: string;
  aprId?: string;
  gravityPotential: 'A' | 'B' | 'C';
  date: string;
  time: string;
  laborType: 'INTERNA' | 'EXTERNA';
  companyName: string;
  location: string;
  equipmentInvolved: string;
  isEquipmentOff: boolean;
  tagNumber?: string;
  impedimentNumber?: string;
  description: string;
  potentialRisks: string[];
  equipmentUsed: string[];
  mandatoryPrecautions: { label: string; status: 'S' | 'NA' | null }[];
  specificPrecautions: {
    category: string;
    items: { label: string; status: 'S' | 'NA' | null }[];
  }[];
  epis: string[];
  additionalRecommendations?: string;
  authorizedWorkers: { name: string; signature: string }[];
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'ENCERRADA' | 'CANCELADA';
}

export interface LOTO {
  id: string;
  equipment: string;
  energyType: string;
  lockNumber: string;
  responsibleId: string;
  status: 'BLOQUEADO' | 'LIBERADO';
  steps: {
    label: string;
    completed: boolean;
  }[];
}

export interface EPI {
  id: string;
  name: string;
  ca: string;
  deliveryDate: string;
  expiryDate: string;
  employeeName: string;
  status: 'VALIDO' | 'VENCIDO' | 'ALERTA';
}
