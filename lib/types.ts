export type Role = "Administrador" | "Supervisor" | "Funcionário";

export type StatusFuncionario = "Ativo" | "Inativo" | "Férias" | "Afastado";

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  setorId: string;
  status: StatusFuncionario;
  telefone: string;
  email: string;
  admissao: string;
  avatarCor: string;
}

export interface Setor {
  id: string;
  nome: string;
  responsavel: string;
  cor: string;
}

export type TipoEscala =
  | "Normal"
  | "Plantão"
  | "Sobreaviso"
  | "Cobertura"
  | "Atendimento"
  | "Folga"
  | "Férias"
  | "Ausência";

export type StatusEscala = "Ativo" | "Pendente" | "Cancelada" | "Concluída";

export interface Escala {
  id: string;
  funcionarioId: string;
  setorId: string;
  cargo: string;
  data: string; // yyyy-mm-dd
  inicio: string; // HH:mm
  fim: string; // HH:mm
  tipo: TipoEscala;
  status: StatusEscala;
  observacoes?: string;
  exigePermanencia: boolean;
}

export interface Plantao {
  id: string;
  funcionarioId: string;
  setorId: string;
  data: string;
  inicio: string;
  fim: string;
  tipo: string;
  status: "Agendado" | "Em andamento" | "Concluído";
  observacoes?: string;
}

export interface Cobertura {
  id: string;
  ausenteId: string;
  coberturaId: string;
  data: string;
  inicio: string;
  fim: string;
  motivo: string;
  status: "Ativa" | "Concluída" | "Cancelada";
}

export type StatusTroca = "Pendente" | "Aceita" | "Recusada" | "Aprovada" | "Cancelada";

export interface Troca {
  id: string;
  solicitanteId: string;
  envolvidoId: string;
  escalaOriginalId: string;
  novaData: string;
  novoInicio: string;
  novoFim: string;
  motivo: string;
  status: StatusTroca;
  criadaEm: string;
}

export type MotivoPermanencia =
  | "Hora extra"
  | "Finalização de atividade"
  | "Demanda do setor"
  | "Cobertura de outro funcionário"
  | "Reunião"
  | "Manutenção"
  | "Operação"
  | "Outro";

export interface Permanencia {
  id: string;
  escalaId: string;
  funcionarioId: string;
  data: string;
  vaiFicar: boolean | null; // null = pendente
  motivo?: MotivoPermanencia | string;
  motivoDetalhe?: string;
  respondidoEm?: string;
}

export interface AlimentoItem {
  funcionarioId: string;
  nome: string;
  tipo: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  lida: boolean;
  criadaEm: string;
}

export interface HistoricoItem {
  id: string;
  usuario: string;
  acao: string;
  modulo: string;
  detalhe: string;
  dataHora: string;
}

export interface AppConfig {
  empresaNome: string;
  prazoResposta: string; // HH:mm
  refeicaoPorPeriodo: Record<string, string>;
  tiposAlimentacao: string[];
  motivosPermanencia: string[];
  responsavelMarmitas: string;
  cardapioFoto: string | null;
  cardapioAtualizadoEm: string | null;
}

export interface Usuario {
  nome: string;
  email: string;
  cargo: Role;
}
