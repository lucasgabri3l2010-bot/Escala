"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Button, Card, Input, Toast, useToast } from "@/components/ui";
import { alimentacaoDoDia, useApp, HOJE } from "@/lib/store";
import { formatarData } from "@/lib/utils";

export default function AlimentacaoPage() {
  const { state, dispatch } = useApp();
  const [data, setData] = React.useState(HOJE);
  const [msg, show] = useToast();
  const calc = alimentacaoDoDia(state.permanencias, data, state.funcionarios);
  const finalizada = !!state.alimentacaoFinalizada[data];
  const cafe = Math.round(calc.marmitas * 0.2);
  const jantar = Math.round(calc.marmitas * 0.5);

  function finalizar() {
    dispatch({ type: "FINALIZAR_ALIM", data });
    show("Quantidade finalizada e registrada no histórico.");
  }

  return (
    <Shell titulo="Alimentação" descricao="Cálculo automático a partir de quem confirmou permanência">
      <div className="flex items-center gap-2 mb-4">
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="!w-auto" />
        {finalizada && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Finalizada</span>}
        <Button className="ml-auto" disabled={finalizada} onClick={finalizar}>Finalizar quantidade</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[{ n: "Marmitas", v: calc.marmitas }, { n: "Lanches", v: calc.lanches }, { n: "Café", v: cafe }, { n: "Jantar", v: jantar }, { n: "Total", v: calc.marmitas + calc.lanches + cafe + jantar }].map((c) => (
          <Card key={c.n} className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{c.n}</p><p className="text-3xl font-extrabold text-zinc-900 mt-1">{c.v}</p></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-bold mb-1">Alimentação de {formatarData(data)}</h3>
          <p className="text-sm text-zinc-500 mb-3">Contabiliza apenas quem respondeu <b>SIM, VOU FICAR</b>. Quem respondeu NÃO ou está pendente não entra no cálculo. Cancelamento de escala atualiza automaticamente.</p>
          <ul className="text-sm space-y-1.5 max-h-80 overflow-auto">
            {calc.lista.map((l, i) => <li key={i} className="flex justify-between border border-zinc-100 rounded-lg px-3 py-2"><span>{l.nome}</span><span className="text-zinc-500 text-xs">{l.motivo}</span></li>)}
            {calc.lista.length === 0 && <li className="text-zinc-500">Ninguém confirmado para este dia.</li>}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-bold mb-2">Regras por período</h3>
          <ul className="text-sm space-y-2">
            {Object.entries(state.config.refeicaoPorPeriodo).map(([k, v]) => <li key={k} className="flex justify-between border-b border-zinc-50 pb-2"><span className="capitalize text-zinc-500">{k}</span><b>{v}</b></li>)}
          </ul>
          <p className="text-xs text-zinc-400 mt-3">Configure os tipos em Configurações → Alimentação. Tipos ativos: {state.config.tiposAlimentacao.join(", ")}</p>
        </Card>
      </div>
      <Toast msg={msg} />
    </Shell>
  );
}
