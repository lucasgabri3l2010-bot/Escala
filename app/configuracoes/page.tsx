"use client";
import React from "react";
import { Shell } from "@/components/Shell";
import { Button, Card, Field, Input, Toast, useToast, Tabs } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function ConfigPage() {
  const { state, dispatch } = useApp();
  const [aba, setAba] = React.useState("Empresa");
  const [msg, show] = useToast();
  const [cfg, setCfg] = React.useState(state.config);

  function salvar() { dispatch({ type: "SET_CONFIG", c: cfg }); show("Configurações salvas."); }

  return (
    <Shell titulo="Configurações" descricao="Empresa, escalas, permanência, alimentação e permissões">
      <Tabs abas={["Empresa", "Permanência", "Alimentação", "Permissões"]} ativa={aba} onTrocar={setAba} />
      <Card className="p-5 mt-3 max-w-2xl">
        {aba === "Empresa" && (
          <div className="space-y-3">
            <Field label="Nome da empresa"><Input value={cfg.empresaNome} onChange={(e) => setCfg({ ...cfg, empresaNome: e.target.value })} /></Field>
            <p className="text-xs text-zinc-500">Tipos de escala ativos: Normal, Plantão, Sobreaviso, Cobertura, Atendimento, Folga, Férias, Ausência. Regra de conflito: sobreposição de horário para o mesmo funcionário é bloqueada com aviso.</p>
          </div>
        )}
        {aba === "Permanência" && (
          <div className="space-y-3">
            <Field label="Prazo do almoço (HH:mm)"><Input type="time" value={cfg.prazoAlmoco ?? cfg.prazoResposta} onChange={(e) => setCfg({ ...cfg, prazoAlmoco: e.target.value })} /></Field>
            <Field label="Prazo da noite e do NÃO (HH:mm)"><Input type="time" value={cfg.prazoNoite ?? "17:35"} onChange={(e) => setCfg({ ...cfg, prazoNoite: e.target.value })} /></Field>
            <Field label="Motivos (separados por vírgula)"><Input value={cfg.motivosPermanencia.join(", ")} onChange={(e) => setCfg({ ...cfg, motivosPermanencia: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Field>
            <p className="text-xs text-zinc-500">Antes do prazo o funcionário pode alterar. Depois, a resposta bloqueia e só Administrador/Supervisor altera manualmente.</p>
          </div>
        )}
        {aba === "Alimentação" && (
          <div className="space-y-3">
            <Field label="Responsável pelas marmitas"><Input value={cfg.responsavelMarmitas} onChange={(e) => setCfg({ ...cfg, responsavelMarmitas: e.target.value })} placeholder="Ex: nome da responsável" /></Field>
            <p className="text-xs text-zinc-500">Regra fixa: quem fica no almoço recebe marmita, quem fica à noite recebe lanche. A foto do cardápio é publicada na página Alimentação, apenas pelo administrador.</p>
          </div>
        )}
        {aba === "Permissões" && (
          <div className="text-sm space-y-2">
            <p><b>Administrador:</b> acesso completo, aprova trocas, altera após prazo, finaliza alimentação.</p>
            <p><b>Supervisor:</b> gerencia escalas e acompanha funcionários do setor, aprova trocas.</p>
            <p><b>Funcionário:</b> visualiza escala, solicita troca e responde “Vou ficar?”.</p>
            <p className="text-xs text-zinc-500">Rotas estruturadas por papel. Validação aplicada nas ações sensíveis (ex: aprovar troca).</p>
          </div>
        )}
        <div className="flex justify-end mt-5"><Button onClick={salvar}>Salvar configurações</Button></div>
      </Card>
      <Toast msg={msg} />
    </Shell>
  );
}
