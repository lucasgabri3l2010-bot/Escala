"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input } from "@/components/ui";
import { useApp } from "@/lib/store";
import { Eye, EyeOff, Loader2, ShieldCheck, Clock3, UtensilsCrossed } from "lucide-react";

export default function LoginPage() {
  const { dispatch } = useApp();
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@escala.plus");
  const [senha, setSenha] = React.useState("123456");
  const [ver, setVer] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [shake, setShake] = React.useState(0);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setErro("Informe um e-mail válido."); setShake((s) => s + 1); return; }
    if (senha.length < 4) { setErro("Senha deve ter ao menos 4 caracteres."); setShake((s) => s + 1); return; }
    setErro(""); setLoading(true);
    window.setTimeout(() => {
      const cargo = email.startsWith("admin") ? "Administrador" : email.startsWith("sup") ? "Supervisor" : "Funcionário";
      const nome = cargo === "Administrador" ? "Administrador" : cargo === "Supervisor" ? "Supervisor Setorial" : "João Silva";
      dispatch({ type: "LOGIN", user: { nome, email, cargo: cargo as never } });
      router.push("/dashboard");
    }, 750);
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
          <h1 className="text-[44px] leading-[1.05] font-extrabold tracking-tight mt-3">Escalas, plantões<br />e alimentação<br />sem planilha.</h1>
          <p className="text-zinc-400 mt-4 max-w-md leading-relaxed">Saiba quem trabalha hoje, quem vai ficar após o expediente e quantas marmitas serão necessárias — em poucos cliques.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[{ i: <Clock3 size={18} />, t: "Permanência com motivo" }, { i: <UtensilsCrossed size={18} />, t: "Alimentação automática" }, { i: <ShieldCheck size={18} />, t: "Auditoria completa" }].map((c, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-brand-400">{c.i}</div><p className="text-[13px] font-semibold mt-2 leading-snug">{c.t}</p></div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-zinc-500">© {new Date().getFullYear()} Escala+ • Mock pronto para backend real</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <form key={shake} onSubmit={entrar} className={`w-full max-w-[400px] bg-white border border-zinc-200/80 rounded-3xl shadow-card p-8 ${shake ? "animate-shake" : "animate-fadeUp"}`}>
          <div className="lg:hidden flex items-center gap-2.5 mb-6"><div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-extrabold">E<span className="text-brand-400">+</span></div><p className="font-extrabold text-lg">Escala+</p></div>
          <h2 className="text-[22px] font-extrabold tracking-tight">Bem-vindo de volta</h2>
          <p className="text-[13px] text-zinc-500 mt-1 mb-6">Entre para gerenciar a operação de hoje.</p>
          <div className="space-y-4">
            <Field label="E-mail corporativo"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" /></Field>
            <Field label="Senha">
              <div className="relative">
                <Input type={ver ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setVer(!ver)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">{ver ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </Field>
            {erro && <Alert tipo="erro">{erro}</Alert>}
            <Button className="w-full" size="lg" disabled={loading}>{loading ? <><Loader2 size={17} className="animate-spin" /> Entrando...</> : "Entrar no painel"}</Button>
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-zinc-500"><input type="checkbox" defaultChecked className="accent-orange-600 w-4 h-4" /> Lembrar-me</label>
              <button type="button" className="font-bold text-brand-700 hover:underline">Esqueci a senha</button>
            </div>
            <div className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-xl px-3.5 py-3 leading-relaxed">Acesso mock:<br /><b className="text-zinc-600">admin@escala.plus</b> — Administrador<br /><b className="text-zinc-600">sup@escala.plus</b> — Supervisor<br /><b className="text-zinc-600">joao@escala.plus</b> — Funcionário<br />Senha: 123456</div>
          </div>
        </form>
      </div>
    </div>
  );
}
