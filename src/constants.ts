import { ServiceType, NR, APRRisk, ChecklistItem } from './types';

export const NR_HANDBOOK: NR[] = [
  {
    code: 'NR-01',
    title: 'Disposições Gerais e Gerenciamento de Riscos Ocupacionais',
    summary: 'Estabelece as diretrizes e requisitos para o gerenciamento de riscos ocupacionais e as medidas de prevenção em Segurança e Saúde no Trabalho (SST).',
    details: [
      'Implementação do PGR (Programa de Gerenciamento de Riscos).',
      'Identificação de perigos e avaliação de riscos.',
      'Elaboração de plano de ação e medidas de prevenção.',
      'Responsabilidades do empregador e dos trabalhadores.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1'
  },
  {
    code: 'NR-06',
    title: 'Equipamentos de Proteção Individual (EPI)',
    summary: 'Estabelece os requisitos para a comercialização, fornecimento e uso de EPI.',
    details: [
      'Obrigatoriedade do fornecimento gratuito pelo empregador.',
      'Exigência de Certificado de Aprovação (CA) válido.',
      'Treinamento sobre o uso adequado, guarda e conservação.',
      'Substituição imediata quando danificado ou extraviado.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-6-nr-6'
  },
  {
    code: 'NR-10',
    title: 'Segurança em Instalações e Serviços em Eletricidade',
    summary: 'Estabelece os requisitos e condições mínimas para garantir a segurança dos trabalhadores que interagem em instalações elétricas.',
    details: [
      'Medidas de controle: desenergização, aterramento e isolamento.',
      'Exigência de habilitação, qualificação e autorização.',
      'Uso de vestimentas condizentes com o risco de arco elétrico.',
      'Sinalização de segurança e bloqueios (LOTO).'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-10-nr-10'
  },
  {
    code: 'NR-12',
    title: 'Segurança no Trabalho em Máquinas e Equipamentos',
    summary: 'Estabelece referências técnicas, princípios fundamentais e medidas de proteção para garantir a saúde e a integridade física dos trabalhadores.',
    details: [
      'Item 12.1.9: Devem-se considerar as características das máquinas, o processo, a apreciação de riscos e o estado da técnica.',
      'Arranjo físico e instalações.',
      'Sistemas de segurança e dispositivos de parada de emergência.',
      'Manutenção, inspeção, preparação, ajuste e reparo.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-12-nr-12'
  },
  {
    code: 'NR-18',
    title: 'Segurança e Saúde no Trabalho na Indústria da Construção',
    summary: 'Diretrizes de ordem administrativa, de planejamento e de organização para a implementação de medidas de controle e sistemas preventivos de segurança na construção.',
    details: [
      'Elaboração do PGR para canteiros de obras.',
      'Proteção contra quedas de altura.',
      'Segurança em escavações, fundações e desmonte de rochas.',
      'Instalações elétricas temporárias e máquinas.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-18-nr-18'
  },
  {
    code: 'NR-20',
    title: 'Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis',
    summary: 'Estabelece requisitos mínimos para a gestão da segurança e saúde no trabalho contra os fatores de risco de acidentes provenientes das atividades de extração, produção, armazenamento, transferência, manuseio e manipulação de inflamáveis e líquidos combustíveis.',
    details: [
      'Item 20.7: Obrigatoriedade de elaborar e documentar análises de riscos para instalações classes I, II e III.',
      'Capacitação e treinamento de trabalhadores.',
      'Controle de fontes de ignição.',
      'Plano de Resposta a Emergências.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-20-nr-20'
  },
  {
    code: 'NR-33',
    title: 'Segurança e Saúde no Trabalho em Espaços Confinados',
    summary: 'Requisitos mínimos para identificação de espaços confinados e o reconhecimento, avaliação, monitoramento e controle dos riscos existentes.',
    details: [
      'Emissão obrigatória da PET (Permissão de Entrada e Trabalho).',
      'Monitoramento contínuo da atmosfera.',
      'Presença obrigatória do Vigia durante toda a atividade.',
      'Equipamentos de ventilação e resgate específicos.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-33-nr-33'
  },
  {
    code: 'NR-35',
    title: 'Trabalho em Altura',
    summary: 'Requisitos mínimos e medidas de proteção para o trabalho em altura, envolvendo o planejamento, a organização e a execução.',
    details: [
      'Considera-se trabalho em altura toda atividade executada acima de 2,00m do nível inferior.',
      'Exigência de Análise de Risco (AR) e Permissão de Trabalho (PT).',
      'Sistemas de Proteção Contra Quedas (SPCQ).',
      'Capacitação e treinamento bienal obrigatório.'
    ],
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-35-nr-35'
  }
];

export const ALL_NRS_LIST = [
  "NR 01 - Disposições Gerais",
  "NR 03 - Embargo e Interdição",
  "NR 04 - Serviços Especializados em Eng. de Segurança e em Medicina do Trabalho",
  "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio",
  "NR 06 - Equipamentos de Proteção Individual - EPI",
  "NR 07 - Programas de Controle Médico de Saúde Ocupacional",
  "NR 08 - Edificações",
  "NR 09 - Avaliação, e Controle das Exposições Ocupacionais a Agentes Físicos, Químicos e Biológicos",
  "NR 10 - Segurança em Instalações e Serviços em Eletricidade",
  "NR 11 - Transporte, Movimentação, Armazenagem e Manuseio de Materiais",
  "NR 12 - Máquinas e Equipamentos",
  "NR 13 - Caldeiras, Vasos de Pressão e Tubulações e Tanques Metálicos de Armazenamento",
  "NR 14 - Fornos",
  "NR 15 - Atividades e Operações Insalubres",
  "NR 16 - Atividades e Operações Perigosas",
  "NR 17 - Ergonomia",
  "NR 18 - Segurança e Saúde no Trabalho na Indústria da Construção",
  "NR 19 - Explosivos",
  "NR 20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis",
  "NR 21 - Trabalhos a Céu Aberto",
  "NR 22 - Segurança e Saúde Ocupacional na Mineração",
  "NR 23 - Proteção Contra Incêndios",
  "NR 24 - Condições Sanitárias e de Conforto nos Locais de Trabalho",
  "NR 25 - Resíduos Industriais",
  "NR 26 - Sinalização de Segurança",
  "NR 28 - Fiscalização e Penalidades",
  "NR 29 - Segurança e Saúde no Trabalho Portuário",
  "NR 30 - Segurança e Saúde no Trabalho Aquaviário",
  "NR 31 - Segurança e Saúde no Trabalho na Agricultura, Pecuária Silvicultura, Exploração Florestal e Aquicultura",
  "NR 32 - Segurança e Saúde no Trabalho em Estabelecimentos de Saúde",
  "NR 33 - Segurança e Saúde no Trabalho em Espaços Confinados",
  "NR 34 - Condições e Meio Ambiente de Trabalho na Indústria da Construção, Reparação e Desmonte Naval",
  "NR 35 - Trabalho em Altura",
  "NR 36 - Segurança e Saúde no Trabalho em Empresas de Abate e Processamento de Carnes e Derivados",
  "NR 37 - Segurança e Saúde em Plataformas de Petróleo",
  "NR 38 - Segurança e Saúde no Trabalho nas Atividades de Limpeza Urbana e Manejo de Resíduos Sólidos"
];

export const DEFAULT_PPE = [
  'Capacete com jugular',
  'Bota de segurança',
  'Óculos de proteção',
  'Luvas de proteção',
  'Protetor auricular',
  'Cinto de segurança tipo paraquedista',
  'Talabarte duplo com absorvedor',
  'Máscara de proteção respiratória',
  'Avental de raspa',
  'Uniforme de brim'
];

export const DEFAULT_EPC = [
  'Cones de sinalização',
  'Fita zebrada',
  'Placas de advertência',
  'Extintor de incêndio',
  'Barreiras físicas / Grades',
  'Redes de proteção',
  'Linha de vida horizontal / vertical',
  'Escoramento de valas',
  'Tapumes',
  'Iluminação de emergência'
];

export const SERVICE_CONFIG: Record<ServiceType, {
  label: string;
  nrs: string[];
  defaultRisks: Partial<APRRisk>[];
  checklist: Partial<ChecklistItem>[];
}> = {
  ELETRICO: {
    label: 'Serviço Elétrico',
    nrs: ['NR-10'],
    defaultRisks: [
      { hazard: 'Choque Elétrico', mitigation: 'Uso de EPI dielétrico, aterramento' },
      { hazard: 'Arco Elétrico', mitigation: 'Vestimenta FR, distanciamento' }
    ],
    checklist: [
      { label: 'Teste de ausência de tensão realizado?', required: true, isCritical: true },
      { label: 'LOTO aplicado e sinalizado?', required: true, isCritical: true },
      { label: 'Equipe mínima de 2 pessoas?', required: true, isCritical: true }
    ]
  },
  ALTURA: {
    label: 'Trabalho em Altura',
    nrs: ['NR-35'],
    defaultRisks: [
      { hazard: 'Queda de nível diferente', mitigation: 'Uso de cinto de segurança, linha de vida' },
      { hazard: 'Queda de objetos', mitigation: 'Isolamento de área, rede de proteção' }
    ],
    checklist: [
      { label: 'Linha de vida aprovada e inspecionada?', required: true, isCritical: true },
      { label: 'Treinamento NR-35 válido para todos?', required: true, isCritical: true },
      { label: 'Plano de resgate disponível no local?', required: true, isCritical: true }
    ]
  },
  QUENTE: {
    label: 'Trabalho a Quente',
    nrs: ['NR-18', 'NR-34'],
    defaultRisks: [
      { hazard: 'Incêndio / Explosão', mitigation: 'Remoção de inflamáveis, extintor no local' },
      { hazard: 'Queimaduras', mitigation: 'Uso de avental de raspa, luvas' }
    ],
    checklist: [
      { label: 'Área livre de materiais inflamáveis?', required: true, isCritical: true },
      { label: 'Extintor de incêndio carregado no local?', required: true, isCritical: true },
      { label: 'Vigilante de incêndio posicionado?', required: true, isCritical: false }
    ]
  },
  CONFINADO: {
    label: 'Espaço Confinado',
    nrs: ['NR-33'],
    defaultRisks: [
      { hazard: 'Asfixia / Atmosfera IPVS', mitigation: 'Medição de gases contínua, ventilação' },
      { hazard: 'Soterramento', mitigation: 'Escoramento, vigia externo' }
    ],
    checklist: [
      { label: 'PET (Permissão de Entrada e Trabalho) emitida?', required: true, isCritical: true },
      { label: 'Medição de gases realizada e dentro dos limites?', required: true, isCritical: true },
      { label: 'Vigia designado e treinado no local?', required: true, isCritical: true }
    ]
  },
  ESCAVACAO: {
    label: 'Escavação',
    nrs: ['NR-18'],
    defaultRisks: [
      { hazard: 'Desmoronamento', mitigation: 'Escoramento, taludamento' },
      { hazard: 'Rompimento de tubulações', mitigation: 'Sondagem prévia, as-built' }
    ],
    checklist: [
      { label: 'Escoramento instalado conforme projeto?', required: true, isCritical: true },
      { label: 'Sinalização de borda instalada?', required: true, isCritical: false }
    ]
  },
  ICAMENTO: {
    label: 'Içamento de Carga',
    nrs: ['NR-11', 'NR-18'],
    defaultRisks: [
      { hazard: 'Queda de carga', mitigation: 'Inspeção de acessórios, isolamento' },
      { hazard: 'Tombamento do equipamento', mitigation: 'Patolamento em solo firme' }
    ],
    checklist: [
      { label: 'Plano de Rigging aprovado?', required: true, isCritical: true },
      { label: 'Acessórios de içamento inspecionados?', required: true, isCritical: true },
      { label: 'Área de giro isolada?', required: true, isCritical: true }
    ]
  }
};
