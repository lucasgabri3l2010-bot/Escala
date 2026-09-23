"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Alert, Anel, Badge, Button, Card, CardHeader, Field, Input, Modal, PageHeader, ProgressBar, SearchInput, Select } from "@/components/ui";
import { useApp, useFuncionarioMap, useSetorMap, HOJE } from "@/lib/store";
import { useToastPush } from "@/lib/hooks";
import { formatarData, prazoEncerrado } from "@/lib/utils";
import { Check, X, Timer } from "lucide-react";

export default function PermanenciaPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const smap = useSetorMap();
  const push = useToastPush();
  const [data, setData] = React.useState(HOJE);
  const [busca, setBusca] = React.useState("");
  const [fSetor, setFSetor] = React.useState("Todos");
  const [fStatus, setFStatus] = React.useState("Todos");
  const [responder, setResponder] = React.useState<string | null>(null);
  const [vaiFicar, setVaiFicar] = React.useState<boolean | null>(null);
  const [motivo, setMotivo] = React.useState("");
  const [outro, setOutro] = React.useState("");
  const [erro, setErro] = React.useState("");

  const prazo = state.config.prazoResposta;
  const encerrado = prazoEncerrado(prazo);
  const podeEditar = !encerrado || state.user.cargo !== "Funcionário";

  const lista = state.permanencias.filter((p) => {
    if (p.data !== data) return false;
    const esc = state.escalas.find((e) => e.id === p.escalaId);
    if (fSetor !== "Todos" && esc?.setorId !== fSetor) return false;
    const nome = fmap[p.funcionarioId]?.nome.toLowerCase() ?? "";
    if (busca && !nome.includes(busca.toLowerCase())) return false;
    const st = p.vaiFicar === null ? "Pendente" : p.vaiFicar ? "Vai ficar" : "Não vai ficar";
    if (fStatus !== "Todos" && st !== fStatus) return false;
    return true;
  });

  const conf = state.permanencias.filter((p) => p.data === data && p.vaiFicar === true).length;
  const nao = state.permanencias.filter((p) => p.data === data && p.vaiFicar === false).length;
  const pend = state.permanencias.filter((p) => p.data === data && p.vaiFicar === null).length;

  function abrir(pId: string, v: boolean) { setResponder(pId); setVaiFicar(v); setMotivo(""); setOutro(""); setErro(""); }
  function responderRapido(v: boolean) {
    const p = state.permanencias.find((x) => x.data === data && x.vaiFicar === null && (fmap[x.funcionarioId]?.nome.toLowerCase().includes(busca.toLowerCase()) ?? true));
    if (!p) { push("Nenhuma pendência para responder.", "info"); return; }
    abrir(p.id, v);
  }
  function confirmar() {
    if (!responder || vaiFicar === null) return;
    if (!podeEditar) { setErro("Prazo encerrado. Resposta bloqueada para funcionário."); return; }
    if (vaiFicar) {
      if (!motivo) { setErro("Selecione o motivo. É obrigatório para confirmar SIM."); return; }
      if (motivo === "Outro" && !outro.trim()) { setErro("Descreva o motivo no campo 'Informe o motivo'."); return; }
      dispatch({ type: "RESP_PERM", id: responder, vaiFicar: true, motivo, motivoDetalhe: motivo === "Outro" ? outro : undefined });
      push("Resposta registrada: vai ficar. Alimentação atualizada.");
    } else {
      dispatch({ type: "RESP_PERM", id: responder, vaiFicar: false });
      push("Resposta registrada: não vai ficar.", "info");
    }
    setResponder(null); setVaiFicar(null);
  }

  const alvo = responder ? state.permanencias.find((p) => p.id === responder) : null;

  return (
    <Shell titulo="Permanência" descricao={`Respostas de ${formatarData(data)} • Prazo ${prazo}`}>
      <PageHeader
        titulo="Você vai ficar?"
        descricao={encerrado ? "Prazo encerrado — funcionário não pode mais alterar" : `Prazo aberto até ${prazo} — você pode alterar sua resposta`}
        acoes={<><span className={`chip ${encerrado ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}><Timer size={13} /> {encerrado ? "Prazo encerrado" : "Prazo aberto"}</span></>}
      />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-6 border-brand-200 bg-gradient-to-b from-white to-brand-50/50">
          <h3 className="font-extrabold text-[17px]">Responder permanência</h3>
          <p className="text-[13px] text-zinc-500 mt-1">Toque em uma opção. O motivo é obrigatório para SIM.</p>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <Button size="lg" className="!rounded-2xl" onClick={() => responderRapido(true)} disabled={!podeEditar}><Check size={18} /> SIM, VOU FICAR</Button>
            <Button size="lg" variant="outline" className="!rounded-2xl" onClick={() => responderRapido(false)} disabled={!podeEditar}><X size={18} /> NÃO VOU</Button>
          </div>
          {!podeEditar && <Alert tipo="erro"><span className="font-semibold">Bloqueado.</span>&nbsp;Peça a um administrador para alterar manualmente.</Alert>}
        </Card>
        <Card className="p-6 lg:col-span-2 flex flex-wrap items-center gap-5">
          <Anel valor={conf} total={conf + nao + pend} tamanho={104} />
          <div className="flex-1 min-w-[220px]">
            <h3 className="font-bold">Painel de {formatarData(data)}</h3>
            <p className="text-[13px] text-zinc-500">{conf} confirmados • {nao} não ficarão • {pend} pendentes</p>
            <div className="mt-3"><ProgressBar valor={conf} total={conf + nao + pend} /></div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="!w-auto !py-2" />
              <Select value={fSetor} onChange={(e) => setFSetor(e.target.value)} className="!w-auto !py-2"><option value="Todos">Todos os setores</option>{state.setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select>
              <Select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="!w-auto !py-2"><option>Todos</option><option>Vai ficar</option><option>Não vai ficar</option><option>Pendente</option></Select>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader titulo="Respostas por funcionário" subtitulo={`${lista.length} registros`} acao={<SearchInput value={busca} onChange={setBusca} placeholder="Buscar funcionário..." className="w-56 !py-2" />} />
        <div className="overflow-auto">
          <table className="w-full min-w-[760px]">
            <thead><tr><th className="table-th">Funcionário</th><th className="table-th">Setor</th><th className="table-th">Horário</th><th className="table-th">Vai ficar?</th><th className="table-th">Motivo</th><th className="table-th text-right">Responder</th></tr></thead>
            <tbody>
              {lista.map((p) => {
                const esc = state.escalas.find((e) => e.id === p.escalaId);
                return (
                  <tr key={p.id} className="table-row">
                    <td className="table-td font-semibold">{fmap[p.funcionarioId]?.nome}</td>
                    <td className="table-td text-zinc-500">{esc ? smap[esc.setorId]?.nome : "—"}</td>
                    <td className="table-td tabular-nums">{esc ? `${esc.inicio} — ${esc.fim}` : "—"}</td>
                    <td className="table-td">{p.vaiFicar === null ? <Badge value="Pendente" /> : p.vaiFicar ? <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">Sim, vai ficar</span> : <span className="chip bg-zinc-100 text-zinc-500">Não vai ficar</span>}</td>
                    <td className="table-td text-xs text-zinc-500 max-w-[220px] truncate">{p.vaiFicar ? (p.motivo === "Outro" ? p.motivoDetalhe : p.motivo) : "—"}</td>
                    <td className="table-td"><div className="flex gap-1.5 justify-end">
                      <Button size="sm" variant="outline" disabled={!podeEditar} onClick={() => abrir(p.id, true)}>Sim</Button>
                      <Button size="sm" variant="ghost" disabled={!podeEditar} onClick={() => abrir(p.id, false)}>Não</Button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && <p className="p-8 text-center text-sm text-zinc-400">Nenhum registro para este filtro.</p>}
        </div>
      </Card>

      <Modal aberto={!!responder} titulo={vaiFicar ? "Confirmar permanência" : "Confirmar saída"} subtitulo={alvo ? `${fmap[alvo.funcionarioId]?.nome} • ${formatarData(alvo.data)}` : undefined} onFechar={() => setResponder(null)}>
        {vaiFicar ? (
          <div className="space-y-4">
            <Alert tipo="info">Você informou que <b>permanecerá hoje</b>. O motivo abaixo é <b>obrigatório</b> e alimenta o cálculo de marmitas.</Alert>
            <Field label="Motivo da permanência" erro={erro}>
              <Select value={motivo} onChange={(e) => { setMotivo(e.target.value); setErro(""); }}>
                <option value="">Selecione o motivo...</option>
                {state.config.motivosPermanencia.map((m) => <option key={m}>{m}</option>)}
              </Select>
            </Field>
            {motivo === "Outro" && <Field label="Informe o motivo"><Input value={outro} onChange={(e) => setOutro(e.target.value)} placeholder="Descreva com detalhes..." /></Field>}
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setResponder(null)}>Voltar</Button><Button onClick={confirmar}><Check size={16} /> Confirmar que vou ficar</Button></div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-zinc-600 leading-relaxed">Você informou que <b>não permanecerá hoje</b>. Nenhum motivo é exigido e você sai automaticamente do cálculo de alimentação.</p>
            <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setResponder(null)}>Voltar</Button><Button variant="primary" onClick={confirmar}>Confirmar saída</Button></div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
