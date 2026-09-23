"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Button, Card, Confirm, Field, Input, Modal, Toast, useToast } from "@/components/ui";
import { useApp } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function SetoresPage() {
  const { state, dispatch } = useApp();
  const [modal, setModal] = React.useState(false);
  const [edit, setEdit] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ nome: "", responsavel: "", cor: "#ea580c" });
  const [excluir, setExcluir] = React.useState<string | null>(null);
  const [msg, show] = useToast();

  function salvar() {
    if (!form.nome.trim()) { show("Informe o nome do setor."); return; }
    if (edit) { const s = state.setores.find((x) => x.id === edit)!; dispatch({ type: "UPD_SETOR", s: { ...s, ...form } }); show("Setor atualizado."); }
    else dispatch({ type: "ADD_SETOR", s: { id: uid("set"), ...form } }), show("Setor criado.");
    setModal(false); setEdit(null);
  }

  return (
    <Shell titulo="Setores" descricao="Organize os setores da empresa">
      <div className="flex justify-end mb-4"><Button onClick={() => { setEdit(null); setForm({ nome: "", responsavel: "", cor: "#ea580c" }); setModal(true); }}><Plus size={16} /> Novo setor</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.setores.map((s) => {
          const qtd = state.funcionarios.filter((f) => f.setorId === s.id).length;
          return (
            <Card key={s.id} className="p-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl" style={{ background: s.cor + "22", color: s.cor, border: `1px solid ${s.cor}44` }}><div className="w-full h-full flex items-center justify-center font-extrabold">{s.nome[0]}</div></div>
                <div><p className="font-bold text-zinc-900">{s.nome}</p><p className="text-xs text-zinc-500">{qtd} funcionário(s) • Resp: {s.responsavel}</p></div>
                <div className="ml-auto flex gap-1">
                  <button onClick={() => { setEdit(s.id); setForm({ nome: s.nome, responsavel: s.responsavel, cor: s.cor }); setModal(true); }} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"><Pencil size={15} /></button>
                  <button onClick={() => setExcluir(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal aberto={modal} titulo={edit ? "Editar setor" : "Novo setor"} onFechar={() => setModal(false)}>
        <div className="space-y-3">
          <Field label="Nome"><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: TI" /></Field>
          <Field label="Responsável"><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></Field>
          <Field label="Cor"><Input type="color" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} className="!h-10 !p-1" /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></div>
      </Modal>
      <Confirm aberto={!!excluir} titulo="Excluir setor" texto="Deseja excluir este setor? Funcionários vinculados ficarão sem setor." onCancelar={() => setExcluir(null)} onConfirmar={() => { if (excluir) dispatch({ type: "DEL_SETOR", id: excluir }); setExcluir(null); show("Setor excluído."); }} />
      <Toast msg={msg} />
    </Shell>
  );
}
