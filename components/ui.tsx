"use client";
import React from "react";
import { cn, corBadge, iniciais } from "@/lib/utils";
import { X, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Info } from "lucide-react";

/* ---------- Botões ---------- */
type BtnVariant = "primary" | "brand" | "ghost" | "outline" | "danger";
type BtnSize = "sm" | "md" | "lg";
export function Button({ className, variant = "brand", size = "md", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-5 py-3.5 text-[15px]" };
  const variants = { primary: "btn-primary", brand: "btn-brand", ghost: "btn-ghost", outline: "btn-outline", danger: "btn-danger" };
  return <button className={cn(variants[variant], sizes[size], className)} {...p} />;
}

/* ---------- Cards ---------- */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card", className)}>{children}</div>;
}
export function CardHeader({ titulo, subtitulo, acao }: { titulo: string; subtitulo?: string; acao?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4 border-b border-zinc-100">
      <div className="min-w-0"><h3 className="font-bold text-zinc-900 leading-tight">{titulo}</h3>{subtitulo && <p className="text-[13px] text-zinc-500 mt-0.5">{subtitulo}</p>}</div>
      {acao && <div className="ml-auto shrink-0">{acao}</div>}
    </div>
  );
}

/* ---------- Stat ---------- */
export function Stat({ nome, valor, detalhe, delta, icone }: { nome: string; valor: React.ReactNode; detalhe?: string; delta?: string; icone?: React.ReactNode }) {
  return (
    <Card className="p-5 card-hover">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">{icone}</div>
        {delta && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">{delta}</span>}
      </div>
      <p className="text-[32px] leading-none font-extrabold tracking-tight text-zinc-900 mt-4">{valor}</p>
      <p className="text-sm font-semibold text-zinc-800 mt-1">{nome}</p>
      {detalhe && <p className="text-xs text-zinc-400 mt-0.5">{detalhe}</p>}
    </Card>
  );
}

/* ---------- Badge / Avatar / Diversos ---------- */
export function Badge({ value, dot, className }: { value: string; dot?: boolean; className?: string }) {
  return (
    <span className={cn("chip", corBadge(value), className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {value}
    </span>
  );
}
export function Avatar({ nome, cor, tamanho = "md" }: { nome: string; cor?: string; tamanho?: "sm" | "md" | "lg" }) {
  const t = tamanho === "sm" ? "w-8 h-8 text-[11px]" : tamanho === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-xs";
  return <div className={cn("rounded-full text-white font-bold flex items-center justify-center shrink-0", t)} style={{ background: cor ?? "#18181b" }}>{iniciais(nome)}</div>;
}
export function Field({ label, erro, children }: { label: string; erro?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="mt-1.5">{children}</div>
      {erro && <span className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={13} />{erro}</span>}
    </label>
  );
}
export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={cn("input", p.className)} />;
}
export function Select(p: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...p} className={cn("input cursor-pointer", p.className)} />;
}
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn("input min-h-[90px] resize-y", p.className)} />;
}
export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition", className)}>
      <Search size={16} className="text-zinc-400 shrink-0" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "Pesquisar..."} className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400" />
      {value && <button onClick={() => onChange("")} className="text-zinc-400 hover:text-zinc-700"><X size={15} /></button>}
    </div>
  );
}

/* ---------- Estados ---------- */
export function Empty({ titulo, descricao, acao, icone }: { titulo: string; descricao?: string; acao?: React.ReactNode; icone?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">{icone ?? <Info size={22} />}</div>
      <p className="mt-3 font-bold text-zinc-800">{titulo}</p>
      {descricao && <p className="text-sm text-zinc-500 mt-1 max-w-sm">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}
export function LoadingList({ linhas = 5 }: { linhas?: number }) {
  return <div className="space-y-2 p-4">{Array.from({ length: linhas }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>;
}

/* ---------- Modal / Confirm / Drawer ---------- */
export function Modal({ aberto, titulo, subtitulo, onFechar, children, largo }: { aberto: boolean; titulo: string; subtitulo?: string; onFechar: () => void; children: React.ReactNode; largo?: boolean }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6">
      <div className="modal-overlay absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px]" onClick={onFechar} />
      <div className={cn("modal-panel relative bg-white w-full rounded-t-3xl sm:rounded-3xl shadow-pop max-h-[92vh] overflow-auto", largo ? "sm:max-w-3xl" : "sm:max-w-lg")}>
        <div className="flex items-start gap-3 px-6 py-5 border-b border-zinc-100 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div><h3 className="font-bold text-[17px] text-zinc-900">{titulo}</h3>{subtitulo && <p className="text-[13px] text-zinc-500 mt-0.5">{subtitulo}</p>}</div>
          <button onClick={onFechar} className="ml-auto p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition" aria-label="Fechar"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
export function Confirm({ aberto, titulo, texto, confirmarTexto = "Excluir", onCancelar, onConfirmar }: { aberto: boolean; titulo: string; texto: string; confirmarTexto?: string; onCancelar: () => void; onConfirmar: () => void }) {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><AlertCircle size={20} /></div>
        <p className="text-sm text-zinc-600 leading-relaxed">{texto}</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirmar}>{confirmarTexto}</Button>
      </div>
    </Modal>
  );
}

/* ---------- Tabs / Progresso / Paginação ---------- */
export function Tabs({ abas, ativa, onTrocar, className }: { abas: string[]; ativa: string; onTrocar: (a: string) => void; className?: string }) {
  return (
    <div className={cn("flex gap-1 p-1 bg-zinc-200/60 rounded-xl w-fit max-w-full overflow-auto", className)}>
      {abas.map((a) => (
        <button key={a} onClick={() => onTrocar(a)} className={cn("px-3.5 py-2 text-[13px] rounded-lg whitespace-nowrap transition-all", ativa === a ? "bg-white shadow-soft font-bold text-zinc-900" : "text-zinc-500 hover:text-zinc-800 font-medium")}>{a}</button>
      ))}
    </div>
  );
}
export function ProgressBar({ valor, total, altura = "h-2" }: { valor: number; total: number; altura?: string }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((valor / total) * 100));
  return (
    <div>
      <div className={cn("bg-zinc-100 rounded-full overflow-hidden", altura)}>
        <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-zinc-500 mt-1.5 font-medium">{valor} de {total} ({pct}%)</p>
    </div>
  );
}
export function Anel({ valor, total, tamanho = 92 }: { valor: number; total: number; tamanho?: number }) {
  const pct = total === 0 ? 0 : valor / total;
  const r = 40, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: tamanho, height: tamanho }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f4f4f5" strokeWidth="11" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#ea580c" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-extrabold">{valor}</span><span className="text-[10px] text-zinc-400 font-semibold uppercase">de {total}</span></div>
    </div>
  );
}
export function Paginacao({ pagina, paginas, onMudar }: { pagina: number; paginas: number; onMudar: (p: number) => void }) {
  if (paginas <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
      <p className="text-xs text-zinc-400 font-medium">Página {pagina} de {paginas}</p>
      <div className="flex gap-1">
        <button disabled={pagina <= 1} onClick={() => onMudar(pagina - 1)} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40"><ChevronLeft size={15} /></button>
        {Array.from({ length: paginas }).slice(0, 5).map((_, i) => (
          <button key={i} onClick={() => onMudar(i + 1)} className={cn("w-9 h-9 rounded-lg text-sm font-semibold", pagina === i + 1 ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-600")}>{i + 1}</button>
        ))}
        <button disabled={pagina >= paginas} onClick={() => onMudar(pagina + 1)} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

/* ---------- Feedback ---------- */
export function Alert({ tipo, children }: { tipo: "erro" | "ok" | "info"; children: React.ReactNode }) {
  const st = tipo === "erro" ? "bg-red-50 border-red-200 text-red-700" : tipo === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-brand-50 border-brand-200 text-brand-800";
  const Ic = tipo === "erro" ? AlertCircle : tipo === "ok" ? CheckCircle2 : Info;
  return <div className={cn("flex gap-2 items-start text-sm border rounded-xl px-3.5 py-3", st)}><Ic size={17} className="shrink-0 mt-0.5" /><div>{children}</div></div>;
}
export function PageHeader({ titulo, descricao, acoes }: { titulo: string; descricao?: string; acoes?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-5 page-enter">
      <div className="min-w-0"><h2 className="text-[22px] font-extrabold tracking-tight text-zinc-900">{titulo}</h2>{descricao && <p className="text-[13px] text-zinc-500 mt-0.5">{descricao}</p>}</div>
      {acoes && <div className="ml-auto flex gap-2 flex-wrap">{acoes}</div>}
    </div>
  );
}

// Compat: Toast simples + hook legado
export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] bg-zinc-900 text-white text-sm px-4 py-3 rounded-2xl shadow-pop animate-fadeUp max-w-[92vw]">{msg}</div>;
}
export function useToast(): [string | null, (m: string) => void] {
  const [msg, setMsg] = React.useState<string | null>(null);
  const show = React.useCallback((m: string) => { setMsg(m); window.setTimeout(() => setMsg(null), 2600); }, []);
  return [msg, show];
}
