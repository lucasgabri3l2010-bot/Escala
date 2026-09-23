"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Confirm, Field, Input, Modal, Select, Textarea, Toast, useToast, Tabs } from "@/components/ui";
import { useApp, useFuncionarioMap, useSetorMap } from "@/lib/store";
import { Plantao } from "@/lib/types";
import { formatarData, uid } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function PlantoesPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const smap = useSetorMap();
  const [aba, setAba] = React.useState("Agendado");
  const [modal, setModal] = React.useState(false);
  const [edit, setEdit] = React.useState<Plantao | null>(null);
  const [excluir, setExcluir] = React.useState<string | null>(null);
  const [msg, show] = useToast();
  const [form, setForm] = React.useState({ funcionarioId: "", data: "2026-09-23", inicio: "18:00", fim: "23:00", tipo: "Plantão noturno", status: "Agendado", observacoes: "" });

  const lista = state.plantoes.filter((p) => aba === "Todos" || p.status === aba);

  function salvar() {
    if (!form.funcionarioId) { show("Selecione o responsável."); return; }
    const f = state.funcionarios.find((x) => x.id === form.funcionarioId)!;
    if (edit) { dispatch({ type: "UPD_PLANTAO", p: { ...edit, ...form, setorId: f.setorId, status: form.status as never } }); show("Plantão atualizado."); }
    else { dispatch({ type: "ADD_PLANTAO", p: { id: uid("pl"), setorId: f.setorId, ...form, status: form.status as never } }); show("Plantão criado."); }
    setModal(false); setEdit(null);
  }

  return (
    <Shell titulo="Plantões" descricao="Plantão atual, próximos e passados">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Tabs abas={["Agendado", "Em andamento", "Concluído", "Todos"]} ativa={aba} onTrocar={setAba} />
        <Button className="ml-auto" onClick={() => { setEdit(null); setForm({ funcionarioId: state.funcionarios[0]?.id ?? "", data: "2026-09-23", inicio: "18:00", fim: "23:00", tipo: "Plantão noturno", status: "Agendado", observacoes: "" }); setModal(true); }}><Plus size={16} /> Novo plantão</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {lista.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start gap-2">
              <div><p className="font-bold">{fmap[p.funcionarioId]?.nome}</p><p className="text-xs text-zinc-500">{smap[p.setorId]?.nome} • {formatarData(p.data)} • {p.inicio} — {p.fim}</p><p className="text-sm mt-1">{p.tipo}</p>{p.observacoes && <p className="text-xs text-zinc-500">{p.observacoes}</p>}<div className="mt-2"><Badge value={p.status} /></div></div>
              <div className="ml-auto flex gap-1">
                <button onClick={() => { setEdit(p); setForm({ funcionarioId: p.funcionarioId, data: p.data, inicio: p.inicio, fim: p.fim, tipo: p.tipo, status: p.status, observacoes: p.observacoes ?? "" }); setModal(true); }} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"><Pencil size={15} /></button>
                <button onClick={() => setExcluir(p.id)} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-zinc-500"><Trash2 size={15} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {lista.length === 0 && <Card className="p-6 text-center text-sm text-zinc-500 mt-3">Nenhum plantão com este status.</Card>}
      <Modal aberto={modal} titulo={edit ? "Editar plantão" : "Novo plantão"} onFechar={() => setModal(false)}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Responsável"><Select value={form.funcionarioId} onChange={(e) => setForm({ ...form, funcionarioId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Select></Field>
          <Field label="Tipo"><Input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} /></Field>
          <Field label="Data"><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Agendado</option><option>Em andamento</option><option>Concluído</option></Select></Field>
          <Field label="Início"><Input type="time" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} /></Field>
          <Field label="Fim"><Input type="time" value={form.fim} onChange={(e) => setForm({ ...form, fim: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Observações"><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></Field></div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></div>
      </Modal>
      <Confirm aberto={!!excluir} titulo="Excluir plantão" texto="Deseja excluir este plantão?" onCancelar={() => setExcluir(null)} onConfirmar={() => { if (excluir) dispatch({ type: "DEL_PLANTAO", id: excluir }); setExcluir(null); show("Plantão excluído."); }} />
      <Toast msg={msg} />
    </Shell>
  );
}
