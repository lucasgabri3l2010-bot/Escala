"use client";
import React from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function usePagination(total: number, porPagina = 8) {
  const [pagina, setPagina] = React.useState(1);
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const atual = Math.min(pagina, paginas);
  const fatia = <T,>(lista: T[]): T[] => lista.slice((atual - 1) * porPagina, atual * porPagina);
  React.useEffect(() => { setPagina(1); }, [total]);
  return { pagina: atual, paginas, setPagina, fatia };
}

type ToastItem = { id: number; msg: string; tipo: "ok" | "erro" | "info" };
const ToastCtx = React.createContext<{ push: (msg: string, tipo?: ToastItem["tipo"]) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = React.useState<ToastItem[]>([]);
  const push = React.useCallback((msg: string, tipo: ToastItem["tipo"] = "ok") => {
    const id = Date.now() + Math.random();
    setItens((l) => [...l, { id, msg, tipo }]);
    window.setTimeout(() => setItens((l) => l.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] space-y-2 w-[min(92vw,420px)]">
        {itens.map((t) => (
          <div key={t.id} className="animate-fadeUp flex items-center gap-2.5 bg-zinc-900 text-white text-sm pl-3 pr-4 py-3 rounded-2xl shadow-pop">
            <span className={`w-2 h-2 rounded-full shrink-0 ${t.tipo === "ok" ? "bg-emerald-400" : t.tipo === "erro" ? "bg-red-400" : "bg-brand-400"}`} />
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToastPush(): (msg: string, tipo?: ToastItem["tipo"]) => void {
  return React.useContext(ToastCtx).push;
}
