import { useState } from "react";
import type { MillState, Parada } from "@/hooks/useMillControl";
import { Clock, Plus, Trash2, Target, TrendingUp, Timer } from "lucide-react";

interface ProductionPanelProps {
  state: MillState;
  produzida: number;
  restante: number;
  ritmoH: number;
  tempoRestanteMin: number;
  previsaoTermino: Date;
  consumoTotal: number;
  totalParadasMin: number;
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

  return (
    <div className="flex flex-col gap-4">
      {/* Main metric: Previsão */}
      <div className="industrial-card p-4 text-center">
        <div className="label-industrial mb-1">Previsão de Término</div>
        <div className="metric-value-lg text-primary">
          {ritmoH > 0 ? formatTime(previsaoTermino) : "--:--"}
        </div>
        <div className="text-xs font-mono text-muted-foreground mt-1">
          {ritmoH > 0 ? formatMinutes(tempoRestanteMin) + " restantes" : "Aguardando produção"}
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="industrial-card p-3">
          <div className="label-industrial flex items-center gap-1"><TrendingUp size={10} /> Ritmo</div>
          <div className="metric-value text-foreground mt-1">{Math.round(ritmoH)}</div>
          <div className="text-[10px] text-muted-foreground font-mono">un/hora</div>
        </div>
        <div className="industrial-card p-3">
          <div className="label-industrial flex items-center gap-1"><Target size={10} /> Produção</div>
          <div className="metric-value text-success mt-1">{produzida}</div>
          <div className="text-[10px] text-muted-foreground font-mono">de {state.meta} ({restante} restam)</div>
        </div>
      </div>

      {/* Consumo */}
      <div className="industrial-card p-3">
        <div className="label-industrial">Consumo de Farinha</div>
        <div className="metric-value text-warning mt-1">{consumoTotal.toLocaleString("pt-BR")} kg</div>
      </div>

      {/* Input fields */}
      <div className="industrial-card p-4 space-y-3">
        <div className="label-industrial mb-2">Parâmetros de Produção</div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-industrial">Meta</label>
            <input
              type="number"
              className="input-industrial w-full mt-1"
              value={state.meta}
              onChange={(e) => setField("meta", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-industrial">Peso/Unidade (kg)</label>
            <select
              className="input-industrial w-full mt-1"
              value={state.pesoUnidade}
              onChange={(e) => setField("pesoUnidade", Number(e.target.value))}
            >
              <option value={25}>25 kg (Saca)</option>
              <option value={1150}>1150 kg (Bag)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-industrial">Contagem Inicial</label>
            <input
              type="number"
              className="input-industrial w-full mt-1"
              value={state.contagemInicial}
              onChange={(e) => setField("contagemInicial", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label-industrial">Contagem Atual</label>
            <input
              type="number"
              className="input-industrial w-full mt-1"
              value={state.contagemAtual}
              onChange={(e) => setField("contagemAtual", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-industrial flex items-center gap-1"><Clock size={10} /> Hora Início</label>
            <input
              type="time"
              className="input-industrial w-full mt-1"
              value={state.horaInicio}
              onChange={(e) => setField("horaInicio", e.target.value)}
            />
          </div>
          <div>
            <label className="label-industrial">Almoço (min)</label>
            <input
              type="number"
              className="input-industrial w-full mt-1"
              value={state.almocoMinutos}
              onChange={(e) => setField("almocoMinutos", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Paradas */}
      <div className="industrial-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="label-industrial flex items-center gap-1">
            <Timer size={10} /> Paradas ({totalParadasMin}min total)
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Motivo"
            className="input-industrial flex-1 text-xs"
            value={novoMotivo}
            onChange={(e) => setNovoMotivo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min"
            className="input-industrial w-16 text-xs"
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
            <Plus size={14} />
          </button>
        </div>

        {state.paradas.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {state.paradas.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-xs bg-background/50 rounded-lg px-2 py-1.5"
              >
                <span className="text-foreground/80">{p.motivo}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">{p.tempo}min</span>
                  <button
                    onClick={() => removeParada(p.id)}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 size={12} />
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
