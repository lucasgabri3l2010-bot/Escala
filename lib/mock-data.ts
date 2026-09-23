import { Cobertura, Escala, Funcionario, HistoricoItem, Notificacao, Permanencia, Plantao, Setor, Troca, AppConfig } from "./types";

export const HOJE = "2026-09-23";

export const setoresIniciais: Setor[] = [
  { id: "set-ti", nome: "TI", responsavel: "João Silva", cor: "#ea580c" },
  { id: "set-sup", nome: "Suporte", responsavel: "Carlos Oliveira", cor: "#0284c7" },
  { id: "set-fin", nome: "Financeiro", responsavel: "Ana Paula", cor: "#16a34a" },
  { id: "set-ope", nome: "Operacional", responsavel: "Marcos Santos", cor: "#7c3aed" },
  { id: "set-log", nome: "Logística", responsavel: "Lucas Ferreira", cor: "#ca8a04" },
  { id: "set-rh", nome: "Recursos Humanos", responsavel: "Juliana Costa", cor: "#db2777" }
];

export const funcionariosIniciais: Funcionario[] = [
  { id: "f-joao", nome: "João Silva", cargo: "Analista", setorId: "set-ti", status: "Ativo", telefone: "(11) 98811-2233", email: "joao.silva@empresa.com", admissao: "2022-03-14", avatarCor: "#ea580c" },
  { id: "f-carlos", nome: "Carlos Oliveira", cargo: "Técnico de Suporte", setorId: "set-sup", status: "Ativo", telefone: "(11) 97722-3344", email: "carlos.oliveira@empresa.com", admissao: "2021-07-02", avatarCor: "#0284c7" },
  { id: "f-marcos", nome: "Marcos Santos", cargo: "Operador", setorId: "set-ope", status: "Ativo", telefone: "(11) 96633-4455", email: "marcos.santos@empresa.com", admissao: "2023-01-20", avatarCor: "#7c3aed" },
  { id: "f-lucas", nome: "Lucas Ferreira", cargo: "Motorista", setorId: "set-log", status: "Ativo", telefone: "(11) 95544-5566", email: "lucas.ferreira@empresa.com", admissao: "2022-11-05", avatarCor: "#ca8a04" },
  { id: "f-rafael", nome: "Rafael Souza", cargo: "Analista Sênior", setorId: "set-ti", status: "Ativo", telefone: "(11) 94455-6677", email: "rafael.souza@empresa.com", admissao: "2020-05-11", avatarCor: "#0d9488" },
  { id: "f-ana", nome: "Ana Paula", cargo: "Assistente Financeiro", setorId: "set-fin", status: "Ativo", telefone: "(11) 93366-7788", email: "ana.paula@empresa.com", admissao: "2023-06-19", avatarCor: "#16a34a" },
  { id: "f-juliana", nome: "Juliana Costa", cargo: "Gerente de RH", setorId: "set-rh", status: "Férias", telefone: "(11) 92277-8899", email: "juliana.costa@empresa.com", admissao: "2019-09-01", avatarCor: "#db2777" },
  { id: "f-pedro", nome: "Pedro Almeida", cargo: "Auxiliar Operacional", setorId: "set-ope", status: "Ativo", telefone: "(11) 91188-9900", email: "pedro.almeida@empresa.com", admissao: "2024-02-12", avatarCor: "#475569" },
  { id: "f-camila", nome: "Camila Rocha", cargo: "Atendente", setorId: "set-sup", status: "Afastado", telefone: "(11) 90099-1122", email: "camila.rocha@empresa.com", admissao: "2023-10-03", avatarCor: "#e11d48" },
  { id: "f-tiago", nome: "Tiago Mendes", cargo: "Conferente", setorId: "set-log", status: "Ativo", telefone: "(11) 98910-2233", email: "tiago.mendes@empresa.com", admissao: "2024-05-27", avatarCor: "#4d7c0f" }
];

export const escalasIniciais: Escala[] = [
  { id: "e-001", funcionarioId: "f-joao", setorId: "set-ti", cargo: "Analista", data: HOJE, inicio: "07:30", fim: "17:30", tipo: "Normal", status: "Ativo", observacoes: "Monitoramento de servidores", exigePermanencia: true },
  { id: "e-002", funcionarioId: "f-carlos", setorId: "set-sup", cargo: "Técnico de Suporte", data: HOJE, inicio: "08:00", fim: "18:00", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-003", funcionarioId: "f-marcos", setorId: "set-ope", cargo: "Operador", data: HOJE, inicio: "06:00", fim: "14:00", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-004", funcionarioId: "f-lucas", setorId: "set-log", cargo: "Motorista", data: HOJE, inicio: "09:00", fim: "19:00", tipo: "Plantão", status: "Ativo", exigePermanencia: false },
  { id: "e-005", funcionarioId: "f-rafael", setorId: "set-ti", cargo: "Analista Sênior", data: HOJE, inicio: "13:45", fim: "22:00", tipo: "Cobertura", status: "Ativo", observacoes: "Cobertura de Carlos no período da tarde", exigePermanencia: true },
  { id: "e-006", funcionarioId: "f-ana", setorId: "set-fin", cargo: "Assistente Financeiro", data: HOJE, inicio: "08:00", fim: "17:00", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-007", funcionarioId: "f-pedro", setorId: "set-ope", cargo: "Auxiliar Operacional", data: HOJE, inicio: "14:00", fim: "22:00", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-008", funcionarioId: "f-tiago", setorId: "set-log", cargo: "Conferente", data: HOJE, inicio: "07:00", fim: "15:00", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-009", funcionarioId: "f-joao", setorId: "set-ti", cargo: "Analista", data: "2026-09-24", inicio: "07:30", fim: "17:30", tipo: "Normal", status: "Ativo", exigePermanencia: true },
  { id: "e-010", funcionarioId: "f-carlos", setorId: "set-sup", cargo: "Técnico de Suporte", data: "2026-09-24", inicio: "08:00", fim: "18:00", tipo: "Sobreaviso", status: "Pendente", exigePermanencia: false },
  { id: "e-011", funcionarioId: "f-juliana", setorId: "set-rh", cargo: "Gerente de RH", data: HOJE, inicio: "08:00", fim: "17:00", tipo: "Férias", status: "Ativo", exigePermanencia: false },
  { id: "e-012", funcionarioId: "f-camila", setorId: "set-sup", cargo: "Atendente", data: HOJE, inicio: "08:00", fim: "14:00", tipo: "Ausência", status: "Cancelada", observacoes: "Atestado médico", exigePermanencia: false }
];

export const permanenciasIniciais: Permanencia[] = [
  { id: "p-001", escalaId: "e-001", funcionarioId: "f-joao", data: HOJE, vaiFicar: true, motivo: "Finalização de atividade", respondidoEm: "2026-09-23 08:12" },
  { id: "p-002", escalaId: "e-002", funcionarioId: "f-carlos", data: HOJE, vaiFicar: null },
  { id: "p-003", escalaId: "e-003", funcionarioId: "f-marcos", data: HOJE, vaiFicar: true, motivo: "Hora extra", respondidoEm: "2026-09-23 07:55" },
  { id: "p-004", escalaId: "e-005", funcionarioId: "f-rafael", data: HOJE, vaiFicar: true, motivo: "Cobertura de outro funcionário", respondidoEm: "2026-09-23 08:40" },
  { id: "p-005", escalaId: "e-006", funcionarioId: "f-ana", data: HOJE, vaiFicar: false, respondidoEm: "2026-09-23 08:05" },
  { id: "p-006", escalaId: "e-007", funcionarioId: "f-pedro", data: HOJE, vaiFicar: true, motivo: "Demanda do setor", respondidoEm: "2026-09-23 08:31" },
  { id: "p-007", escalaId: "e-008", funcionarioId: "f-tiago", data: HOJE, vaiFicar: null }
];

export const plantoesIniciais: Plantao[] = [
  { id: "pl-01", funcionarioId: "f-lucas", setorId: "set-log", data: HOJE, inicio: "09:00", fim: "19:00", tipo: "Rota interestadual", status: "Em andamento", observacoes: "Entrega prioritária" },
  { id: "pl-02", funcionarioId: "f-rafael", setorId: "set-ti", data: HOJE, inicio: "18:00", fim: "23:59", tipo: "Sobreaviso técnico", status: "Agendado" },
  { id: "pl-03", funcionarioId: "f-carlos", setorId: "set-sup", data: "2026-09-24", inicio: "08:00", fim: "20:00", tipo: "Suporte estendido", status: "Agendado" },
  { id: "pl-04", funcionarioId: "f-marcos", setorId: "set-ope", data: "2026-09-22", inicio: "22:00", fim: "06:00", tipo: "Turno noite", status: "Concluído" }
];

export const coberturasIniciais: Cobertura[] = [
  { id: "c-01", ausenteId: "f-carlos", coberturaId: "f-rafael", data: HOJE, inicio: "13:45", fim: "18:00", motivo: "Ausência em consulta", status: "Ativa" },
  { id: "c-02", ausenteId: "f-camila", coberturaId: "f-carlos", data: HOJE, inicio: "08:00", fim: "14:00", motivo: "Atestado médico", status: "Ativa" }
];

export const trocasIniciais: Troca[] = [
  { id: "t-01", solicitanteId: "f-carlos", envolvidoId: "f-rafael", escalaOriginalId: "e-002", novaData: "2026-09-25", novoInicio: "08:00", novoFim: "18:00", motivo: "Compromisso pessoal", status: "Pendente", criadaEm: "2026-09-22 16:20" },
  { id: "t-02", solicitanteId: "f-marcos", envolvidoId: "f-pedro", escalaOriginalId: "e-003", novaData: "2026-09-24", novoInicio: "06:00", novoFim: "14:00", motivo: "Troca de turno", status: "Aprovada", criadaEm: "2026-09-21 10:05" }
];

export const notificacoesIniciais: Notificacao[] = [
  { id: "n-01", titulo: "Nova escala criada", descricao: "Escala de João Silva para 24/09 foi criada.", tipo: "Nova escala", lida: false, criadaEm: "2026-09-23 07:30" },
  { id: "n-02", titulo: "Solicitação de troca", descricao: "Carlos Oliveira solicitou troca com Rafael Souza.", tipo: "Solicitação de troca", lida: false, criadaEm: "2026-09-22 16:21" },
  { id: "n-03", titulo: "Permanência pendente", descricao: "3 funcionários ainda não responderam se vão ficar.", tipo: "Permanência pendente", lida: false, criadaEm: "2026-09-23 08:00" },
  { id: "n-04", titulo: "Cobertura criada", descricao: "Rafael Souza assumiu cobertura de Carlos Oliveira.", tipo: "Cobertura criada", lida: true, criadaEm: "2026-09-23 08:42" },
  { id: "n-05", titulo: "Escala alterada", descricao: "Administrador alterou a escala de Ana Paula.", tipo: "Escala alterada", lida: true, criadaEm: "2026-09-22 15:10" }
];

export const historicoInicial: HistoricoItem[] = [
  { id: "h-01", usuario: "João Silva", acao: "confirmou permanência", modulo: "Permanência", detalhe: "Motivo: Finalização de atividade", dataHora: "2026-09-23 08:12" },
  { id: "h-02", usuario: "Carlos Oliveira", acao: "solicitou troca de escala", modulo: "Trocas", detalhe: "Com Rafael Souza para 25/09", dataHora: "2026-09-22 16:20" },
  { id: "h-03", usuario: "Rafael Souza", acao: "assumiu cobertura", modulo: "Coberturas", detalhe: "Cobertura de Carlos Oliveira 13:45 — 18:00", dataHora: "2026-09-23 08:42" },
  { id: "h-04", usuario: "Administrador", acao: "alterou escala", modulo: "Escalas", detalhe: "Escala de Ana Paula ajustada para 08:00 — 17:00", dataHora: "2026-09-22 15:10" },
  { id: "h-05", usuario: "Administrador", acao: "criou escala", modulo: "Escalas", detalhe: "Nova escala de João Silva para 24/09", dataHora: "2026-09-23 07:30" }
];

export const configInicial: AppConfig = {
  empresaNome: "Escala+",
  prazoResposta: "09:00",
  refeicaoPorPeriodo: { manha: "Café da manhã", almoco: "Marmita", tarde: "Lanche", noite: "Jantar" },
  tiposAlimentacao: ["Marmita", "Lanche", "Café da manhã", "Almoço", "Jantar", "Ceia"],
  motivosPermanencia: ["Hora extra", "Finalização de atividade", "Demanda do setor", "Cobertura de outro funcionário", "Reunião", "Manutenção", "Operação", "Outro"]
};
