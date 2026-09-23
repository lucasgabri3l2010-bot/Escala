"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Confirm, Empty, Field, Input, Modal, Select, Textarea, Toast, useToast } from "@/components/ui";
import { useApp, useFuncionarioMap, useSetorMap } from "@/lib/store";
import { Escala } from "@/lib/types";
import { formatarData, uid } from "@/lib/utils";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";

const TIPOS = ["Normal", "Plantão", "Sobreaviso", "Cobertura", "Atendimento", "Folga", "Férias", "Ausência"];

export default function EscalasPage() {
  const { state, dispatch } = useApp();
  const fmap = useFuncionarioMap();
  const smap = useSetorMap();
  const [busca, setBusca] = React.useState("");
  const [tipo, setTipo] = React.useState("Todos");
  const [modal, setModal] = React.useState(false);
  const [edit, setEdit] = React.useState<Escala | null>(null);
  const [excluir, setExcluir] = React.useState<Escala | null>(null);
  const [msg, show] = useToast();
  const [form, setForm] = React.useState({ funcionarioId: "", data: "2026-09-23", inicio: "08:00", fim: "17:00", tipo: "Normal", status: "Ativo", observacoes: "", exigePermanencia: true });

  React.useEffect(() => { if (!form.funcionarioId && state.funcionarios[0]) setForm((f) => ({ ...f, funcionarioId: state.funcionarios[0].id })); }, [state.funcionarios, form.funcionarioId]);

  const lista = state.escalas.filter((e) => {
    const nome = fmap[e.funcionarioId]?.nome.toLowerCase() ?? "";
    return (tipo === "Todos" || e.tipo === tipo) && nome.includes(busca.toLowerCase());
  });

  function conflito(funcionarioId: string, data: string, inicio: string, fim: string, ignorarId?: string): boolean {
    return state.escalas.some((e) => e.funcionarioId === funcionarioId && e.data === data && e.id !== ignorarId && e.status !== "Cancelada" && !(fim <= e.inicio || inicio >= e.fim));
  }

  function salvar() {
    const f = state.funcionarios.find((x) => x.id === form.funcionarioId);
    if (!f) { show("Selecione um funcionário."); return; }
    if (form.fim <= form.inicio) { show("Horário final deve ser maior que o inicial."); return; }
    if (f.status !== "Ativo" && form.tipo !== "Férias" && form.tipo !== "Ausência") { show(`Funcionário está ${f.status}. Use Férias/Ausência ou reative.`); return; }
    if (conflito(form.funcionarioId, form.data, form.inicio, form.fim, edit?.id)) { show("Conflito: sobreposição de horário para este funcionário."); return; }
    const base = { setorId: f.setorId, cargo: f.cargo, data: form.data, inicio: form.inicio, fim: form.fim, tipo: form.tipo as never, status: form.status as never, observacoes: form.observacoes, exigePermanencia: form.exigePermanencia };
    if (edit) { dispatch({ type: "UPD_ESCALA", e: { ...edit, ...base, funcionarioId: form.funcionarioId } }); show("Escala atualizada. Alimentação recalculada."); }
    else { dispatch({ type: "ADD_ESCALA", e: { id: uid("e"), funcionarioId: form.funcionarioId, ...base } }); show("Escala criada."); }
    setModal(false); setEdit(null);
  }

  function duplicar(e: Escala) {
    dispatch({ type: "ADD_ESCALA", e: { ...e, id: uid("e"), status: "Ativo" } });
    show("Escala duplicada.");
  }

  return (
    <Shell titulo="Escalas" descricao="Criar, editar, duplicar e controlar escalas">
      <div className="flex flex-wrap gap-2 mb-4">
        <Input placeholder="Pesquisar funcionário..." value={busca} onChange={(e) => setBusca(e.target.value)} className="!w-60" />
        <Select value={tipo} onChange={(e) => setTipo(e.target.value)} className="!w-auto"><option>Todos</option>{TIPOS.map((t) => <option key={t}>{t}</option>)}</Select>
        <Button className="ml-auto" onClick={() => { setEdit(null); setModal(true); }}><Plus size={16} /> Criar escala</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[820px]">
            <thead><tr><th className="table-th">Funcionário</th><th className="table-th">Data</th><th className="table-th">Horário</th><th className="table-th">Tipo</th><th className="table-th">Status</th><th className="table-th">Ações</th></tr></thead>
            <tbody>
              {lista.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="table-td font-medium">{fmap[e.funcionarioId]?.nome}<span className="block text-xs text-zinc-400 font-normal">{smap[e.setorId]?.nome} • {e.cargo}</span></td>
                  <td className="table-td">{formatarData(e.data)}</td>
                  <td className="table-td whitespace-nowrap">{e.inicio} — {e.fim}</td>
                  <td className="table-td"><Badge value={e.tipo} /></td>
                  <td className="table-td"><Badge value={e.status} /></td>
                  <td className="table-td"><div className="flex gap-1">
                    <button title="Duplicar" onClick={() => duplicar(e)} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"><Copy size={15} /></button>
                    <button title="Editar" onClick={() => { setEdit(e); setForm({ funcionarioId: e.funcionarioId, data: e.data, inicio: e.inicio, fim: e.fim, tipo: e.tipo, status: e.status, observacoes: e.observacoes ?? "", exigePermanencia: e.exigePermanencia }); setModal(true); }} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"><Pencil size={15} /></button>
                    <button title="Excluir" onClick={() => setExcluir(e)} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-zinc-500"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <Empty titulo="Nenhuma escala encontrada" descricao="Crie a primeira escala para este filtro." />}
        </div>
      </Card>
      <Modal aberto={modal} titulo={edit ? "Editar escala" : "Nova escala"} onFechar={() => setModal(false)} largo>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Funcionário"><Select value={form.funcionarioId} onChange={(e) => setForm({ ...form, funcionarioId: e.target.value })}>{state.funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome} ({f.status})</option>)}</Select></Field>
          <Field label="Data"><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></Field>
          <Field label="Tipo"><Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
          <Field label="Início"><Input type="time" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} /></Field>
          <Field label="Fim"><Input type="time" value={form.fim} onChange={(e) => setForm({ ...form, fim: e.target.value })} /></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Ativo</option><option>Pendente</option><option>Cancelada</option><option>Concluída</option></Select></Field>
          <div className="sm:col-span-3"><Field label="Observações"><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Detalhes da escala..." /></Field></div>
          <label className="flex items-center gap-2 text-sm sm:col-span-3"><input type="checkbox" checked={form.exigePermanencia} onChange={(e) => setForm({ ...form, exigePermanencia: e.target.checked })} className="accent-orange-600 w-4 h-4" /> Exigir resposta “Você vai ficar?” para esta escala</label>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></div>
      </Modal>
      <Confirm aberto={!!excluir} titulo="Excluir escala" texto="Excluir a escala atualiza permanência, alimentação e histórico. Deseja continuar?" onCancelar={() => setExcluir(null)} onConfirmar={() => { if (excluir) dispatch({ type: "DEL_ESCALA", id: excluir.id }); setExcluir(null); show("Escala excluída e módulos atualizados."); }} />
      <Toast msg={msg} />
    </Shell>
  );
}
