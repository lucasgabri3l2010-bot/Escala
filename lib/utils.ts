export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function iniciais(nome: string): string {
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function agoraBR(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatarData(iso: string): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function prazoEncerrado(prazoHHMM: string, agora = new Date()): boolean {
  const [h, m] = prazoHHMM.split(":").map(Number);
  const limite = new Date(agora);
  limite.setHours(h || 0, m || 0, 0, 0);
  return agora.getTime() > limite.getTime();
}

export function baixarCSV(nome: string, linhas: string[][]): void {
  const csv = linhas.map((l) => l.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

const CORES_RARIDADE: Record<string, string> = {
  Normal: "bg-zinc-100 text-zinc-700",
  "Plantão": "bg-orange-100 text-orange-800",
  Sobreaviso: "bg-sky-100 text-sky-800",
  Cobertura: "bg-violet-100 text-violet-800",
  Atendimento: "bg-emerald-100 text-emerald-800",
  Folga: "bg-zinc-200 text-zinc-600",
  Férias: "bg-amber-100 text-amber-800",
  Ausência: "bg-red-100 text-red-700",
  Ativo: "bg-emerald-100 text-emerald-800",
  Pendente: "bg-amber-100 text-amber-800",
  Cancelada: "bg-red-100 text-red-700",
  Concluída: "bg-zinc-200 text-zinc-600",
  Concluído: "bg-zinc-200 text-zinc-600",
  Agendado: "bg-sky-100 text-sky-800",
  "Em andamento": "bg-orange-100 text-orange-800",
  Ativa: "bg-emerald-100 text-emerald-800",
  Aceita: "bg-emerald-100 text-emerald-800",
  Aprovada: "bg-emerald-100 text-emerald-800",
  Recusada: "bg-red-100 text-red-700"
};

export function corBadge(valor: string): string {
  return CORES_RARIDADE[valor] ?? "bg-zinc-100 text-zinc-700";
}
