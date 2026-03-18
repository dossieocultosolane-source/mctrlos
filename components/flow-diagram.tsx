"use client";

import { motion } from "framer-motion";
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

  const isSourceActive = (siloId: string) => {
    return transfer.rotaAtiva && transfer.origens.includes(siloId);
  };

  return (
    <div className="industrial-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="label-industrial">GERENCIAMENTO DE SILOS</div>
      </div>

      <div className="relative">
        {/* Label MOAGEM */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium tracking-wider">
            MOAGEM
          </span>
          <div className="w-12 h-px bg-border" />
        </div>

        {/* FA Silos Row */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-4 relative z-10">
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

        {/* SVG para tubulacao */}
        <svg
          className="w-full h-32 sm:h-40"
          viewBox="0 0 400 120"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#718096" />
              <stop offset="100%" stopColor="#4a5568" />
            </linearGradient>
            <filter id="pipeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Tubos verticais descendo de cada silo FA */}
          {faKeys.map((key, index) => {
            const xPos = 50 + index * 100;
            const isActive = isSourceActive(key);

            return (
              <g key={`pipe-${key}`}>
                {/* Tubo vertical */}
                <line
                  x1={xPos}
                  y1="0"
                  x2={xPos}
                  y2="30"
                  stroke="url(#pipeGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#pipeShadow)"
                />

                {/* Animacao de fluxo */}
                {isActive && (
                  <motion.circle
                    r="4"
                    fill="#fbbf24"
                    initial={{ cy: 0, opacity: 0 }}
                    animate={{
                      cy: [0, 15, 30],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    cx={xPos}
                  />
                )}
              </g>
            );
          })}

          {/* Tubo horizontal coletando todos */}
          <line
            x1="40"
            y1="30"
            x2="360"
            y2="30"
            stroke="url(#pipeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#pipeShadow)"
          />

          {/* Tubo central descendo para bifurcacao */}
          <line
            x1="200"
            y1="30"
            x2="200"
            y2="60"
            stroke="url(#pipeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#pipeShadow)"
          />

          {/* Bifurcacao para PM01 */}
          <line
            x1="200"
            y1="60"
            x2="120"
            y2="100"
            stroke="url(#pipeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#pipeShadow)"
          />

          {/* Bifurcacao para PM02 */}
          <line
            x1="200"
            y1="60"
            x2="280"
            y2="100"
            stroke="url(#pipeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#pipeShadow)"
          />

          {/* Animacao no tubo central e bifurcacao */}
          {transfer.rotaAtiva && (
            <>
              {/* Fluxo horizontal */}
              <motion.circle
                r="4"
                fill="#fbbf24"
                animate={{
                  cx: [40, 200, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                cy={30}
              />

              {/* Fluxo descendo */}
              <motion.circle
                r="4"
                fill="#fbbf24"
                animate={{
                  cy: [30, 45, 60],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
                cx={200}
              />

              {/* Fluxo para PM01 */}
              {transfer.destinos.includes("PM01") && !transfer.sensorPausado["PM01"] && (
                <motion.circle
                  r="4"
                  fill="#fbbf24"
                  animate={{
                    cx: [200, 160, 120],
                    cy: [60, 80, 100],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                  }}
                />
              )}

              {/* Fluxo para PM02 */}
              {transfer.destinos.includes("PM02") && !transfer.sensorPausado["PM02"] && (
                <motion.circle
                  r="4"
                  fill="#fbbf24"
                  animate={{
                    cx: [200, 240, 280],
                    cy: [60, 80, 100],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1.2,
                  }}
                />
              )}
            </>
          )}
        </svg>

        {/* Label PRE-MISTURA */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-px bg-warning" />
          <span className="text-xs text-warning font-medium tracking-wider">
            PRE-MISTURA
          </span>
          <div className="w-8 h-px bg-warning" />
        </div>

        {/* PM Silos Row */}
        <div className="flex justify-center gap-16 sm:gap-32 relative z-10">
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
              showSensorIndicator
            />
          ))}
        </div>
      </div>
    </div>
  );
}
