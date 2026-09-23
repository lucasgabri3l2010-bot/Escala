"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Tabs, Toast, useToast } from "@/components/ui";
import { useApp, useSetorMap } from "@/lib/store";
import { formatarData, iniciais } from "@/lib/utils";
import Link from "next/link";

export default function PerfilPage({ params }: { params: { id: string } }) {
  const { state } = useApp();
  const smap = useSetorMap();
  const [aba, setAba] = React.useState("Escalas");
  const [msg] = useToast();
  const f = state.funcionarios.find((x) => x.id === params.id);
  if (!f) return <Shell titulo="Funcionário"><p>Funcionário não encontrado. <Link href="/funcionarios" className="text-brand-700 underline">Voltar</Link></p></Shell>;
  const escalas = state.escalas.filter((e) => e.funcionarioId === f.id);
  const plantoes = state.plantoes.filter((p) => p.funcionarioId === f.id);
  const coberturas = state.coberturas.filter((c) => c.coberturaId === f.id || c.ausenteId === f.id);
  const trocas = state.trocas.filter((t) => t.solicitanteId === f.id || t.envolvidoId === f.id);
  const perms = state.permanencias.filter((p) => p.funcionarioId === f.id);
  const hist = state.historico.filter((h) => h.detalhe.toLowerCase().includes(f.nome.split(" ")[0].toLowerCase()));

  return (
    <Shell titulo={f.nome} descricao={`${f.cargo} • ${smap[f.setorId]?.nome ?? ""}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl text-white font-extrabold flex items-center justify-center text-lg" style={{ background: f.avatarCor }}>{iniciais(f.nome)}</div>
        <div>
          <p className="font-bold text-lg text-zinc-900">{f.nome}</p>
          <p className="text-sm text-zinc-500">{f.email} • {f.telefone} • Admissão {formatarData(f.admissao)}</p>
          <div className="mt-1"><Badge value={f.status} /></div>
        </div>
        <Link href="/funcionarios" className="ml-auto text-sm font-semibold text-brand-700 hover:underline">Voltar</Link>
      </div>
      <Tabs abas={["Escalas", "Plantões", "Coberturas", "Trocas", "Permanências", "Histórico"]} ativa={aba} onTrocar={setAba} />
      <Card className="p-4 mt-3">
        {aba === "Escalas" && (escalas.length ? <ul className="text-sm space-y-2">{escalas.map((e) => <li key={e.id} className="border border-zinc-100 rounded-lg p-2.5">{formatarData(e.data)} • {e.inicio} — {e.fim} • {e.tipo} • <Badge value={e.status} /></li>)}</ul> : <p className="text-sm text-zinc-500">Sem escalas.</p>)}
        {aba === "Plantões" && (plantoes.length ? <ul className="text-sm space-y-2">{plantoes.map((p) => <li key={p.id} className="border border-zinc-100 rounded-lg p-2.5">{formatarData(p.data)} • {p.inicio} — {p.fim} • {p.tipo} • <Badge value={p.status} /></li>)}</ul> : <p className="text-sm text-zinc-500">Sem plantões.</p>)}
        {aba === "Coberturas" && (coberturas.length ? <ul className="text-sm space-y-2">{coberturas.map((c) => <li key={c.id} className="border border-zinc-100 rounded-lg p-2.5">{formatarData(c.data)} • {c.inicio} — {c.fim} • {c.motivo} • <Badge value={c.status} /></li>)}</ul> : <p className="text-sm text-zinc-500">Sem coberturas.</p>)}
        {aba === "Trocas" && (trocas.length ? <ul className="text-sm space-y-2">{trocas.map((t) => <li key={t.id} className="border border-zinc-100 rounded-lg p-2.5">{t.motivo} • nova data {formatarData(t.novaData)} • <Badge value={t.status} /></li>)}</ul> : <p className="text-sm text-zinc-500">Sem trocas.</p>)}
        {aba === "Permanências" && (perms.length ? <ul className="text-sm space-y-2">{perms.map((p) => <li key={p.id} className="border border-zinc-100 rounded-lg p-2.5">{formatarData(p.data)} • {p.vaiFicar === null ? "Pendente" : p.vaiFicar ? `Vai ficar (${p.motivo})` : "Não vai ficar"}</li>)}</ul> : <p className="text-sm text-zinc-500">Sem permanências.</p>)}
        {aba === "Histórico" && (hist.length ? <ul className="text-sm space-y-2">{hist.map((h) => <li key={h.id} className="border border-zinc-100 rounded-lg p-2.5"><b>{h.usuario}</b> {h.acao} — {h.detalhe} <span className="text-zinc-400">• {h.dataHora}</span></li>)}</ul> : <p className="text-sm text-zinc-500">Sem histórico.</p>)}
      </Card>
      <Toast msg={msg} />
    </Shell>
  );
}
