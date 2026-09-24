"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input, Select, Tabs } from "@/components/ui";
import { useApp } from "@/lib/store";
import { agoraBR, uid } from "@/lib/utils";
import { Eye, EyeOff, Loader2, ShieldCheck, Clock3, UtensilsCrossed } from "lucide-react";

const CORES = ["#ea580c", "#0284c7", "#16a34a", "#7c3aed", "#ca8a04", "#db2777", "#0d9488", "#475569"];

export default function LoginPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [aba, setAba] = React.useState("Entrar");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [ver, setVer] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [shake, setShake] = React.useState(0);
  // cadastro
  const [nome, setNome] = React.useState("");
  const [setorId, setSetorId] = React.useState("");

  // Quem já está logado não fica na tela de login
  React.useEffect(() => {
    if (state.logado) router.replace(state.user.cargo === "Funcionário" ? "/permanencia" : "/dashboard");
  }, [state.logado, state.user.cargo, router]);

  React.useEffect(() => {
    if (aba === "Criar conta" && !setorId && state.setores[0]) setSetorId(state.setores[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba, state.setores]);

  function falhar(msg: string) {
    setErro(msg);
    setShake((s) => s + 1);
    setLoading(false);
  }

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const conta = state.contas.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
    if (!conta) { falhar("Conta não encontrada. Crie sua conta na aba Criar conta."); return; }
    if (conta.senha !== senha) { falhar("Senha incorreta."); return; }
    setLoading(true);
    window.setTimeout(() => {
      dispatch({ type: "LOGIN", user: { nome: conta.nome, email: conta.email, cargo: conta.cargo, funcionarioId: conta.funcionarioId } });
      router.push(conta.cargo === "Funcionário" ? "/permanencia" : "/dashboard");
    }, 600);
  }

  function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (nome.trim().length < 3) { falhar("Informe seu nome completo."); return; }
    if (!email.includes("@")) { falhar("Informe um e-mail válido."); return; }
    if (senha.length < 4) { falhar("Senha deve ter ao menos 4 caracteres."); return; }
    if (!setorId) { falhar("Selecione seu setor."); return; }
    if (state.contas.some((c) => c.email.toLowerCase() === email.trim().toLowerCase())) { falhar("Este e-mail já possui conta. Entre na aba Entrar."); return; }
    setLoading(true);
    window.setTimeout(() => {
      const fid = uid("f");
      const setor = state.setores.find((s) => s.id === setorId);
      dispatch({
        type: "SIGNUP",
        conta: { id: uid("u"), nome: nome.trim(), email: email.trim(), senha, cargo: "Funcionário", funcionarioId: fid },
        funcionario: { id: fid, nome: nome.trim(), cargo: "Colaborador", setorId, status: "Ativo", telefone: "", email: email.trim(), admissao: agoraBR().slice(0, 10), avatarCor: CORES[state.funcionarios.length % CORES.length] }
      });
      void setor;
      router.push("/permanencia");
    }, 600);
  }

  return (
    <div className="min-h-screen flex bg-[#f7f7f5]">
      <div className="hidden lg:flex flex-1 bg-zinc-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full bg-brand-600/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-extrabold">E<span className="text-brand-600">+</span></div>
          <p className="text-xl font-extrabold tracking-tight">Escala+</p>
        </div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-400">SaaS corporativo</p>
          <h1 className="text-[44px] leading-[1.05] font-extrabold tracking-tight mt-3">Vai ficar hoje?<br />Responda em<br />segundos.</h1>
          <p className="text-zinc-400 mt-4 max-w-md leading-relaxed">Crie sua conta, responda se fica no almoço ou à noite e veja o cardápio das marmitas.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[{ i: <Clock3 size={18} />, t: "Almoço ou noite" }, { i: <UtensilsCrossed size={18} />, t: "Refeição automática" }, { i: <ShieldCheck size={18} />, t: "Conta só sua" }].map((c, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-brand-400">{c.i}</div><p className="text-[13px] font-semibold mt-2 leading-snug">{c.t}</p></div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-zinc-500">© {new Date().getFullYear()} Escala+ • Admin: admin@escala.plus / 123456</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div key={shake} className={`w-full max-w-[400px] bg-white border border-zinc-200/80 rounded-3xl shadow-card p-8 ${shake ? "animate-shake" : "animate-fadeUp"}`}>
          <div className="lg:hidden flex items-center gap-2.5 mb-6"><div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-extrabold">E<span className="text-brand-400">+</span></div><p className="font-extrabold text-lg">Escala+</p></div>
          <h2 className="text-[22px] font-extrabold tracking-tight">Bem-vindo</h2>
          <p className="text-[13px] text-zinc-500 mt-1 mb-5">Entre com sua conta ou crie a sua.</p>
          <Tabs abas={["Entrar", "Criar conta"]} ativa={aba} onTrocar={(a) => { setAba(a); setErro(""); }} className="w-full mb-5" />
          {aba === "Entrar" ? (
            <form onSubmit={entrar} className="space-y-4">
              <Field label="E-mail"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" /></Field>
              <Field label="Senha">
                <div className="relative">
                  <Input type={ver ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setVer(!ver)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">{ver ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
              </Field>
              {erro && <Alert tipo="erro">{erro}</Alert>}
              <Button className="w-full" size="lg" disabled={loading}>{loading ? <><Loader2 size={17} className="animate-spin" /> Entrando...</> : "Entrar"}</Button>
            </form>
          ) : (
            <form onSubmit={criar} className="space-y-4">
              <Field label="Nome completo"><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Santos" autoComplete="name" /></Field>
              <Field label="E-mail"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" /></Field>
              <Field label="Setor">
                <Select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
                  {state.setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </Select>
              </Field>
              <Field label="Senha">
                <div className="relative">
                  <Input type={ver ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 4 caracteres" autoComplete="new-password" />
                  <button type="button" onClick={() => setVer(!ver)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">{ver ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
              </Field>
              {erro && <Alert tipo="erro">{erro}</Alert>}
              <Button className="w-full" size="lg" disabled={loading}>{loading ? <><Loader2 size={17} className="animate-spin" /> Criando...</> : "Criar minha conta"}</Button>
              <p className="text-xs text-zinc-400 leading-relaxed">Contas criadas aqui têm perfil de equipe: respondem permanência e veem o cardápio. Só o administrador publica a foto do cardápio.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
