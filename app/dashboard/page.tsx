"use client";
import React from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Anel, Badge, Button, Card, CardHeader, Empty, Paginacao, ProgressBar, SearchInput, Select, Stat } from "@/components/ui";
import { alimentacaoDoDia, useApp, useFuncionarioMap, useSetorMap, HOJE } from "@/lib/store";
import { useDebounce, usePagination } from "@/lib/hooks";
import { formatarData } from "@/lib/utils";
import { Users, MoonStar, Clock3, UtensilsCrossed, ArrowRight, ArrowUpRight, History, CheckCheck, Repeat2, LifeBuoy } from "lucide-react";

export default function DashboardPage() {
  const { state } = useApp();
  const fmap = useFuncionarioMap();
  const smap = useSetorMap();
  const [data, setData] = React.useState(HOJE);
  const [busca, setBusca] = React.useState("");
  const buscaDeb = useDebounce(busca);
  const [tipo, setTipo] = React.useState("Todos");

  const escalasDia = React.useMemo(
    () => state.escalas.filter((e) => e.data === data && (tipo === "Todos" || e.tipo === tipo) && (fmap[e.funcionarioId]?.nome.toLowerCase().includes(buscaDeb.toLowerCase()) ?? true)),
    [state.escalas, data, tipo, buscaDeb, fmap]
  );
  const pg = usePagination(escalasDia.length, 6);
  const doDia = state.declaracoes.filter((d) => d.data === data);
  const conf = doDia.filter((d) => d.vaiFicar).length;
  const nao = doDia.filter((d) => !d.vaiFicar).length;
  const ativos = state.funcionarios.filter((f) => f.status === "Ativo").length;
  const pend = Math.max(0, ativos - doDia.length);
  const alim = alimentacaoDoDia(state.declaracoes, state.funcionarios, state.setores, data);
  const plantoesDia = state.plantoes.filter((p) => p.data === data);
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const primeiro = state.user.nome.split(" ")[0];

  return (
    <Shell titulo="Dashboard" descricao="Visão geral da operação">
      {/* Cabeçalho */}
      <div className="card p-5 md:p-6 mb-4 flex flex-wrap items-center gap-4 bg-gradient-to-br from-white to-brand-50/40">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-700">{formatarData(data)} • Operação de hoje</p>
          <h2 className="text-[22px] md:text-2xl font-extrabold tracking-tight text-zinc-900 mt-1">{saudacao}, {primeiro}</h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">Confira o resumo das escalas, permanências e alimentação.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="input !w-auto shadow-soft" />
          <Link href="/escalas"><Button size="sm"><ArrowUpRight size={15} /> Nova escala</Button></Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <Stat nome="Escalados hoje" valor={escalasDia.length} detalhe="funcionários escalados" delta="+6 vs ontem" icone={<Users size={18} />} />
        <Stat nome="Plantões ativos" valor={plantoesDia.length} detalhe="em andamento e agendados" delta="+2 vs ontem" icone={<MoonStar size={18} />} />
        <Stat nome="Vão ficar" valor={conf} detalhe={`${pend} pendentes • ${nao} não vão`} delta={`${pend} a responder`} icone={<Clock3 size={18} />} />
        <Stat nome="Refeições previstas" valor={alim.total} detalhe={`${alim.marmitas} marmitas • ${alim.lanches} lanches`} delta="auto" icone={<UtensilsCrossed size={18} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Escalas */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader
            titulo={`Escalas de ${formatarData(data)}`}
            subtitulo={`${escalasDia.length} registros`}
            acao={<Link href="/escalas" className="text-[13px] font-bold text-brand-700 hover:underline inline-flex items-center gap-1">Gerenciar <ArrowRight size={14} /></Link>}
          />
          <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
            <SearchInput value={busca} onChange={setBusca} placeholder="Buscar funcionário..." className="!py-2 w-56" />
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)} className="!w-auto !py-2">
              <option>Todos</option><option>Normal</option><option>Plantão</option><option>Cobertura</option><option>Sobreaviso</option><option>Atendimento</option><option>Folga</option><option>Férias</option><option>Ausência</option>
            </Select>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[640px]">
              <thead><tr><th className="table-th">Funcionário</th><th className="table-th">Setor</th><th className="table-th">Horário</th><th className="table-th">Tipo</th><th className="table-th">Status</th></tr></thead>
              <tbody>
                {pg.fatia(escalasDia).map((e) => (
                  <tr key={e.id} className="table-row">
                    <td className="table-td"><p className="font-semibold">{fmap[e.funcionarioId]?.nome}</p><p className="text-xs text-zinc-400">{e.cargo}</p></td>
                    <td className="table-td"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: smap[e.setorId]?.cor }} />{smap[e.setorId]?.nome}</span></td>
                    <td className="table-td whitespace-nowrap font-medium tabular-nums">{e.inicio} — {e.fim}</td>
                    <td className="table-td"><Badge value={e.tipo} /></td>
                    <td className="table-td"><Badge value={e.status} dot /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {escalasDia.length === 0 && <Empty titulo="Nenhuma escala" descricao="Ajuste o filtro ou crie uma nova escala." />}
          </div>
          <Paginacao pagina={pg.pagina} paginas={pg.paginas} onMudar={pg.setPagina} />
        </Card>

        {/* Coluna lateral */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Anel valor={conf} total={conf + nao + pend} />
              <div><h3 className="font-bold text-zinc-900">Permanência</h3><p className="text-[13px] text-zinc-500 mt-0.5">{conf} confirmados<br />{nao} não ficarão • {pend} pendentes</p>
              <Link href="/permanencia" className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-brand-700 hover:underline">Responder / ver painel <ArrowRight size={14} /></Link></div>
            </div>
            <div className="mt-4"><ProgressBar valor={conf} total={conf + nao + pend} /></div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2"><UtensilsCrossed size={17} className="text-brand-600" /><h3 className="font-bold">Alimentação prevista</h3></div>
            <div className="flex items-end gap-2 mt-2"><p className="text-3xl font-extrabold">{alim.total}</p><p className="text-xs text-zinc-400 pb-1">refeições • {alim.marmitas} marmitas • {alim.lanches} lanches</p></div>
            <Link href="/alimentacao"><Button variant="outline" size="sm" className="w-full mt-3">Ver controle de alimentação</Button></Link>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold">Cardápio das marmitas</h3>
            {state.config.cardapioFoto ? (
              <Link href="/alimentacao" className="block mt-3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.config.cardapioFoto} alt="Cardápio das marmitas" className="w-full h-36 object-cover rounded-xl border border-zinc-200 group-hover:border-brand-300 transition" />
                <p className="text-xs text-zinc-400 mt-2">Publicado em {state.config.cardapioAtualizadoEm ?? "—"} • toque para ampliar</p>
              </Link>
            ) : (
              <div className="mt-2">
                <p className="text-[13px] text-zinc-400">Nenhum cardápio publicado ainda.</p>
                <Link href="/alimentacao" className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-brand-700 hover:underline">Publicar foto <ArrowRight size={14} /></Link>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <CardHeader titulo="Plantões de hoje" subtitulo={`${plantoesDia.length} registros`} acao={<Link href="/plantoes" className="text-xs font-bold text-brand-700 hover:underline">Ver todos</Link>} />
            <div className="p-3 space-y-2">
              {plantoesDia.map((p) => (
                <div key={p.id} className="border border-zinc-100 rounded-xl p-3 hover:border-brand-200 hover:bg-brand-50/40 transition">
                  <p className="text-[13px] font-bold">{fmap[p.funcionarioId]?.nome}</p>
                  <p className="text-xs text-zinc-500">{smap[p.setorId]?.nome} • {p.inicio} — {p.fim} • {p.tipo}</p>
                  <div className="mt-1.5"><Badge value={p.status} /></div>
                </div>
              ))}
              {plantoesDia.length === 0 && <p className="text-[13px] text-zinc-400 p-2">Nenhum plantão hoje.</p>}
            </div>
          </Card>
        </div>
      </div>

      {/* Atividades */}
      <Card className="mt-4 overflow-hidden">
        <CardHeader titulo="Atividades recentes" subtitulo="Últimas movimentações da operação" acao={<Link href="/historico" className="text-[13px] font-bold text-brand-700 hover:underline inline-flex items-center gap-1">Ver histórico <ArrowRight size={14} /></Link>} />
        <div className="p-5 grid md:grid-cols-2 gap-x-8 gap-y-4">
          {state.historico.length === 0 && <p className="text-[13px] text-zinc-400 md:col-span-2">Sem atividades ainda. As movimentações aparecem aqui.</p>}
          {state.historico.slice(0, 6).map((h) => (
            <div key={h.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                {h.modulo === "Permanência" ? <CheckCheck size={17} /> : h.modulo === "Trocas" ? <Repeat2 size={17} /> : h.modulo === "Coberturas" ? <LifeBuoy size={17} /> : <History size={17} />}
              </div>
              <div className="min-w-0"><p className="text-[13px] text-zinc-800"><b>{h.usuario}</b> {h.acao}</p><p className="text-xs text-zinc-400 truncate">{h.detalhe} • {h.dataHora}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
