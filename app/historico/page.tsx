"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Card, Input, Select } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function HistoricoPage() {
  const { state } = useApp();
  const [busca, setBusca] = React.useState("");
  const [modulo, setModulo] = React.useState("Todos");
  const mods = ["Todos", ...Array.from(new Set(state.historico.map((h) => h.modulo)))];
  const lista = state.historico.filter((h) => (modulo === "Todos" || h.modulo === modulo) && (h.usuario + h.acao + h.detalhe).toLowerCase().includes(busca.toLowerCase()));

  return (
    <Shell titulo="Histórico" descricao="Auditoria de todas as alterações">
      <div className="flex gap-2 mb-4">
        <Input placeholder="Buscar usuário, ação..." value={busca} onChange={(e) => setBusca(e.target.value)} className="!w-64" />
        <Select value={modulo} onChange={(e) => setModulo(e.target.value)} className="!w-auto">{mods.map((m) => <option key={m}>{m}</option>)}</Select>
      </div>
      <Card className="divide-y divide-zinc-100">
        {lista.map((h) => (
          <div key={h.id} className="px-4 py-3 text-sm">
            <p><b>{h.usuario}</b> {h.acao} <span className="text-xs bg-zinc-100 rounded-full px-2 py-0.5 ml-1">{h.modulo}</span></p>
            <p className="text-zinc-500 text-xs mt-0.5">{h.detalhe} • {h.dataHora}</p>
          </div>
        ))}
        {lista.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Nenhum registro.</p>}
      </Card>
    </Shell>
  );
}
