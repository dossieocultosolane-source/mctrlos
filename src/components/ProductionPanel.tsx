import { useState } from "react";
import type { MillState, Parada } from "@/hooks/useMillControl";
import { Clock, Plus, Trash2, Target, TrendingUp, Timer, Gauge } from "lucide-react";

interface ProductionPanelProps {
  state: MillState;
  produzida: number;
  restante: number;
  ritmoH: number;
  tempoRestanteMin: number;
  previsaoTermino: Date;
  consumoTotal: number;
  totalParadasMin: number;
  oee: number;
  setField: <K extends keyof MillState>(key: K, value: MillState[K]) => void;
  addParada: (motivo: string, tempo: number) => void;
  removeParada: (id: string) => void;
}

export const ProductionPanel = ({
  state,
  produzida,
  restante,
  ritmoH,
  tempoRestanteMin,
  previsaoTermino,
  consumoTotal,
  totalParadasMin,
  oee,
  setField,
  addParada,
  removeParada,
}: ProductionPanelProps) => {
  const [novoMotivo, setNovoMotivo] = useState("");
  const [novoTempo, setNovoTempo] = useState(0);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const formatMinutes = (min: number) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const oeeColor = oee >= 85 ? "text-success" : oee >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="flex flex-col gap-3">
      {/* Top metrics row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="industrial-card p-3 text-center">
          <div className="label-industrial mb-0.5">Previsão</div>
          <div className="font-mono text-lg font-bold text-primary">
            {ritmoH > 0 ? formatTime(previsaoTermino) : "--:--"}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground">
            {ritmoH > 0 ? formatMinutes(tempoRestanteMin) : "Aguardando"}
          </div>
        </div>
        <div className="industrial-card p-3 text-center">
          <div className="label-industrial mb-0.5 flex items-center justify-center gap-1"><TrendingUp size={9} /> Ritmo</div>
          <div className="font-mono text-lg font-bold text-foreground">{Math.round(ritmoH)}</div>
          <div className="text-[9px] text-muted-foreground font-mono">un/hora</div>
        </div>
        <div className="industrial-card p-3 text-center">
          <div className="label-industrial mb-0.5 flex items-center justify-center gap-1"><Gauge size={9} /> OEE</div>
          <div className={`font-mono text-lg font-bold ${oeeColor}`}>{oee.toFixed(1)}%</div>
          <div className="text-[9px] text-muted-foreground font-mono">eficiência</div>
        </div>
      </div>

      {/* Production + Consumo row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="industrial-card p-3">
          <div className="label-industrial flex items-center gap-1"><Target size={9} /> Produção</div>
          <div className="font-mono text-xl font-bold text-success mt-0.5">{produzida}</div>
          <div className="text-[9px] text-muted-foreground font-mono">de {state.meta} ({restante} restam)</div>
        </div>
        <div className="industrial-card p-3">
          <div className="label-industrial">Consumo Farinha</div>
          <div className="font-mono text-xl font-bold text-warning mt-0.5">{consumoTotal.toLocaleString("pt-BR")}</div>
          <div className="text-[9px] text-muted-foreground font-mono">kg total</div>
        </div>
      </div>

      {/* Input fields - more compact */}
      <div className="industrial-card p-3 space-y-2">
        <div className="label-industrial mb-1">Parâmetros</div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="label-industrial text-[9px]">Meta</label>
            <input
              type="number"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.meta}
              onChange={(e) => setField("meta", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-industrial text-[9px]">Peso/Un (kg)</label>
            <select
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.pesoUnidade}
              onChange={(e) => setField("pesoUnidade", Number(e.target.value))}
            >
              <option value={25}>25 kg</option>
              <option value={1150}>1150 kg</option>
            </select>
          </div>
          <div>
            <label className="label-industrial text-[9px]">Ritmo Máx</label>
            <input
              type="number"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.ritmoMaximo}
              onChange={(e) => setField("ritmoMaximo", Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="label-industrial text-[9px]">Cont. Inicial</label>
            <input
              type="number"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.contagemInicial}
              onChange={(e) => setField("contagemInicial", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-industrial text-[9px]">Cont. Atual</label>
            <input
              type="number"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.contagemAtual}
              onChange={(e) => setField("contagemAtual", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-industrial text-[9px] flex items-center gap-0.5"><Clock size={8} /> Início</label>
            <input
              type="time"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.horaInicio}
              onChange={(e) => setField("horaInicio", e.target.value)}
            />
          </div>
          <div>
            <label className="label-industrial text-[9px]">Almoço</label>
            <input
              type="number"
              className="input-industrial w-full mt-0.5 py-1.5 text-xs"
              value={state.almocoMinutos}
              onChange={(e) => setField("almocoMinutos", Number(e.target.value))}
              placeholder="min"
            />
          </div>
        </div>
      </div>

      {/* Paradas - compact */}
      <div className="industrial-card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="label-industrial flex items-center gap-1">
            <Timer size={9} /> Paradas ({totalParadasMin}min)
          </div>
        </div>

        <div className="flex gap-1.5 mb-2">
          <input
            type="text"
            placeholder="Motivo"
            className="input-industrial flex-1 text-xs py-1.5"
            value={novoMotivo}
            onChange={(e) => setNovoMotivo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min"
            className="input-industrial w-14 text-xs py-1.5"
            value={novoTempo || ""}
            onChange={(e) => setNovoTempo(Number(e.target.value))}
          />
          <button
            className="btn-primary text-xs px-2 py-1"
            onClick={() => {
              if (novoMotivo && novoTempo > 0) {
                addParada(novoMotivo, novoTempo);
                setNovoMotivo("");
                setNovoTempo(0);
              }
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        {state.paradas.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {state.paradas.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-[11px] bg-background/50 rounded px-2 py-1"
              >
                <span className="text-foreground/80">{p.motivo}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-muted-foreground">{p.tempo}min</span>
                  <button
                    onClick={() => removeParada(p.id)}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
