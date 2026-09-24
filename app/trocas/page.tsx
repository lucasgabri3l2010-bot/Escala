"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Field, Input, Modal, Select, Textarea, Toast, useToast } from "@/components/ui";
import { useApp, useFuncionarioMap } from "@/lib/store";
import { formatarData, uid, agoraBR } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function TrocasPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const [modal, setModal] = React.useState(false);
  const [msg, show] = useToast();
  const [form, setForm] = React.useState({ solicitanteId: "", envolvidoId: "", novaData: "2026-09-25", novoInicio: "08:00", novoFim: "18:00", motivo: "" });

  function solicitar() {
    if (!form.solicitanteId || !form.envolvidoId || !form.motivo.trim()) { show("Preencha envolvidos e motivo."); return; }
    if (form.solicitanteId === form.envolvidoId) { show("Envolvido deve ser outra pessoa."); return; }
    const esc = state.escalas.find((e) => e.funcionarioId === form.solicitanteId);
    if (!esc) { show("O solicitante ainda não possui escala cadastrada."); return; }
    dispatch({ type: "ADD_TROCA", t: { id: uid("t"), escalaOriginalId: esc?.id ?? "e-001", ...form, status: "Pendente", criadaEm: agoraBR() } });
    setModal(false); show("Solicitação de troca criada.");
  }

  function mudar(id: string, status: "Aceita" | "Recusada" | "Aprovada" | "Cancelada") {
    const t = state.trocas.find((x) => x.id === id);
    if (!t) return;
    if (status === "Aprovada" && state.user.cargo === "Funcionário") { show("Apenas Administrador/Supervisor pode aprovar."); return; }
    dispatch({ type: "UPD_TROCA", t: { ...t, status } });
    show(`Troca ${status.toLowerCase()}.`);
  }

  return (
    <Shell titulo="Trocas de escala" descricao="Solicite, aceite, recuse ou aprove trocas">
      <div className="flex justify-end mb-4"><Button onClick={() => { setForm({ solicitanteId: state.funcionarios[0]?.id ?? "", envolvidoId: state.funcionarios[1]?.id ?? "", novaData: "2026-09-25", novoInicio: "08:00", novoFim: "18:00", motivo: "" }); setModal(true); }}><Plus size={16} /> Solicitar troca</Button></div>
      <div className="grid md:grid-cols-2 gap-3">
        {state.trocas.map((t) => (
          <Card key={t.id} className="p-4">
            <p className="text-sm"><b>{fmap[t.solicitanteId]?.nome}</b> <span className="text-zinc-400">solicita troca com</span> <b>{fmap[t.envolvidoId]?.nome}</b></p>
            <p className="text-xs text-zinc-500 mt-1">Nova escala: {formatarData(t.novaData)} • {t.novoInicio} — {t.novoFim}</p>
            <p className="text-sm mt-1">Motivo: {t.motivo}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge value={t.status} />
              <span className="text-[11px] text-zinc-400 ml-auto">{t.criadaEm}</span>
            </div>
            <div className="flex gap-2 mt-3">
              {t.status === "Pendente" && (<><Button variant="outline" className="!py-1.5 !text-xs" onClick={() => mudar(t.id, "Aceita")}>Aceitar</Button><Button variant="outline" className="!py-1.5 !text-xs" onClick={() => mudar(t.id, "Recusada")}>Recusar</Button><Button className="!py-1.5 !text-xs" onClick={() => mudar(t.id, "Aprovada")}>Aprovar (supervisor)</Button></>)}
              {t.status !== "Pendente" && t.status !== "Cancelada" && <Button variant="ghost" className="!py-1.5 !text-xs" onClick={() => mudar(t.id, "Cancelada")}>Cancelar</Button>}
            </div>
          </Card>
        ))}
      </div>
      {state.trocas.length === 0 && <Card className="p-6 text-center text-sm text-zinc-500 mt-3">Nenhuma troca solicitada.</Card>}
      <Modal aberto={modal} titulo="Solicitar troca" onFechar={() => setModal(false)}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Solicitante"><Select value={form.solicitanteId} onChange={(e) => setForm({ ...form, solicitanteId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Select></Field>
          <Field label="Envolvido"><Select value={form.envolvidoId} onChange={(e) => setForm({ ...form, envolvidoId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Select></Field>
          <Field label="Nova data"><Input type="date" value={form.novaData} onChange={(e) => setForm({ ...form, novaData: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-2"><Field label="Início"><Input type="time" value={form.novoInicio} onChange={(e) => setForm({ ...form, novoInicio: e.target.value })} /></Field><Field label="Fim"><Input type="time" value={form.novoFim} onChange={(e) => setForm({ ...form, novoFim: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Motivo"><Textarea value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} placeholder="Por que a troca?" /></Field></div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={solicitar}>Enviar solicitação</Button></div>
      </Modal>
      <Toast msg={msg} />
    </Shell>
  );
}
