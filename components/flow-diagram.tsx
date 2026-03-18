"use client";

import { SiloVisual } from "./silo-visual";
import type { MillState, TransferConfig } from "@/hooks/use-mill-control";

interface FlowDiagramProps {
  state: MillState;
  setSiloAtual: (nome: string, valor: number) => void;
  setTransfer: (updates: Partial<TransferConfig>) => void;
}

export function FlowDiagram({
  state,
  setSiloAtual,
  setTransfer,
}: FlowDiagramProps) {
  const { silos, transfer } = state;
  const faKeys = ["FA01", "FA02", "FA03", "FA04"];
  const pmKeys = ["PM01", "PM02"];

  const toggleOrigem = (silo: string) => {
    const next = transfer.origens.includes(silo)
      ? transfer.origens.filter((s) => s !== silo)
      : [...transfer.origens, silo];
    if (next.length > 0) setTransfer({ origens: next });
  };

  const toggleDestino = (silo: string) => {
    const next = transfer.destinos.includes(silo)
      ? transfer.destinos.filter((s) => s !== silo)
      : [...transfer.destinos, silo];
    if (next.length > 0) setTransfer({ destinos: next });
  };

  // Calculate SVG connection lines
  const faPositions = faKeys.map((_, i) => ({
    x: 60 + i * 100,
    y: 160,
  }));

  const pmPositions = pmKeys.map((_, i) => ({
    x: 110 + i * 180,
    y: 300,
  }));

  return (
    <div className="industrial-card p-4">
      <div className="label-industrial mb-3">Diagrama de Fluxo</div>

      <div className="relative">
        {/* SVG for flow lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 440 420"
          preserveAspectRatio="xMidYMid meet"
        >
          {transfer.rotaAtiva &&
            transfer.origens.map((orig) => {
              const faIdx = faKeys.indexOf(orig);
              if (faIdx === -1) return null;
              const faPos = faPositions[faIdx];

              return transfer.destinos.map((dest) => {
                const pmIdx = pmKeys.indexOf(dest);
                if (pmIdx === -1) return null;
                const pmPos = pmPositions[pmIdx];
                const isPaused = transfer.sensorPausado[dest];

                return (
                  <line
                    key={`${orig}-${dest}`}
                    x1={faPos.x}
                    y1={faPos.y}
                    x2={pmPos.x}
                    y2={pmPos.y}
                    stroke={
                      isPaused
                        ? "var(--color-warning)"
                        : "var(--color-primary)"
                    }
                    strokeWidth="2"
                    className={isPaused ? "" : "flow-line-active"}
                    opacity={isPaused ? 0.4 : 0.8}
                  />
                );
              });
            })}
        </svg>

        {/* FA Silos Row */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-16 relative z-10">
          {faKeys.map((key) => (
            <SiloVisual
              key={key}
              nome={key}
              atual={silos[key].atual}
              max={silos[key].max}
              sensorAtivo={silos[key].sensorAtivo}
              selected={transfer.origens.includes(key)}
              onClick={() => toggleOrigem(key)}
              onValueChange={(v) => setSiloAtual(key, v)}
            />
          ))}
        </div>

        {/* Flow indicator */}
        <div className="flex justify-center mb-16 relative z-10">
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
              transfer.rotaAtiva
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {transfer.rotaAtiva
              ? Object.values(transfer.sensorPausado).some(Boolean)
                ? "Transilagem Pausada - Sensor"
                : `Transilagem ${transfer.fluxoKgMin} kg/min`
              : "Rota Desligada"}
          </div>
        </div>

        {/* PM Silos Row */}
        <div className="flex justify-center gap-4 sm:gap-8 relative z-10">
          {pmKeys.map((key) => (
            <SiloVisual
              key={key}
              nome={key}
              atual={silos[key].atual}
              max={silos[key].max}
              sensorAtivo={silos[key].sensorAtivo}
              selected={transfer.destinos.includes(key)}
              onClick={() => toggleDestino(key)}
              onValueChange={(v) => setSiloAtual(key, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
