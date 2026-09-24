"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Button, Card, Input, Select } from "@/components/ui";
import { alimentacaoDoDia, useApp, useFuncionarioMap } from "@/lib/store";
import { baixarCSV, formatarData } from "@/lib/utils";

export default function RelatoriosPage() {
  const { state } = useApp();
  const fmap = useFuncionarioMap();
  const [tipo, setTipo] = React.useState("Permanências");
  const [ini, setIni] = React.useState("2026-09-22");
  const [fim, setFim] = React.useState("2026-09-24");

  const noPeriodo = (d: string) => d >= ini && d <= fim;

  function dadosCSV(): string[][] {
    if (tipo === "Escalas") return [["Funcionário", "Data", "Horário", "Tipo", "Status"], ...state.escalas.filter((e) => noPeriodo(e.data)).map((e) => [fmap[e.funcionarioId]?.nome ?? "", e.data, `${e.inicio}-${e.fim}`, e.tipo, e.status])];
    if (tipo === "Permanências") return [["Funcionário", "Data", "Vai ficar", "Período", "Refeição", "Motivo"], ...state.declaracoes.filter((d) => noPeriodo(d.data)).map((d) => [fmap[d.funcionarioId]?.nome ?? "", d.data, d.vaiFicar ? "Sim" : "Não", String(d.periodo ?? "—"), d.vaiFicar ? (d.periodo === "Noite" ? "Lanche" : "Marmita") : "—", String(d.motivo ?? "")])];
    if (tipo === "Alimentação") { const l = alimentacaoDoDia(state.declaracoes, state.funcionarios, state.setores, ini); return [["Funcionário", "Período", "Refeição", "Motivo"], ...l.lista.map((x) => [x.nome, x.periodo, x.periodo === "Noite" ? "Lanche" : "Marmita", x.motivo])]; }
    if (tipo === "Trocas") return [["Solicitante", "Envolvido", "Nova data", "Status"], ...state.trocas.map((t) => [fmap[t.solicitanteId]?.nome ?? "", fmap[t.envolvidoId]?.nome ?? "", t.novaData, t.status])];
    return [["Módulo", "Qtd"], [tipo, "—"]];
  }

  const perms = state.declaracoes.filter((d) => noPeriodo(d.data));
  const motivos: Record<string, number> = {};
  perms.filter((d) => d.vaiFicar).forEach((d) => { const m = `${d.periodo ?? "Almoço"} • ${String(d.motivo ?? "Outro")}`; motivos[m] = (motivos[m] ?? 0) + 1; });
  const totMot = Object.values(motivos).reduce((a, b) => a + b, 0);

  return (
    <Shell titulo="Relatórios" descricao="Exporte e analise a operação">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Select value={tipo} onChange={(e) => setTipo(e.target.value)} className="!w-auto">{["Escalas", "Permanências", "Alimentação", "Trocas", "Plantões", "Coberturas"].map((t) => <option key={t}>{t}</option>)}</Select>
        <Input type="date" value={ini} onChange={(e) => setIni(e.target.value)} className="!w-auto" />
        <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="!w-auto" />
        <div className="ml-auto flex gap-2 no-print">
          <Button variant="outline" onClick={() => baixarCSV(`relatorio-${tipo}.csv`, dadosCSV())}>Exportar CSV</Button>
          <Button variant="outline" onClick={() => baixarCSV(`relatorio-${tipo}.xls`, dadosCSV())}>Exportar Excel</Button>
          <Button onClick={() => window.print()}>Exportar PDF</Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-bold mb-2">Resumo de permanência ({formatarData(ini)} — {formatarData(fim)})</h3>
          <p className="text-sm text-zinc-600">Ficaram: <b>{perms.filter((d) => d.vaiFicar).length}</b> • Não ficaram: <b>{perms.filter((d) => !d.vaiFicar).length}</b> • Marmitas: <b>{perms.filter((d) => d.vaiFicar && d.periodo === "Almoço").length}</b> • Lanches: <b>{perms.filter((d) => d.vaiFicar && d.periodo === "Noite").length}</b></p>
          <div className="mt-3 space-y-2">
            {Object.entries(motivos).map(([m, q]) => { const pct = totMot ? Math.round((q / totMot) * 100) : 0; return (<div key={m}><div className="flex justify-between text-sm"><span>{m}</span><b>{pct}%</b></div><div className="h-2 bg-zinc-100 rounded-full mt-1"><div className="h-full bg-brand-600 rounded-full" style={{ width: `${pct}%` }} /></div></div>); })}
            {totMot === 0 && <p className="text-sm text-zinc-400">Sem motivos no período.</p>}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-bold mb-2">Prévia ({tipo})</h3>
          <div className="overflow-auto max-h-72"><table className="w-full text-xs"><tbody>{dadosCSV().slice(0, 12).map((l, i) => <tr key={i} className={i === 0 ? "font-bold bg-zinc-50" : "border-t"}>{l.map((c, j) => <td key={j} className="px-2 py-1.5">{c}</td>)}</tr>)}</tbody></table></div>
          <p className="text-[11px] text-zinc-400 mt-2">Exportação mockada no front-end: CSV/Excel baixam arquivo real; PDF usa impressão.</p>
        </Card>
      </div>
    </Shell>
  );
}
