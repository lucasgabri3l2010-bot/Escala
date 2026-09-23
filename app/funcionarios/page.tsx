"use client";
import React from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar, Badge, Button, Card, Confirm, Empty, Field, Input, Modal, PageHeader, Paginacao, SearchInput, Select } from "@/components/ui";
import { useApp, useSetorMap } from "@/lib/store";
import { useDebounce, usePagination, useToastPush } from "@/lib/hooks";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Funcionario } from "@/lib/types";
import { uid } from "@/lib/utils";

const CORES = ["#ea580c", "#0284c7", "#16a34a", "#7c3aed", "#ca8a04", "#db2777", "#0d9488", "#475569"];

export default function FuncionariosPage() {
  const { state, dispatch } = useApp();
  const smap = useSetorMap();
  const push = useToastPush();
  const [busca, setBusca] = React.useState("");
  const buscaDeb = useDebounce(busca);
  const [status, setStatus] = React.useState("Todos");
  const [modal, setModal] = React.useState(false);
  const [edit, setEdit] = React.useState<Funcionario | null>(null);
  const [excluir, setExcluir] = React.useState<Funcionario | null>(null);
  const [form, setForm] = React.useState({ nome: "", cargo: "", setorId: "", status: "Ativo", telefone: "", email: "" });
  const [erro, setErro] = React.useState("");

  const lista = React.useMemo(
    () => state.funcionarios.filter((f) => (status === "Todos" || f.status === status) && (f.nome.toLowerCase().includes(buscaDeb.toLowerCase()) || f.cargo.toLowerCase().includes(buscaDeb.toLowerCase()))),
    [state.funcionarios, status, buscaDeb]
  );
  const pg = usePagination(lista.length, 8);

  function abrirNovo() { setEdit(null); setErro(""); setForm({ nome: "", cargo: "", setorId: state.setores[0]?.id ?? "", status: "Ativo", telefone: "", email: "" }); setModal(true); }
  function abrirEditar(f: Funcionario) { setEdit(f); setErro(""); setForm({ nome: f.nome, cargo: f.cargo, setorId: f.setorId, status: f.status, telefone: f.telefone, email: f.email }); setModal(true); }
  function salvar() {
    if (!form.nome.trim() || !form.cargo.trim() || !form.email.includes("@")) { setErro("Preencha nome, cargo e um e-mail válido."); return; }
    if (edit) { dispatch({ type: "UPD_FUNC", f: { ...edit, ...form, status: form.status as never } }); push("Funcionário atualizado."); }
    else { dispatch({ type: "ADD_FUNC", f: { id: uid("f"), admissao: new Date().toISOString().slice(0, 10), avatarCor: CORES[state.funcionarios.length % CORES.length], ...form, status: form.status as never } }); push("Funcionário criado e listado."); }
    setModal(false);
  }

  return (
    <Shell titulo="Funcionários" descricao={`${state.funcionarios.length} pessoas • ${state.funcionarios.filter((f) => f.status === "Ativo").length} ativas`}>
      <PageHeader titulo="Equipe" descricao="Cadastro, status e perfil de cada pessoa" acoes={<Button onClick={abrirNovo}><Plus size={16} /> Criar funcionário</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-2 p-4 border-b border-zinc-100 bg-zinc-50/50">
          <SearchInput value={busca} onChange={setBusca} placeholder="Buscar nome ou cargo..." className="w-64 !bg-white" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="!w-auto"><option>Todos</option><option>Ativo</option><option>Inativo</option><option>Férias</option><option>Afastado</option></Select>
          <span className="ml-auto text-xs text-zinc-400 font-medium self-center">{lista.length} resultado(s)</span>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[780px]">
            <thead><tr><th className="table-th">Funcionário</th><th className="table-th">Cargo</th><th className="table-th">Setor</th><th className="table-th">Status</th><th className="table-th">Contato</th><th className="table-th text-right">Ações</th></tr></thead>
            <tbody>
              {pg.fatia(lista).map((f) => (
                <tr key={f.id} className="table-row">
                  <td className="table-td"><div className="flex items-center gap-3"><Avatar nome={f.nome} cor={f.avatarCor} /><span className="font-semibold">{f.nome}</span></div></td>
                  <td className="table-td text-zinc-500">{f.cargo}</td>
                  <td className="table-td"><span className="inline-flex items-center gap-1.5 text-[13px]"><span className="w-2 h-2 rounded-full" style={{ background: smap[f.setorId]?.cor }} />{smap[f.setorId]?.nome ?? "—"}</span></td>
                  <td className="table-td"><Badge value={f.status} dot /></td>
                  <td className="table-td text-xs text-zinc-500">{f.telefone}<span className="block text-zinc-400">{f.email}</span></td>
                  <td className="table-td"><div className="flex gap-1 justify-end">
                    <Link href={`/funcionarios/${f.id}`} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition" title="Visualizar"><Eye size={16} /></Link>
                    <button onClick={() => abrirEditar(f)} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition" title="Editar"><Pencil size={16} /></button>
                    <button onClick={() => setExcluir(f)} className="p-2 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-600 transition" title="Excluir"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <Empty titulo="Nenhum funcionário encontrado" descricao="Ajuste a busca ou cadastre a primeira pessoa da equipe." acao={<Button onClick={abrirNovo}>Criar funcionário</Button>} />}
        </div>
        <Paginacao pagina={pg.pagina} paginas={pg.paginas} onMudar={pg.setPagina} />
      </Card>

      <Modal aberto={modal} titulo={edit ? "Editar funcionário" : "Novo funcionário"} subtitulo="Os dados aparecem na tabela e no calendário ao salvar" onFechar={() => setModal(false)}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo" erro={erro && !form.nome.trim() ? erro : undefined}><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: João Silva" /></Field>
          <Field label="Cargo"><Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Ex: Analista" /></Field>
          <Field label="Setor"><Select value={form.setorId} onChange={(e) => setForm({ ...form, setorId: e.target.value })}>{state.setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Ativo</option><option>Inativo</option><option>Férias</option><option>Afastado</option></Select></Field>
          <Field label="Telefone"><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 90000-0000" /></Field>
          <Field label="E-mail"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nome@empresa.com" /></Field>
        </div>
        {erro && form.nome.trim() && <p className="text-xs text-red-600 mt-3">{erro}</p>}
        <div className="flex justify-end gap-2 mt-6"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={salvar}>Salvar funcionário</Button></div>
      </Modal>
      <Confirm aberto={!!excluir} titulo="Excluir funcionário" texto={`Deseja excluir ${excluir?.nome}? Escalas vinculadas precisarão de revisão. Essa ação não pode ser desfeita.`} onCancelar={() => setExcluir(null)} onConfirmar={() => { if (excluir) dispatch({ type: "DEL_FUNC", id: excluir.id }); setExcluir(null); push("Funcionário excluído.", "info"); }} />
    </Shell>
  );
}
