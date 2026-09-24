import { AppConfig, Cobertura, Escala, Funcionario, HistoricoItem, Notificacao, Permanencia, Plantao, Setor, Troca } from "./types";

export const HOJE = "2026-09-23";

// Sistema em produção: começa sem dados fictícios.
// Cadastre setores, funcionários e escalas para começar a operar.
export const setoresIniciais: Setor[] = [
  { id: "set-ti", nome: "TI", responsavel: "", cor: "#ea580c" },
  { id: "set-sup", nome: "Suporte", responsavel: "", cor: "#0284c7" },
  { id: "set-fin", nome: "Financeiro", responsavel: "", cor: "#16a34a" },
  { id: "set-ope", nome: "Operacional", responsavel: "", cor: "#7c3aed" },
  { id: "set-log", nome: "Logística", responsavel: "", cor: "#ca8a04" },
  { id: "set-rh", nome: "Recursos Humanos", responsavel: "", cor: "#db2777" }
];

export const funcionariosIniciais: Funcionario[] = [];
export const escalasIniciais: Escala[] = [];
export const permanenciasIniciais: Permanencia[] = [];
export const plantoesIniciais: Plantao[] = [];
export const coberturasIniciais: Cobertura[] = [];
export const trocasIniciais: Troca[] = [];
export const notificacoesIniciais: Notificacao[] = [];
export const historicoInicial: HistoricoItem[] = [];

export const configInicial: AppConfig = {
  empresaNome: "Escala+",
  prazoResposta: "09:00",
  refeicaoPorPeriodo: { manha: "Café da manhã", almoco: "Marmita", tarde: "Lanche", noite: "Jantar" },
  tiposAlimentacao: ["Marmita", "Lanche", "Café da manhã", "Almoço", "Jantar", "Ceia"],
  motivosPermanencia: ["Hora extra", "Finalização de atividade", "Demanda do setor", "Cobertura de outro funcionário", "Reunião", "Manutenção", "Operação", "Outro"],
  responsavelMarmitas: "",
  cardapioFoto: null,
  cardapioAtualizadoEm: null
};
