"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Alert, Anel, Badge, Button, Card, CardHeader, Field, Input, Modal, PageHeader, ProgressBar, SearchInput, Select } from "@/components/ui";
import { alimentacaoDoDia, prazosResposta, useApp, useFuncionarioMap, HOJE } from "@/lib/store";
import { useToastPush } from "@/lib/hooks";
import { agoraBR, formatarData, prazoEncerrado, uid } from "@/lib/utils";
import { Check, X, Timer, Sun, MoonStar } from "lucide-react";
import { PeriodoPermanencia } from "@/lib/types";

export default function PermanenciaPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const push = useToastPush();
  const [data, setData] = React.useState(HOJE);
  const [busca, setBusca] = React.useState("");
  const [fSetor, setFSetor] = React.useState("Todos");
  const [fPeriodo, setFPeriodo] = React.useState("Todos");
  const [modal, setModal] = React.useState(false);
  const [vaiFicar, setVaiFicar] = React.useState<boolean>(true);
  const [periodo, setPeriodo] = React.useState<PeriodoPermanencia | "">("");
  const [motivo, setMotivo] = React.useState("");
  const [outro, setOutro] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [negarAlvo, setNegarAlvo] = React.useState<string | null>(null);
  const [motivoNegacao, setMotivoNegacao] = React.useState("");
  const [erroNegar, setErroNegar] = React.useState("");

  function negar(id: string) {
    if (!motivoNegacao.trim()) { setErroNegar("Informe o motivo da negação. É obrigatório."); return; }
    const alvo = doDia.find((d) => d.id === id);
    if (!alvo) return;
    dispatch({ type: "MODERAR", funcionarioId: alvo.funcionarioId, data: alvo.data, aprovada: false, motivoNegacao: motivoNegacao.trim() });
    push("Permanência negada. A pessoa foi retirada da contagem.", "info");
    setNegarAlvo(null);
    setMotivoNegacao("");
    setErroNegar("");
  }

  function aprovar(id: string) {
    const alvo = doDia.find((d) => d.id === id);
    if (!alvo) return;
    dispatch({ type: "MODERAR", funcionarioId: alvo.funcionarioId, data: alvo.data, aprovada: true });
    push("Permanência aprovada novamente.");
  }

  const { almoco: prazoAlmoco, noite: prazoNoite } = prazosResposta(state.config);
  const almocoAberto = !prazoEncerrado(prazoAlmoco);
  const noiteAberta = !prazoEncerrado(prazoNoite);
  const eStaff = state.user.cargo === "Funcionário";
  const podeAlmoco = almocoAberto || !eStaff;
  const podeNoite = noiteAberta || !eStaff;
  const statusPrazo = almocoAberto && noiteAberta ? "abertos" : !almocoAberto && !noiteAberta ? "encerrados" : "parcial";
  const meuId = state.user.funcionarioId;
  const minha = meuId ? state.declaracoes.find((d) => d.funcionarioId === meuId && d.data === data) : undefined;

  const doDia = state.declaracoes.filter((d) => d.data === data);
  const eAdmin = state.user.cargo === "Administrador";
  const sim = doDia.filter((d) => d.vaiFicar && d.moderacao !== "Negada");
  const negadas = doDia.filter((d) => d.vaiFicar && d.moderacao === "Negada");
  const nao = doDia.filter((d) => !d.vaiFicar);
  const ativos = state.funcionarios.filter((f) => f.status === "Ativo");
  const responderam = new Set(doDia.map((d) => d.funcionarioId));
  const pendentes = ativos.filter((f) => !responderam.has(f.id));
  const calc = alimentacaoDoDia(state.declaracoes, state.funcionarios, state.setores, data);

  const lista = sim.filter((d) => {
    const f = fmap[d.funcionarioId];
    if (busca && !(f?.nome.toLowerCase().includes(busca.toLowerCase()))) return false;
    if (fSetor !== "Todos" && f?.setorId !== fSetor) return false;
    if (fPeriodo !== "Todos" && d.periodo !== fPeriodo) return false;
    return true;
  });

  function abrir(v: boolean) {
    if (!meuId) { push("Sua conta não está vinculada a um funcionário.", "erro"); return; }
    if (v && !podeAlmoco && !podeNoite) { push("Prazos encerrados. Resposta bloqueada.", "erro"); return; }
    if (!v && !podeNoite) { push(`Prazo encerrado (${prazoNoite}). Resposta bloqueada.`, "erro"); return; }
    setVaiFicar(v);
    setPeriodo(minha?.periodo ?? "");
    setMotivo(minha?.motivo && minha.motivo !== "Outro" ? minha.motivo : "");
    setOutro(minha?.motivo === "Outro" ? minha.motivoDetalhe ?? "" : "");
    setErro("");
    setModal(true);
  }

  function confirmar() {
    if (!meuId) return;
    if (vaiFicar) {
      if (!periodo) { setErro("Escolha Almoço ou Noite."); return; }
      if (periodo === "Almoço" && !podeAlmoco) { setErro(`Prazo do almoço encerrado (${prazoAlmoco}).`); return; }
      if (periodo === "Noite" && !podeNoite) { setErro(`Prazo da noite encerrado (${prazoNoite}).`); return; }
      if (!motivo) { setErro("Selecione o motivo. É obrigatório para confirmar SIM."); return; }
      if (motivo === "Outro" && !outro.trim()) { setErro("Descreva o motivo no campo 'Informe o motivo'."); return; }
      dispatch({ type: "DECLARAR", d: { id: minha?.id ?? uid("d"), funcionarioId: meuId, data, vaiFicar: true, periodo, motivo, motivoDetalhe: motivo === "Outro" ? outro.trim() : undefined, respondidoEm: agoraBR() } });
      push(`Registrado: você fica ${periodo === "Almoço" ? "no almoço (marmita)" : "à noite (lanche)"}.`);
    } else {
      if (!podeNoite) { push(`Prazo encerrado (${prazoNoite}). Resposta bloqueada.`, "erro"); return; }
      dispatch({ type: "DECLARAR", d: { id: minha?.id ?? uid("d"), funcionarioId: meuId, data, vaiFicar: false, periodo: null, respondidoEm: agoraBR() } });
      push("Registrado: você não vai ficar.", "info");
    }
    setModal(false);
  }

  return (
    <Shell titulo="Permanência" descricao={`Quem fica ${formatarData(data)} • Almoço até ${prazoAlmoco} • Noite até ${prazoNoite}`}>
      <PageHeader
        titulo="Quem vai ficar?"
        descricao={statusPrazo === "abertos" ? `Prazos abertos: almoço até ${prazoAlmoco}, noite até ${prazoNoite}` : statusPrazo === "encerrados" ? "Prazos encerrados — a equipe não pode mais alterar" : `Prazo do almoço encerrado — ainda dá para responder à noite (até ${prazoNoite})`}
        acoes={<span className={`chip ${statusPrazo === "encerrados" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}><Timer size={13} /> {statusPrazo === "abertos" ? "Prazos abertos" : statusPrazo === "encerrados" ? "Prazos encerrados" : "Só noite aberta"}</span>}
      />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {meuId ? (
          <Card className="p-6 border-brand-200 bg-gradient-to-b from-white to-brand-50/50">
            <h3 className="font-extrabold text-[17px]">Você vai ficar hoje?</h3>
            <p className="text-[13px] text-zinc-500 mt-1">
              {minha ? (minha.vaiFicar ? `Sim, ${minha.periodo === "Almoço" ? "no almoço" : "à noite"} • ${minha.motivo === "Outro" ? minha.motivoDetalhe : minha.motivo}` : "Você respondeu que não vai ficar.") : "Toque em uma opção para responder."}
            </p>
            {minha?.vaiFicar && minha.moderacao === "Negada" && (
              <div className="mt-3"><Alert tipo="erro"><b>Permanência negada pelo administrador.</b><br />Motivo: {minha.motivoNegacao ?? "—"}</Alert></div>
            )}
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <Button size="lg" className="!rounded-2xl" onClick={() => abrir(true)} disabled={!podeAlmoco && !podeNoite}><Check size={18} /> SIM, VOU FICAR</Button>
              <Button size="lg" variant="outline" className="!rounded-2xl" onClick={() => abrir(false)} disabled={!podeNoite}><X size={18} /> NÃO VOU</Button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">Almoço até {prazoAlmoco} • Noite e NÃO até {prazoNoite}</p>
            {(!podeAlmoco || !podeNoite) && <div className="mt-3"><Alert tipo="erro">Prazo encerrado. Peça ao administrador para alterar.</Alert></div>}
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="font-extrabold text-[17px]">Painel do administrador</h3>
            <p className="text-[13px] text-zinc-500 mt-1">Acompanhe quem fica, por setor, e a refeição automática de cada um.</p>
            <div className="mt-4"><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
          </Card>
        )}
        <Card className="p-6 lg:col-span-2 flex flex-wrap items-center gap-5">
          <Anel valor={sim.length} total={sim.length + nao.length + pendentes.length} tamanho={104} />
          <div className="flex-1 min-w-[220px]">
            <h3 className="font-bold">Resumo de {formatarData(data)}</h3>
            <p className="text-[13px] text-zinc-500">{sim.length} ficam • {nao.length} não ficam • {pendentes.length} pendentes</p>
            <p className="text-[13px] text-zinc-500">{calc.marmitas} marmitas (almoço) • {calc.lanches} lanches (noite)</p>
            <div className="mt-3"><ProgressBar valor={sim.length} total={sim.length + nao.length + pendentes.length} /></div>
            {meuId && <div className="mt-4 max-w-[220px]"><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>}
          </div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {calc.porSetor.map((s) => (
          <Card key={s.setorId} className="p-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.cor }} />
              <p className="font-bold text-[15px]">{s.nome}</p>
              <span className="ml-auto text-2xl font-extrabold">{s.total}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">{s.marmitas} marmitas • {s.lanches} lanches</p>
            <div className="mt-2"><ProgressBar valor={s.total} total={Math.max(1, sim.length)} /></div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader
          titulo="Quem vai ficar"
          subtitulo={`${lista.length} pessoas`}
          acao={<div className="flex gap-2 flex-wrap"><SearchInput value={busca} onChange={setBusca} placeholder="Buscar..." className="w-44 !py-2" /><Select value={fSetor} onChange={(e) => setFSetor(e.target.value)} className="!w-auto !py-2"><option value="Todos">Todos os setores</option>{state.setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select><Select value={fPeriodo} onChange={(e) => setFPeriodo(e.target.value)} className="!w-auto !py-2"><option>Todos</option><option>Almoço</option><option>Noite</option></Select></div>}
        />
        <div className="overflow-auto">
          <table className="w-full min-w-[640px]">
            <thead><tr><th className="table-th">Funcionário</th><th className="table-th">Setor</th><th className="table-th">Fica</th><th className="table-th">Refeição</th><th className="table-th">Motivo</th>{eAdmin && <th className="table-th text-right">Moderação</th>}</tr></thead>
            <tbody>
              {lista.map((d) => {
                const f = fmap[d.funcionarioId];
                const setor = state.setores.find((s) => s.id === f?.setorId);
                return (
                  <tr key={d.id} className="table-row">
                    <td className="table-td font-semibold">{f?.nome ?? "—"}</td>
                    <td className="table-td text-zinc-500">{setor?.nome ?? "—"}</td>
                    <td className="table-td"><Badge value={d.periodo ?? "Almoço"} dot /></td>
                    <td className="table-td text-xs font-semibold">{d.periodo === "Noite" ? "Lanche" : "Marmita"}</td>
                    <td className="table-td text-xs text-zinc-500 max-w-[240px] truncate">{d.motivo === "Outro" ? d.motivoDetalhe : d.motivo}</td>
                    {eAdmin && (
                      <td className="table-td text-right">
                        <Button size="sm" variant="outline" onClick={() => { setNegarAlvo(d.id); setMotivoNegacao(""); setErroNegar(""); }}><X size={14} /> Negar</Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && <p className="p-8 text-center text-sm text-zinc-400">Ninguém confirmado com este filtro ainda.</p>}
        </div>
        {eAdmin && negadas.length > 0 && (
          <div className="px-5 py-4 border-t border-red-100 bg-red-50/50">
            <p className="text-xs font-bold uppercase tracking-wider text-red-500">Negadas pelo administrador ({negadas.length})</p>
            <div className="space-y-2 mt-2">
              {negadas.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center gap-2 bg-white border border-red-100 rounded-xl px-3.5 py-2.5 text-sm">
                  <b>{fmap[d.funcionarioId]?.nome}</b>
                  <span className="text-zinc-400 text-xs">{d.periodo} • {d.motivo === "Outro" ? d.motivoDetalhe : d.motivo}</span>
                  <span className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">Negada: {d.motivoNegacao}</span>
                  <Button size="sm" variant="ghost" className="ml-auto" onClick={() => aprovar(d.id)}><Check size={14} /> Aprovar</Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {pendentes.length > 0 && (
          <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/60">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ainda não responderam ({pendentes.length})</p>
            <div className="flex flex-wrap gap-1.5 mt-2">{pendentes.map((f) => <span key={f.id} className="chip bg-white border border-zinc-200 text-zinc-600">{f.nome}</span>)}</div>
          </div>
        )}
      </Card>

      <Modal aberto={modal} titulo={vaiFicar ? "Confirmar permanência" : "Confirmar saída"} onFechar={() => setModal(false)}>
        {vaiFicar ? (
          <div className="space-y-4">
            <div>
              <p className="label mb-2">Quando você vai ficar?</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button disabled={!podeAlmoco} onClick={() => { setPeriodo("Almoço"); setErro(""); }} className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 font-bold text-sm transition ${periodo === "Almoço" ? "border-brand-600 bg-brand-50 text-brand-800" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"} disabled:opacity-40`}><Sun size={17} /> Almoço<span className="text-[11px] font-medium opacity-70">marmita • até {prazoAlmoco}</span></button>
                <button disabled={!podeNoite} onClick={() => { setPeriodo("Noite"); setErro(""); }} className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 font-bold text-sm transition ${periodo === "Noite" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"} disabled:opacity-40`}><MoonStar size={17} /> Noite<span className="text-[11px] font-medium opacity-70">lanche • até {prazoNoite}</span></button>
              </div>
            </div>
            <Field label="Motivo (obrigatório)" erro={erro}>
              <Select value={motivo} onChange={(e) => { setMotivo(e.target.value); setErro(""); }}>
                <option value="">Selecione o motivo...</option>
                {state.config.motivosPermanencia.map((m) => <option key={m}>{m}</option>)}
              </Select>
            </Field>
            {motivo === "Outro" && <Field label="Informe o motivo"><Input value={outro} onChange={(e) => setOutro(e.target.value)} placeholder="Descreva com detalhes..." /></Field>}
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setModal(false)}>Voltar</Button><Button onClick={confirmar}><Check size={16} /> Confirmar que vou ficar</Button></div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-zinc-600 leading-relaxed">Você informou que <b>não vai ficar</b> {formatarData(data)}. Nenhum motivo é exigido.</p>
            <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Voltar</Button><Button variant="primary" onClick={confirmar}>Confirmar saída</Button></div>
          </div>
        )}
      </Modal>

      <Modal aberto={!!negarAlvo} titulo="Negar permanência" subtitulo="A pessoa sai da contagem de refeições" onFechar={() => setNegarAlvo(null)}>
        <Field label="Motivo da negação (obrigatório)" erro={erroNegar}>
          <Input value={motivoNegacao} onChange={(e) => { setMotivoNegacao(e.target.value); setErroNegar(""); }} placeholder="Ex: sem demanda no setor hoje" />
        </Field>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={() => setNegarAlvo(null)}>Voltar</Button>
          <Button variant="danger" onClick={() => negarAlvo && negar(negarAlvo)}><X size={16} /> Confirmar negação</Button>
        </div>
      </Modal>
    </Shell>
  );
}
