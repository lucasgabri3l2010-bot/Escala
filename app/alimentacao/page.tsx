"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Alert, Button, Card, CardHeader, Input, PageHeader } from "@/components/ui";
import { alimentacaoDoDia, useApp, HOJE } from "@/lib/store";
import { useToastPush } from "@/lib/hooks";
import { formatarData, redimensionarImagem } from "@/lib/utils";
import { Camera, RefreshCw, Trash2, UtensilsCrossed, Loader2 } from "lucide-react";

export default function AlimentacaoPage() {
  const { state, dispatch } = useApp();
  const push = useToastPush();
  const [data, setData] = React.useState(HOJE);
  const [enviando, setEnviando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const calc = alimentacaoDoDia(state.declaracoes, state.funcionarios, state.setores, data);
  const finalizada = !!state.alimentacaoFinalizada[data];
  const podeGerenciar = state.user.cargo === "Administrador";
  const foto = state.config.cardapioFoto;

  function finalizar() {
    dispatch({ type: "FINALIZAR_ALIM", data });
    push("Quantidade finalizada e registrada no histórico.");
  }

  async function aoEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arq = e.target.files?.[0];
    e.target.value = "";
    if (!arq) return;
    setErro("");
    if (!arq.type.startsWith("image/")) { setErro("Selecione um arquivo de imagem (JPG ou PNG)."); return; }
    if (arq.size > 8 * 1024 * 1024) { setErro("Imagem muito grande. Use um arquivo de até 8 MB."); return; }
    setEnviando(true);
    try {
      const fotoReduzida = await redimensionarImagem(arq);
      dispatch({ type: "SET_CARDAPIO", foto: fotoReduzida });
      push("Foto do cardápio publicada.");
    } catch {
      setErro("Não foi possível processar a imagem. Tente outra foto.");
    } finally {
      setEnviando(false);
    }
  }

  function removerFoto() {
    dispatch({ type: "REMOVE_CARDAPIO" });
    push("Foto do cardápio removida.", "info");
  }

  return (
    <Shell titulo="Alimentação" descricao="Cálculo automático a partir de quem confirmou permanência">
      <PageHeader
        titulo="Alimentação"
        descricao={`Cardápio e quantidades de ${formatarData(data)}${state.config.responsavelMarmitas ? ` • Responsável: ${state.config.responsavelMarmitas}` : ""}`}
        acoes={<><Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="!w-auto" /><Button disabled={finalizada} onClick={finalizar}>Finalizar quantidade</Button></>}
      />
      {finalizada && <div className="mb-4"><Alert tipo="ok">Quantidade de {formatarData(data)} finalizada e registrada no histórico.</Alert></div>}

      <Card className="overflow-hidden mb-4">
        <CardHeader
          titulo="Cardápio das marmitas"
          subtitulo={foto ? `Publicado em ${state.config.cardapioAtualizadoEm ?? "—"}` : "Nenhuma foto publicada"}
          acao={podeGerenciar && foto ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={enviando} onClick={() => inputRef.current?.click()}><RefreshCw size={14} /> Trocar foto</Button>
              <Button size="sm" variant="ghost" onClick={removerFoto}><Trash2 size={14} /> Remover</Button>
            </div>
          ) : undefined}
        />
        <div className="p-5">
          {foto ? (
            <div className="grid md:grid-cols-2 gap-5 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="Cardápio das marmitas" className="w-full rounded-2xl border border-zinc-200 shadow-soft object-cover max-h-[420px]" />
              <div>
                <h4 className="font-bold text-zinc-900 flex items-center gap-2"><UtensilsCrossed size={17} className="text-brand-600" /> Cardápio da semana</h4>
                <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">
                  Foto publicada{state.config.responsavelMarmitas ? ` por ${state.config.responsavelMarmitas}` : ""} em {state.config.cardapioAtualizadoEm ?? "—"}.
                  Confira as opções antes de confirmar sua permanência.
                </p>
                {!podeGerenciar && <p className="text-xs text-zinc-400 mt-3">A troca da foto é feita apenas pelo administrador.</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center"><Camera size={22} /></div>
              <p className="font-bold text-zinc-800 mt-3">Nenhum cardápio publicado</p>
              <p className="text-[13px] text-zinc-500 mt-1 max-w-sm">A responsável pelas marmitas pode fotografar o cardápio e publicar aqui para toda a equipe ver.</p>
              {podeGerenciar && <Button size="sm" className="mt-4" disabled={enviando} onClick={() => inputRef.current?.click()}>{enviando ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : <><Camera size={15} /> Publicar foto do cardápio</>}</Button>}
            </div>
          )}
          {erro && <div className="mt-4"><Alert tipo="erro">{erro}</Alert></div>}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={aoEscolherFoto} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{ n: "Marmitas (almoço)", v: calc.marmitas }, { n: "Lanches (noite)", v: calc.lanches }, { n: "Total", v: calc.total }].map((c) => (
          <Card key={c.n} className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{c.n}</p><p className="text-3xl font-extrabold text-zinc-900 mt-1">{c.v}</p></Card>
        ))}
      </div>
      <Card className="overflow-hidden mb-4">
        <CardHeader titulo="Por setor" subtitulo="Quantas pessoas ficam em cada setor" />
        <div className="overflow-auto">
          <table className="w-full min-w-[480px]">
            <thead><tr><th className="table-th">Setor</th><th className="table-th">Marmitas</th><th className="table-th">Lanches</th><th className="table-th">Total</th></tr></thead>
            <tbody>
              {calc.porSetor.map((s) => (
                <tr key={s.setorId} className="table-row">
                  <td className="table-td font-semibold"><span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.cor }} />{s.nome}</span></td>
                  <td className="table-td">{s.marmitas}</td>
                  <td className="table-td">{s.lanches}</td>
                  <td className="table-td font-bold">{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-bold mb-1">Alimentação de {formatarData(data)}</h3>
          <p className="text-sm text-zinc-500 mb-3">Contabiliza apenas quem respondeu <b>SIM, VOU FICAR</b>. Quem respondeu NÃO ou está pendente não entra no cálculo. Cancelamento de escala atualiza automaticamente.</p>
          <ul className="text-sm space-y-1.5 max-h-80 overflow-auto">
            {calc.lista.map((l, i) => <li key={i} className="flex justify-between border border-zinc-100 rounded-lg px-3 py-2"><span>{l.nome} <span className="text-xs text-zinc-400">• {l.periodo}</span></span><span className="text-zinc-500 text-xs">{l.motivo}</span></li>)}
            {calc.lista.length === 0 && <li className="text-zinc-500">Ninguém confirmado para este dia.</li>}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-bold mb-2">Regra da refeição</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-zinc-500">Fica no almoço</span><b>Marmita</b></li>
            <li className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-zinc-500">Fica à noite</span><b>Lanche</b></li>
          </ul>
          <p className="text-xs text-zinc-400 mt-3">A refeição é automática pelo período. Não há escolha de tipo.</p>
        </Card>
      </div>
    </Shell>
  );
}
