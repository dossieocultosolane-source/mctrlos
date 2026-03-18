"use client";

import type { TransferConfig } from "@/hooks/use-mill-control";
import { Power, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TransferControlProps {
  transfer: TransferConfig;
  setTransfer: (updates: Partial<TransferConfig>) => void;
  toggleRota: () => void;
  sensorPausado: Record<string, boolean>;
}

const FA_SILOS = ["FA01", "FA02", "FA03", "FA04"];
const PM_SILOS = ["PM01", "PM02"];

export function TransferControl({
  transfer,
  setTransfer,
  toggleRota,
  sensorPausado,
}: TransferControlProps) {
  const toggleOrigem = (silo: string) => {
    const next = transfer.origens.includes(silo)
      ? transfer.origens.filter((s) => s !== silo)
      : [...transfer.origens, silo];
    if (next.length > 0) {
      // Auto-distribute percentages equally for new selections
      const newPct: Record<string, number> = {};
      const equal = Math.round(100 / next.length);
      next.forEach((s, i) => {
        newPct[s] =
          i === next.length - 1 ? 100 - equal * (next.length - 1) : equal;
      });
      setTransfer({ origens: next, origemPct: newPct });
    }
  };

  const toggleDestino = (silo: string) => {
    const next = transfer.destinos.includes(silo)
      ? transfer.destinos.filter((s) => s !== silo)
      : [...transfer.destinos, silo];
    if (next.length > 0) {
      const newPct: Record<string, number> = {};
      const equal = Math.round(100 / next.length);
      next.forEach((s, i) => {
        newPct[s] =
          i === next.length - 1 ? 100 - equal * (next.length - 1) : equal;
      });
      setTransfer({ destinos: next, destinoPct: newPct });
    }
  };

  const handleOrigemPctChange = (silo: string, value: number) => {
    if (transfer.origens.length !== 2) return;
    const other = transfer.origens.find((s) => s !== silo)!;
    setTransfer({
      origemPct: { [silo]: value, [other]: 100 - value },
    });
  };

  const handleDestinoPctChange = (silo: string, value: number) => {
    if (transfer.destinos.length !== 2) return;
    const other = transfer.destinos.find((s) => s !== silo)!;
    setTransfer({
      destinoPct: { [silo]: value, [other]: 100 - value },
    });
  };

  const anyPaused = Object.values(sensorPausado).some(Boolean);

  return (
    <div className="industrial-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="label-industrial flex items-center gap-1">
          <Zap size={10} /> Controle de Transilagem
        </div>
        {anyPaused && (
          <span className="text-[9px] font-mono text-warning uppercase tracking-wider sensor-pulse">
            Sensor Ativo
          </span>
        )}
      </div>

      {/* Origens */}
      <div>
        <div className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
          Origem (FA)
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FA_SILOS.map((s) => (
            <button
              key={s}
              onClick={() => toggleOrigem(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                transfer.origens.includes(s)
                  ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
              {transfer.origens.includes(s) && transfer.origens.length > 1 && (
                <span className="ml-1 text-[9px] opacity-75">
                  {transfer.origemPct[s] ?? 50}%
                </span>
              )}
            </button>
          ))}
        </div>
        {transfer.origens.length === 2 && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-muted-foreground w-8">
                {transfer.origens[0]}
              </span>
              <Slider
                value={[transfer.origemPct[transfer.origens[0]] ?? 50]}
                onValueChange={([v]) =>
                  handleOrigemPctChange(transfer.origens[0], v)
                }
                min={10}
                max={90}
                step={5}
                className="flex-1"
              />
              <span className="text-[9px] font-mono text-muted-foreground w-8">
                {transfer.origens[1]}
              </span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-primary">
              <span>{transfer.origemPct[transfer.origens[0]] ?? 50}%</span>
              <span>{transfer.origemPct[transfer.origens[1]] ?? 50}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Destinos */}
      <div>
        <div className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
          Destino (PM)
        </div>
        <div className="flex gap-1.5">
          {PM_SILOS.map((s) => (
            <button
              key={s}
              onClick={() => toggleDestino(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                transfer.destinos.includes(s)
                  ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
              {transfer.destinos.includes(s) &&
                transfer.destinos.length > 1 && (
                  <span className="ml-1 text-[9px] opacity-75">
                    {transfer.destinoPct[s] ?? 50}%
                  </span>
                )}
              {sensorPausado[s] && <span className="ml-1 text-warning">*</span>}
            </button>
          ))}
        </div>
        {transfer.destinos.length === 2 && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-muted-foreground w-8">
                {transfer.destinos[0]}
              </span>
              <Slider
                value={[transfer.destinoPct[transfer.destinos[0]] ?? 50]}
                onValueChange={([v]) =>
                  handleDestinoPctChange(transfer.destinos[0], v)
                }
                min={10}
                max={90}
                step={5}
                className="flex-1"
              />
              <span className="text-[9px] font-mono text-muted-foreground w-8">
                {transfer.destinos[1]}
              </span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-primary">
              <span>{transfer.destinoPct[transfer.destinos[0]] ?? 50}%</span>
              <span>{transfer.destinoPct[transfer.destinos[1]] ?? 50}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Fluxo */}
      <div>
        <div className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
          Fluxo (kg/min)
        </div>
        <input
          type="number"
          className="input-industrial w-full"
          value={transfer.fluxoKgMin}
          onChange={(e) => setTransfer({ fluxoKgMin: Number(e.target.value) })}
          min={1}
        />
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleRota}
        className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
          transfer.rotaAtiva
            ? "bg-success/20 text-success ring-1 ring-success/50"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        <Power size={16} />
        {transfer.rotaAtiva ? "Rota Ativa" : "Ligar Rota"}
      </button>
    </div>
  );
}
