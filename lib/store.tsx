"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { AppConfig, Cobertura, Conta, Declaracao, Escala, Funcionario, HistoricoItem, Notificacao, Permanencia, Plantao, Setor, Troca, Usuario } from "./types";
import { HOJE, coberturasIniciais, configInicial, contasIniciais, escalasIniciais, funcionariosIniciais, historicoInicial, notificacoesIniciais, permanenciasIniciais, plantoesIniciais, setoresIniciais, trocasIniciais } from "./mock-data";
import { agoraBR, uid } from "./utils";

interface State {
  user: Usuario;
  logado: boolean;
  funcionarios: Funcionario[];
  setores: Setor[];
  escalas: Escala[];
  plantoes: Plantao[];
  coberturas: Cobertura[];
  trocas: Troca[];
  permanencias: Permanencia[];
  notificacoes: Notificacao[];
  historico: HistoricoItem[];
  config: AppConfig;
  alimentacaoFinalizada: Record<string, boolean>;
  contas: Conta[];
  declaracoes: Declaracao[];
}

type Action =
  | { type: "LOGIN"; user: Usuario }
  | { type: "LOGOUT" }
  | { type: "ADD_FUNC"; f: Funcionario }
  | { type: "UPD_FUNC"; f: Funcionario }
  | { type: "DEL_FUNC"; id: string }
  | { type: "ADD_SETOR"; s: Setor }
  | { type: "UPD_SETOR"; s: Setor }
  | { type: "DEL_SETOR"; id: string }
  | { type: "ADD_ESCALA"; e: Escala }
  | { type: "UPD_ESCALA"; e: Escala }
  | { type: "DEL_ESCALA"; id: string }
  | { type: "ADD_PLANTAO"; p: Plantao }
  | { type: "UPD_PLANTAO"; p: Plantao }
  | { type: "DEL_PLANTAO"; id: string }
  | { type: "ADD_COBERTURA"; c: Cobertura }
  | { type: "UPD_COBERTURA"; c: Cobertura }
  | { type: "DEL_COBERTURA"; id: string }
  | { type: "ADD_TROCA"; t: Troca }
  | { type: "UPD_TROCA"; t: Troca }
  | { type: "RESP_PERM"; id: string; vaiFicar: boolean; motivo?: string; motivoDetalhe?: string }
  | { type: "ADD_PERM"; p: Permanencia }
  | { type: "NOT_READ"; id: string }
  | { type: "NOT_ALL_READ" }
  | { type: "ADD_NOT"; n: Notificacao }
  | { type: "ADD_HIST"; h: HistoricoItem }
  | { type: "SET_CONFIG"; c: AppConfig }
  | { type: "SET_CARDAPIO"; foto: string }
  | { type: "REMOVE_CARDAPIO" }
  | { type: "SIGNUP"; conta: Conta; funcionario: Funcionario }
  | { type: "DECLARAR"; d: Declaracao }
  | { type: "FINALIZAR_ALIM"; data: string }
  | { type: "HYDRATE"; s: State };

const initialState: State = {
  user: { nome: "", email: "", cargo: "Funcionário" },
  logado: false,
  funcionarios: funcionariosIniciais,
  setores: setoresIniciais,
  escalas: escalasIniciais,
  plantoes: plantoesIniciais,
  coberturas: coberturasIniciais,
  trocas: trocasIniciais,
  permanencias: permanenciasIniciais,
  notificacoes: notificacoesIniciais,
  historico: historicoInicial,
  config: configInicial,
  alimentacaoFinalizada: {},
  contas: contasIniciais,
  declaracoes: []
};

function pushHist(s: State, usuario: string, acao: string, modulo: string, detalhe: string): HistoricoItem[] {
  return [{ id: uid("h"), usuario, acao, modulo, detalhe, dataHora: agoraBR() }, ...s.historico].slice(0, 300);
}

function pushNot(s: State, titulo: string, descricao: string, tipo: string): Notificacao[] {
  return [{ id: uid("n"), titulo, descricao, tipo, lida: false, criadaEm: agoraBR() }, ...s.notificacoes].slice(0, 200);
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "LOGIN":
      return { ...s, user: a.user, logado: true };
    case "LOGOUT":
      return { ...s, user: { nome: "", email: "", cargo: "Funcionário" as const }, logado: false };
    case "HYDRATE":
      return { ...initialState, ...a.s };
    case "ADD_FUNC":
      return { ...s, funcionarios: [a.f, ...s.funcionarios], historico: pushHist(s, s.user.nome, "criou funcionário", "Funcionários", `Funcionário ${a.f.nome} criado`), notificacoes: pushNot(s, "Novo funcionário", `${a.f.nome} foi cadastrado.`, "Nova escala") };
    case "UPD_FUNC":
      return { ...s, funcionarios: s.funcionarios.map((f) => (f.id === a.f.id ? a.f : f)), historico: pushHist(s, s.user.nome, "editou funcionário", "Funcionários", `Dados de ${a.f.nome} atualizados`) };
    case "DEL_FUNC":
      return { ...s, funcionarios: s.funcionarios.filter((f) => f.id !== a.id), historico: pushHist(s, s.user.nome, "excluiu funcionário", "Funcionários", `Funcionário ${a.id} removido`) };
    case "ADD_SETOR":
      return { ...s, setores: [a.s, ...s.setores], historico: pushHist(s, s.user.nome, "criou setor", "Setores", `Setor ${a.s.nome} criado`) };
    case "UPD_SETOR":
      return { ...s, setores: s.setores.map((x) => (x.id === a.s.id ? a.s : x)), historico: pushHist(s, s.user.nome, "editou setor", "Setores", `Setor ${a.s.nome} atualizado`) };
    case "DEL_SETOR":
      return { ...s, setores: s.setores.filter((x) => x.id !== a.id), historico: pushHist(s, s.user.nome, "excluiu setor", "Setores", `Setor ${a.id} removido`) };
    case "ADD_ESCALA": {
      const permanencias = a.e.exigePermanencia
        ? [...s.permanencias, { id: uid("p"), escalaId: a.e.id, funcionarioId: a.e.funcionarioId, data: a.e.data, vaiFicar: null }]
        : s.permanencias;
      return { ...s, escalas: [a.e, ...s.escalas], permanencias, historico: pushHist(s, s.user.nome, "criou escala", "Escalas", `Escala de ${a.e.funcionarioId} em ${a.e.data}`), notificacoes: pushNot(s, "Nova escala criada", `Escala ${a.e.tipo} em ${a.e.data} criada.`, "Nova escala") };
    }
    case "UPD_ESCALA": {
      const antes = s.escalas.find((e) => e.id === a.e.id);
      let permanencias = s.permanencias;
      // Se cancelou a escala, remove a permanência da contagem de alimentação (mantém registro mas zera resposta)
      if (antes && antes.status !== "Cancelada" && a.e.status === "Cancelada") {
        permanencias = permanencias.map((p) => (p.escalaId === a.e.id ? { ...p, vaiFicar: false, motivo: "Escala cancelada" } : p));
      }
      if (antes && !antes.exigePermanencia && a.e.exigePermanencia && !permanencias.some((p) => p.escalaId === a.e.id)) {
        permanencias = [...permanencias, { id: uid("p"), escalaId: a.e.id, funcionarioId: a.e.funcionarioId, data: a.e.data, vaiFicar: null }];
      }
      return {
        ...s,
        escalas: s.escalas.map((e) => (e.id === a.e.id ? a.e : e)),
        permanencias,
        historico: pushHist(s, s.user.nome, "alterou escala", "Escalas", `Escala ${a.e.id} atualizada (${antes?.status} → ${a.e.status})`),
        notificacoes: pushNot(s, "Escala alterada", `Escala ${a.e.id} foi atualizada. Alimentação recalculada.`, "Escala alterada")
      };
    }
    case "DEL_ESCALA": {
      const alvo = s.escalas.find((e) => e.id === a.id);
      return {
        ...s,
        escalas: s.escalas.filter((e) => e.id !== a.id),
        permanencias: s.permanencias.map((p) => (p.escalaId === a.id ? { ...p, vaiFicar: false, motivo: "Escala excluída" } : p)),
        historico: pushHist(s, s.user.nome, "excluiu escala", "Escalas", `Escala ${a.id} (${alvo?.data ?? ""}) excluída. Alimentação atualizada.`),
        notificacoes: pushNot(s, "Escala excluída", `Escala ${a.id} excluída. Verifique alimentação.`, "Escala alterada")
      };
    }
    case "ADD_PLANTAO":
      return { ...s, plantoes: [a.p, ...s.plantoes], historico: pushHist(s, s.user.nome, "criou plantão", "Plantões", `Plantão ${a.p.data} criado`), notificacoes: pushNot(s, "Novo plantão", `Plantão em ${a.p.data} criado.`, "Plantão próximo") };
    case "UPD_PLANTAO":
      return { ...s, plantoes: s.plantoes.map((p) => (p.id === a.p.id ? a.p : p)), historico: pushHist(s, s.user.nome, "alterou plantão", "Plantões", `Plantão ${a.p.id} atualizado`) };
    case "DEL_PLANTAO":
      return { ...s, plantoes: s.plantoes.filter((p) => p.id !== a.id), historico: pushHist(s, s.user.nome, "excluiu plantão", "Plantões", `Plantão ${a.id} removido`) };
    case "ADD_COBERTURA":
      return { ...s, coberturas: [a.c, ...s.coberturas], historico: pushHist(s, s.user.nome, "criou cobertura", "Coberturas", `Cobertura em ${a.c.data}`), notificacoes: pushNot(s, "Cobertura criada", `Cobertura em ${a.c.data} criada.`, "Cobertura criada") };
    case "UPD_COBERTURA":
      return { ...s, coberturas: s.coberturas.map((c) => (c.id === a.c.id ? a.c : c)), historico: pushHist(s, s.user.nome, "alterou cobertura", "Coberturas", `Cobertura ${a.c.id} atualizada`) };
    case "DEL_COBERTURA":
      return { ...s, coberturas: s.coberturas.filter((c) => c.id !== a.id), historico: pushHist(s, s.user.nome, "excluiu cobertura", "Coberturas", `Cobertura ${a.id} removida`) };
    case "ADD_TROCA":
      return { ...s, trocas: [a.t, ...s.trocas], historico: pushHist(s, s.user.nome, "solicitou troca de escala", "Trocas", `Troca para ${a.t.novaData}`), notificacoes: pushNot(s, "Solicitação de troca", `Nova solicitação de troca para ${a.t.novaData}.`, "Solicitação de troca") };
    case "UPD_TROCA": {
      const extra = a.t.status === "Aprovada" || a.t.status === "Aceita" ? pushNot(s, "Troca aprovada", `Troca ${a.t.id} foi ${a.t.status.toLowerCase()}.`, "Troca aprovada") : s.notificacoes;
      return { ...s, trocas: s.trocas.map((t) => (t.id === a.t.id ? a.t : t)), notificacoes: extra, historico: pushHist(s, s.user.nome, `troca ${a.t.status.toLowerCase()}`, "Trocas", `Troca ${a.t.id}: ${a.t.status}`) };
    }
    case "RESP_PERM": {
      const perm = s.permanencias.find((p) => p.id === a.id);
      if (!perm) return s;
      const upd: Permanencia = { ...perm, vaiFicar: a.vaiFicar, motivo: a.vaiFicar ? a.motivo : undefined, motivoDetalhe: a.motivoDetalhe, respondidoEm: agoraBR() };
      const nome = s.funcionarios.find((f) => f.id === perm.funcionarioId)?.nome ?? perm.funcionarioId;
      return {
        ...s,
        permanencias: s.permanencias.map((p) => (p.id === a.id ? upd : p)),
        historico: pushHist(s, nome, a.vaiFicar ? "confirmou permanência" : "recusou permanência", "Permanência", a.vaiFicar ? `Motivo: ${a.motivo}` : "Não vai ficar")
      };
    }
    case "ADD_PERM":
      return { ...s, permanencias: [a.p, ...s.permanencias] };
    case "NOT_READ":
      return { ...s, notificacoes: s.notificacoes.map((n) => (n.id === a.id ? { ...n, lida: true } : n)) };
    case "NOT_ALL_READ":
      return { ...s, notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })) };
    case "ADD_NOT":
      return { ...s, notificacoes: [a.n, ...s.notificacoes] };
    case "ADD_HIST":
      return { ...s, historico: [a.h, ...s.historico] };
    case "SET_CONFIG":
      return { ...s, config: a.c, historico: pushHist(s, s.user.nome, "alterou configurações", "Configurações", "Configurações atualizadas") };
    case "SET_CARDAPIO":
      return { ...s, config: { ...s.config, cardapioFoto: a.foto, cardapioAtualizadoEm: agoraBR() }, historico: pushHist(s, s.user.nome, "publicou cardápio", "Alimentação", "Foto do cardápio das marmitas atualizada") };
    case "REMOVE_CARDAPIO":
      return { ...s, config: { ...s.config, cardapioFoto: null, cardapioAtualizadoEm: null }, historico: pushHist(s, s.user.nome, "removeu cardápio", "Alimentação", "Foto do cardápio das marmitas removida") };
    case "FINALIZAR_ALIM":
      return { ...s, alimentacaoFinalizada: { ...s.alimentacaoFinalizada, [a.data]: true }, historico: pushHist(s, s.user.nome, "alterou quantidade de refeições", "Alimentação", `Alimentação de ${a.data} finalizada`) };
    case "SIGNUP":
      return {
        ...s,
        contas: [a.conta, ...s.contas],
        funcionarios: [a.funcionario, ...s.funcionarios],
        user: { nome: a.conta.nome, email: a.conta.email, cargo: a.conta.cargo, funcionarioId: a.conta.funcionarioId },
        logado: true,
        historico: pushHist(s, a.conta.nome, "criou conta", "Funcionários", `${a.conta.nome} entrou para a equipe`)
      };
    case "DECLARAR": {
      const existe = s.declaracoes.some((d) => d.funcionarioId === a.d.funcionarioId && d.data === a.d.data);
      const declaracoes = existe
        ? s.declaracoes.map((d) => (d.funcionarioId === a.d.funcionarioId && d.data === a.d.data ? a.d : d))
        : [a.d, ...s.declaracoes];
      const nome = s.funcionarios.find((f) => f.id === a.d.funcionarioId)?.nome ?? s.user.nome;
      return {
        ...s,
        declaracoes,
        historico: pushHist(
          s,
          nome,
          a.d.vaiFicar ? "confirmou permanência" : "recusou permanência",
          "Permanência",
          a.d.vaiFicar ? `${a.d.periodo} • Motivo: ${a.d.motivo}` : "Não vai ficar"
        )
      };
    }
    default:
      return s;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);
const KEY = "escala-plus-v2";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", s: JSON.parse(raw) });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): { state: State; dispatch: React.Dispatch<Action> } {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp fora do provider");
  return v;
}

export function useFuncionarioMap(): Record<string, Funcionario> {
  const { state } = useApp();
  return useMemo(() => Object.fromEntries(state.funcionarios.map((f) => [f.id, f])), [state.funcionarios]);
}

export function useSetorMap(): Record<string, Setor> {
  const { state } = useApp();
  return useMemo(() => Object.fromEntries(state.setores.map((x) => [x.id, x])), [state.setores]);
}

export interface ResumoSetor {
  setorId: string;
  nome: string;
  cor: string;
  marmitas: number;
  lanches: number;
  total: number;
}

// Regra fixa: Almoço = marmita, Noite = lanche. Sem escolha de refeição.
export function alimentacaoDoDia(declaracoes: Declaracao[], funcionarios: Funcionario[], setores: Setor[], data: string): { marmitas: number; lanches: number; total: number; lista: { nome: string; periodo: string; motivo: string }[]; porSetor: ResumoSetor[] } {
  const conf = declaracoes.filter((d) => d.data === data && d.vaiFicar === true);
  const fmap: Record<string, Funcionario> = Object.fromEntries(funcionarios.map((f) => [f.id, f]));
  const marmitas = conf.filter((d) => d.periodo === "Almoço").length;
  const lanches = conf.filter((d) => d.periodo === "Noite").length;
  const lista = conf.map((d) => ({ nome: fmap[d.funcionarioId]?.nome ?? "—", periodo: d.periodo ?? "Almoço", motivo: String(d.motivo ?? "") }));
  const porSetor: ResumoSetor[] = setores.map((s) => {
    const ids = new Set(funcionarios.filter((f) => f.setorId === s.id).map((f) => f.id));
    const dc = conf.filter((d) => ids.has(d.funcionarioId));
    const m = dc.filter((d) => d.periodo === "Almoço").length;
    const l = dc.filter((d) => d.periodo === "Noite").length;
    return { setorId: s.id, nome: s.nome, cor: s.cor, marmitas: m, lanches: l, total: dc.length };
  });
  return { marmitas, lanches, total: marmitas + lanches, lista, porSetor };
}

export { HOJE };
