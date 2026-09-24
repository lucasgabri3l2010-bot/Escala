"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Topbar } from "./layout";
import { ToastProvider } from "@/lib/hooks";
import { useApp } from "@/lib/store";

function Protegido({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const [recolhida, setRecolhida] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    if (!state.logado) router.replace("/login");
  }, [state.logado, router]);

  if (!state.logado) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar recolhida={recolhida} setRecolhida={setRecolhida} mobileAberta={mobile} setMobileAberta={setMobile} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar titulo={titulo} descricao={descricao} onMenu={() => setMobile(true)} />
        <main className="flex-1 px-4 md:px-7 py-6 max-w-[1240px] w-full mx-auto page-enter">{children}</main>
        <footer className="px-7 pb-6 text-[11px] text-zinc-400 max-w-[1240px] w-full mx-auto">Escala+ • Dados mockados prontos para API • {new Date().getFullYear()}</footer>
      </div>
    </div>
  );
}

export function Shell({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Protegido titulo={titulo} descricao={descricao}>{children}</Protegido>
    </ToastProvider>
  );
}
