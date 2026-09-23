"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Button, Card, Input, Select } from "@/components/ui";
import { useApp } from "@/lib/store";
import { Bell } from "lucide-react";

export default function NotificacoesPage() {
  const { state, dispatch } = useApp();
  const [filtro, setFiltro] = React.useState("Todas");
  const [busca, setBusca] = React.useState("");
  const lista = state.notificacoes.filter((n) => (filtro === "Todas" || (filtro === "Não lidas" ? !n.lida : n.lida)) && (n.titulo + n.descricao).toLowerCase().includes(busca.toLowerCase()));

  return (
    <Shell titulo="Notificações" descricao="Centro de avisos do sistema">
      <div className="flex flex-wrap gap-2 mb-4">
        <Input placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="!w-60" />
        <Select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="!w-auto"><option>Todas</option><option>Não lidas</option><option>Lidas</option></Select>
        <Button variant="outline" className="ml-auto" onClick={() => dispatch({ type: "NOT_ALL_READ" })}>Marcar todas como lidas</Button>
      </div>
      <div className="space-y-2">
        {lista.map((n) => (
          <Card key={n.id} className="p-4 flex gap-3 items-start">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.lida ? "bg-zinc-100 text-zinc-400" : "bg-brand-50 text-brand-600"}`}><Bell size={17} /></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{n.titulo} {!n.lida && <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full ml-1">Nova</span>}</p>
              <p className="text-sm text-zinc-500">{n.descricao}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{n.tipo} • {n.criadaEm}</p>
            </div>
            {!n.lida && <Button variant="ghost" className="!text-xs" onClick={() => dispatch({ type: "NOT_READ", id: n.id })}>Marcar como lida</Button>}
          </Card>
        ))}
        {lista.length === 0 && <Card className="p-8 text-center text-sm text-zinc-500">Nenhuma notificação.</Card>}
      </div>
    </Shell>
  );
}
