"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Field, Input, Modal, Select, Toast, useToast } from "@/components/ui";
import { useApp, useFuncionarioMap } from "@/lib/store";
import { Cobertura } from "@/lib/types";
import { formatarData, uid } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default function CoberturasPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const [modal, setModal] = React.useState(false);
  const [edit, setEdit] = React.useState<Cobertura | null>(null);
  const [msg, show] = useToast();
  const [form, setForm] = React.useState({ ausenteId: "", coberturaId: "", data: "2026-09-23", inicio: "13:45", fim: "18:00", motivo: "Ausência", status: "Ativa" });

  function salvar() {
    if (!form.ausenteId || !form.coberturaId) { show("Selecione ausente e cobertura."); return; }
    if (form.ausenteId === form.coberturaId) { show("Cobertura deve ser outro funcionário."); return; }
    if (edit) { dispatch({ type: "UPD_COBERTURA", c: { ...edit, ...form, status: form.status as never } }); show("Cobertura atualizada."); }
    else { dispatch({ type: "ADD_COBERTURA", c: { id: uid("c"), ...form, status: form.status as never } }); show("Cobertura criada."); }
    setModal(false); setEdit(null);
  }

  return (
    <Shell titulo="Coberturas" descricao="Quem cobre quem, quando e por qual motivo">
      <div className="flex justify-end mb-4"><Button onClick={() => { setEdit(null); setForm({ ausenteId: state.funcionarios[0]?.id ?? "", coberturaId: state.funcionarios[1]?.id ?? "", data: "2026-09-23", inicio: "13:45", fim: "18:00", motivo: "Ausência", status: "Ativa" }); setModal(true); }}><Plus size={16} /> Nova cobertura</Button></div>
      <div className="grid md:grid-cols-2 gap-3">
        {state.coberturas.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="text-sm space-y-1">
              <p><span className="text-zinc-500">Funcionário ausente:</span> <b>{fmap[c.ausenteId]?.nome}</b></p>
              <p><span className="text-zinc-500">Cobertura:</span> <b className="text-brand-700">{fmap[c.coberturaId]?.nome}</b></p>
              <p><span className="text-zinc-500">Data:</span> {formatarData(c.data)} <span className="text-zinc-500">Horário:</span> {c.inicio} — {c.fim}</p>
              <p><span className="text-zinc-500">Motivo:</span> {c.motivo} <Badge value={c.status} /></p>
            </div>
            <div className="flex justify-end mt-2"><button onClick={() => { setEdit(c); setForm({ ausenteId: c.ausenteId, coberturaId: c.coberturaId, data: c.data, inicio: c.inicio, fim: c.fim, motivo: c.motivo, status: c.status }); setModal(true); }} className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-brand-700"><Pencil size={14} /> Editar</button></div>
          </Card>
        ))}
      </div>
      <Modal aberto={modal} titulo={edit ? "Editar cobertura" : "Nova cobertura"} onFechar={() => setModal(false)}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Ausente"><Select value={form.ausenteId} onChange={(e) => setForm({ ...form, ausenteId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Select></Field>
          <Field label="Quem cobre"><Select value={form.coberturaId} onChange={(e) => setForm({ ...form, coberturaId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Select></Field>
          <Field label="Data"><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></Field>
          <Field label="Motivo"><Input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} /></Field>
          <Field label="Início"><Input type="time" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} /></Field>
          <Field label="Fim"><Input type="time" value={form.fim} onChange={(e) => setForm({ ...form, fim: e.target.value })} /></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Ativa</option><option>Concluída</option><option>Cancelada</option></Select></Field>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></div>
      </Modal>
      <Toast msg={msg} />
    </Shell>
  );
}
