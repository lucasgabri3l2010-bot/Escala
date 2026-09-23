"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Card, Input, Modal, Select } from "@/components/ui";
import { useApp, useFuncionarioMap } from "@/lib/store";
import { formatarData } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Escala } from "@/lib/types";

type Visao = "Dia" | "Semana" | "Mês";

export default function CalendarioPage() {
  const { state } = useApp();
  const fmap = useFuncionarioMap();
  const [visao, setVisao] = React.useState<Visao>("Semana");
  const [ref, setRef] = React.useState("2026-09-23");
  const [filtro, setFiltro] = React.useState("");
  const [detalhe, setDetalhe] = React.useState<Escala | null>(null);

  const dias: string[] = React.useMemo(() => {
    const base = new Date(ref + "T12:00:00");
    if (visao === "Dia") return [ref];
    if (visao === "Semana") {
      const dow = (base.getDay() + 6) % 7;
      const seg = new Date(base); seg.setDate(base.getDate() - dow);
      return Array.from({ length: 7 }, (_, i) => { const d = new Date(seg); d.setDate(seg.getDate() + i); return d.toISOString().slice(0, 10); });
    }
    const y = base.getFullYear(), m = base.getMonth();
    const primeiro = new Date(y, m, 1);
    const startDow = (primeiro.getDay() + 6) % 7;
    const ini = new Date(y, m, 1 - startDow);
    return Array.from({ length: 35 }, (_, i) => { const d = new Date(ini); d.setDate(ini.getDate() + i); return d.toISOString().slice(0, 10); });
  }, [ref, visao]);

  const porDia = (d: string) => state.escalas.filter((e) => e.data === d && (fmap[e.funcionarioId]?.nome.toLowerCase().includes(filtro.toLowerCase()) ?? true));

  function mover(dir: number) {
    const b = new Date(ref + "T12:00:00");
    b.setDate(b.getDate() + (visao === "Dia" ? dir : visao === "Semana" ? dir * 7 : dir * 30));
    setRef(b.toISOString().slice(0, 10));
  }

  return (
    <Shell titulo="Calendário" descricao="Visualize escalas por dia, semana ou mês">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">{(["Dia", "Semana", "Mês"] as Visao[]).map((v) => <button key={v} onClick={() => setVisao(v)} className={`px-3 py-1.5 text-sm rounded-md ${visao === v ? "bg-white shadow-sm font-semibold" : "text-zinc-500"}`}>{v}</button>)}</div>
        <button onClick={() => mover(-1)} className="p-2 rounded-lg border hover:bg-zinc-50"><ChevronLeft size={16} /></button>
        <Input type="date" value={ref} onChange={(e) => setRef(e.target.value)} className="!w-auto" />
        <button onClick={() => mover(1)} className="p-2 rounded-lg border hover:bg-zinc-50"><ChevronRight size={16} /></button>
        <Input placeholder="Buscar funcionário..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="!w-52 ml-auto" />
      </div>
      <div className={`grid gap-2 ${visao === "Dia" ? "grid-cols-1" : visao === "Semana" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-7" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"}`}>
        {dias.map((d) => (
          <Card key={d} className="p-2.5 min-h-[140px]">
            <p className={`text-xs font-bold ${d === "2026-09-23" ? "text-brand-700" : "text-zinc-500"}`}>{formatarData(d)}</p>
            <div className="space-y-1.5 mt-2">
              {porDia(d).map((e) => (
                <button key={e.id} onClick={() => setDetalhe(e)} className="w-full text-left text-xs rounded-lg border border-zinc-200 px-2 py-1.5 hover:border-brand-400 hover:bg-brand-50 transition">
                  <p className="font-semibold truncate">{fmap[e.funcionarioId]?.nome}</p>
                  <p className="text-zinc-500">{e.inicio} — {e.fim}</p>
                  <Badge value={e.tipo} />
                </button>
              ))}
              {porDia(d).length === 0 && <p className="text-[11px] text-zinc-300">Sem escalas</p>}
            </div>
          </Card>
        ))}
      </div>
      <Modal aberto={!!detalhe} titulo="Detalhe da escala" onFechar={() => setDetalhe(null)}>
        {detalhe && (
          <div className="text-sm space-y-2">
            <p><b>Funcionário:</b> {fmap[detalhe.funcionarioId]?.nome}</p>
            <p><b>Data:</b> {formatarData(detalhe.data)} • {detalhe.inicio} — {detalhe.fim}</p>
            <p className="flex gap-2"><Badge value={detalhe.tipo} /><Badge value={detalhe.status} /></p>
            <p><b>Obs:</b> {detalhe.observacoes || "—"}</p>
            <p className="text-xs text-zinc-500">Para editar, use a página de Escalas. Drag-and-drop com validação pode ser ativado aqui no futuro sem quebrar o formulário.</p>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
