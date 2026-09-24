"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarDays, Users, LayoutDashboard, Repeat2, UtensilsCrossed, Settings, History, FileBarChart, Clock, Building2, MoonStar, LifeBuoy, ChevronLeft, ChevronRight, Menu, X, LogOut, Search, User, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Avatar } from "./ui";

const MENU: { grupo: string; itens: { href: string; nome: string; icone: React.ReactNode }[] }[] = [
  { grupo: "Principal", itens: [{ href: "/dashboard", nome: "Dashboard", icone: <LayoutDashboard size={19} /> }] },
  {
    grupo: "Gestão",
    itens: [
      { href: "/escalas", nome: "Escalas", icone: <Clock size={19} /> },
      { href: "/calendario", nome: "Calendário", icone: <CalendarDays size={19} /> },
      { href: "/funcionarios", nome: "Funcionários", icone: <Users size={19} /> },
      { href: "/setores", nome: "Setores", icone: <Building2 size={19} /> },
      { href: "/plantoes", nome: "Plantões", icone: <MoonStar size={19} /> },
      { href: "/coberturas", nome: "Coberturas", icone: <LifeBuoy size={19} /> },
      { href: "/trocas", nome: "Trocas", icone: <Repeat2 size={19} /> }
    ]
  },
  {
    grupo: "Controle",
    itens: [
      { href: "/permanencia", nome: "Permanência", icone: <Clock size={19} /> },
      { href: "/alimentacao", nome: "Alimentação", icone: <UtensilsCrossed size={19} /> },
      { href: "/notificacoes", nome: "Notificações", icone: <Bell size={19} /> }
    ]
  },
  {
    grupo: "Análise",
    itens: [
      { href: "/relatorios", nome: "Relatórios", icone: <FileBarChart size={19} /> },
      { href: "/historico", nome: "Histórico", icone: <History size={19} /> }
    ]
  },
  { grupo: "Sistema", itens: [{ href: "/configuracoes", nome: "Configurações", icone: <Settings size={19} /> }] }
];

export function Sidebar({ recolhida, setRecolhida, mobileAberta, setMobileAberta }: { recolhida: boolean; setRecolhida: (v: boolean) => void; mobileAberta: boolean; setMobileAberta: (v: boolean) => void }) {
  const path = usePathname();
  const { state } = useApp();
  const router = useRouter();
  const [perfil, setPerfil] = React.useState(false);
  const naoLidas = state.notificacoes.filter((n) => !n.lida).length;
  const MENU_VISIVEL = state.user.cargo === "Funcionário"
    ? MENU.map((g) => ({ ...g, itens: g.itens.filter((it) => ["/dashboard", "/permanencia", "/alimentacao"].includes(it.href)) })).filter((g) => g.itens.length > 0)
    : MENU;

  const conteudo = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 h-[68px] border-b border-zinc-100 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-extrabold text-[15px] shadow-soft shrink-0">E<span className="text-brand-400">+</span></div>
        {!recolhida && (
          <div className="leading-tight min-w-0">
            <p className="font-extrabold text-[17px] text-zinc-900 tracking-tight">Escala+</p>
            <p className="text-[11px] text-zinc-400 font-medium">Operação e plantões</p>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {MENU_VISIVEL.map((g) => (
          <div key={g.grupo}>
            {!recolhida && <p className="px-2.5 mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-400">{g.grupo}</p>}
            <div className="space-y-1">
              {g.itens.map((it) => {
                const ativo = path === it.href || path.startsWith(it.href + "/");
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setMobileAberta(false)}
                    title={recolhida ? it.nome : undefined}
                    className={cn("nav-link group", ativo ? "nav-active" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 font-medium", recolhida && "justify-center px-2")}
                  >
                    <span className={cn("shrink-0 transition", ativo ? "text-brand-600" : "text-zinc-400 group-hover:text-zinc-700")}>{it.icone}</span>
                    {!recolhida && <span className="truncate">{it.nome}</span>}
                    {!recolhida && it.href === "/notificacoes" && naoLidas > 0 && (
                      <span className="ml-auto text-[11px] font-bold bg-brand-600 text-white rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">{naoLidas}</span>
                    )}
                    {recolhida && it.href === "/notificacoes" && naoLidas > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-zinc-100 p-3 shrink-0 relative">
        <button onClick={() => (recolhida ? router.push("/configuracoes") : setPerfil(!perfil))} className={cn("w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition", recolhida && "justify-center")}>
          <Avatar nome={state.user.nome} cor="#18181b" tamanho="sm" />
          {!recolhida && (
            <>
              <span className="min-w-0 flex-1 text-left leading-tight">
                <span className="block text-[13px] font-bold text-zinc-900 truncate">{state.user.nome}</span>
                <span className="block text-[11px] text-zinc-400 font-medium">{state.user.cargo}</span>
              </span>
              <ChevronRight size={15} className="text-zinc-300" />
            </>
          )}
        </button>
        {!recolhida && perfil && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-zinc-200 rounded-2xl shadow-pop overflow-hidden animate-fadeUp">
            <button onClick={() => { setPerfil(false); router.push("/configuracoes"); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-zinc-50"><User size={15} className="text-zinc-400" /> Meu perfil</button>
            <button onClick={() => { setPerfil(false); router.push("/login"); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-zinc-100"><LogOut size={15} /> Sair</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("hidden md:flex flex-col bg-white border-r border-zinc-200/80 h-screen sticky top-0 transition-all duration-300 shrink-0 z-40", recolhida ? "w-[76px]" : "w-[264px]")}>
        {conteudo}
        <button onClick={() => setRecolhida(!recolhida)} aria-label="Recolher menu" className="absolute -right-3.5 top-[74px] w-7 h-7 bg-white border border-zinc-200 rounded-full hidden md:flex items-center justify-center text-zinc-400 shadow-soft hover:text-brand-600 hover:border-brand-300 transition">
          {recolhida ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </aside>
      {mobileAberta && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] animate-fadeIn" onClick={() => setMobileAberta(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-pop animate-slideIn">
            <button onClick={() => setMobileAberta(false)} className="absolute right-3 top-5 p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 z-10"><X size={18} /></button>
            {conteudo}
          </aside>
        </div>
      )}
    </>
  );
}

export function Topbar({ titulo, descricao, onMenu }: { titulo: string; descricao?: string; onMenu: () => void }) {
  const { state, dispatch } = useApp();
  const [busca, setBusca] = React.useState("");
  const [aberto, setAberto] = React.useState(false);
  const naoLidas = state.notificacoes.filter((n) => !n.lida);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const f = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false); };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  return (
    <header className="topbar sticky top-0 z-30 bg-[#f7f7f5]/85 backdrop-blur-xl border-b border-zinc-200/70">
      <div className="flex items-center gap-3 px-4 md:px-7 h-[68px] max-w-[1240px] mx-auto w-full">
        <button onClick={onMenu} className="md:hidden p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-zinc-200 text-zinc-600"><Menu size={20} /></button>
        <div className="min-w-0">
          <p className="text-[11px] text-zinc-400 font-semibold tracking-wide">Escala+ <span className="mx-1">/</span> {titulo}</p>
          <h1 className="font-extrabold text-[17px] text-zinc-900 leading-tight tracking-tight truncate">{titulo}</h1>
          {descricao && <p className="text-xs text-zinc-400 truncate hidden sm:block">{descricao}</p>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 bg-white border border-zinc-200/80 rounded-xl px-3.5 py-2.5 w-72 shadow-soft focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10 transition">
            <Search size={16} className="text-zinc-400 shrink-0" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar funcionário, escala..." className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400" />
            {busca && <span className="text-[11px] text-zinc-400 bg-zinc-100 rounded-md px-2 py-0.5 whitespace-nowrap">{state.funcionarios.filter((f) => f.nome.toLowerCase().includes(busca.toLowerCase())).length} achados</span>}
          </div>
          <div className="relative" ref={ref}>
            <button onClick={() => setAberto(!aberto)} className="relative p-2.5 rounded-xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-soft text-zinc-600 hover:text-zinc-900 transition">
              <Bell size={18} />
              {naoLidas.length > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-brand-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#f7f7f5]">{naoLidas.length}</span>}
            </button>
            {aberto && (
              <div className="absolute right-0 mt-2 w-[340px] max-w-[90vw] bg-white border border-zinc-200 rounded-2xl shadow-pop overflow-hidden animate-fadeUp">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100">
                  <p className="font-bold text-sm">Notificações {naoLidas.length > 0 && <span className="text-brand-700">({naoLidas.length} novas)</span>}</p>
                  <button onClick={() => dispatch({ type: "NOT_ALL_READ" })} className="text-xs text-brand-700 font-bold hover:underline flex items-center gap-1"><CheckCheck size={14} /> Ler todas</button>
                </div>
                <div className="max-h-[340px] overflow-auto">
                  {state.notificacoes.slice(0, 8).map((n) => (
                    <button key={n.id} onClick={() => dispatch({ type: "NOT_READ", id: n.id })} className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-b border-zinc-50 transition flex gap-2.5">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.lida ? "bg-zinc-200" : "bg-brand-500"}`} />
                      <span><span className="block text-[13px] font-bold text-zinc-800">{n.titulo}</span><span className="block text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.descricao}</span><span className="block text-[11px] text-zinc-400 mt-1">{n.criadaEm}</span></span>
                    </button>
                  ))}
                  {state.notificacoes.length === 0 && <p className="p-5 text-sm text-zinc-400 text-center">Nenhuma notificação.</p>}
                </div>
              </div>
            )}
          </div>
          <Avatar nome={state.user.nome} cor="#18181b" tamanho="sm" />
        </div>
      </div>
    </header>
  );
}
