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

  return (
    <div className="industrial-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="label-industrial">GERENCIAMENTO DE SILOS</div>
      </div>

      <div className="relative">
        {/* SVG for pipe connections and animations */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient for pipes */}
            <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#718096" />
              <stop offset="100%" stopColor="#4a5568" />
            </linearGradient>
            
            {/* Animated dot for flow */}
            <circle id="flowDot" r="4" fill="#fbbf24" />
          </defs>

          {/* MOAGEM Label bracket */}
          <path
            d="M 75 60 L 75 50 L 525 50 L 525 60"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
          />
          <text x="300" y="42" textAnchor="middle" fill="#9ca3af" fontSize="14" fontWeight="bold">
            MOAGEM
          </text>

          {/* Vertical pipes from FA silos */}
          {[105, 210, 390, 495].map((x, i) => (
            <g key={`fa-pipe-${i}`}>
              {/* Main vertical pipe from FA silo */}
              <rect
                x={x - 4}
                y={175}
                width="8"
                height="80"
                fill="url(#pipeGradient)"
                rx="2"
              />
              {/* Junction dot */}
              <circle cx={x} cy={255} r="6" fill="#4a5568" stroke="#718096" strokeWidth="2" />
            </g>
          ))}

          {/* Horizontal collector pipe */}
          <rect x="101" y="251" width="398" height="8" fill="url(#pipeGradient)" rx="2" />
          
          {/* Center vertical pipe going down */}
          <rect x="296" y="255" width="8" height="60" fill="url(#pipeGradient)" rx="2" />
          
          {/* Junction at center bottom */}
          <circle cx="300" cy="315" r="6" fill="#4a5568" stroke="#718096" strokeWidth="2" />

          {/* Diagonal pipes to PM silos */}
          {/* Left diagonal to PM01 */}
          <line
            x1="300"
            y1="315"
            x2="180"
            y2="380"
            stroke="#4a5568"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="300"
            y1="315"
            x2="180"
            y2="380"
            stroke="#718096"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Right diagonal to PM02 */}
          <line
            x1="300"
            y1="315"
            x2="420"
            y2="380"
            stroke="#4a5568"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="300"
            y1="315"
            x2="420"
            y2="380"
            stroke="#718096"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* PRÉ-MISTURA Label bracket */}
          <path
            d="M 130 355 Q 130 345 140 345 L 200 345"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <path
            d="M 400 345 L 460 345 Q 470 345 470 355"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text x="300" y="348" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
            PRÉ-MISTURA
          </text>

          {/* Animated flow when transfer is active */}
          {transfer.rotaAtiva && (
            <>
              {/* Flow dots animation on vertical pipes from selected FA silos */}
              {transfer.origens.map((origem) => {
                const faIdx = faKeys.indexOf(origem);
                if (faIdx === -1) return null;
                const xPos = [105, 210, 390, 495][faIdx];
                
                return (
                  <g key={`flow-fa-${origem}`}>
                    {/* Animated dot going down from FA silo */}
                    <circle r="5" fill="#fbbf24">
                      <animate
                        attributeName="cy"
                        values="180;255"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cx"
                        values={`${xPos};${xPos}`}
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Flow on horizontal collector */}
              <circle r="5" fill="#fbbf24">
                <animate
                  attributeName="cx"
                  values="105;300"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="255;255"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="5" fill="#fbbf24">
                <animate
                  attributeName="cx"
                  values="495;300"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="255;255"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Flow down center pipe */}
              <circle r="5" fill="#fbbf24">
                <animate
                  attributeName="cy"
                  values="255;315"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  values="300;300"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Flow to PM01 */}
              {transfer.destinos.includes("PM01") && !transfer.sensorPausado["PM01"] && (
                <>
                  <circle r="5" fill="#fbbf24">
                    <animate
                      attributeName="cx"
                      values="300;180"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values="315;380"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Yellow arrow indicator */}
                  <polygon
                    points="170,365 180,375 175,375 175,390 165,390 165,375 160,375"
                    fill="#fbbf24"
                  >
                    <animate
                      attributeName="opacity"
                      values="1;0.5;1"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </polygon>
                </>
              )}

              {/* Flow to PM02 */}
              {transfer.destinos.includes("PM02") && !transfer.sensorPausado["PM02"] && (
                <>
                  <circle r="5" fill="#fbbf24">
                    <animate
                      attributeName="cx"
                      values="300;420"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values="315;380"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Yellow arrow indicator */}
                  <polygon
                    points="410,365 420,375 415,375 415,390 405,390 405,375 400,375"
                    fill="#fbbf24"
                  >
                    <animate
                      attributeName="opacity"
                      values="1;0.5;1"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </polygon>
                </>
              )}
            </>
          )}

          {/* Connection dots on pipes */}
          <circle cx="105" cy="215" r="4" fill="#6b7280" />
          <circle cx="210" cy="215" r="4" fill="#6b7280" />
          <circle cx="390" cy="215" r="4" fill="#6b7280" />
          <circle cx="495" cy="215" r="4" fill="#6b7280" />
          <circle cx="180" cy="395" r="4" fill="#6b7280" />
          <circle cx="420" cy="395" r="4" fill="#6b7280" />
        </svg>

        {/* FA Silos Row - MOAGEM */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-24 relative z-10 pt-16">
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

        {/* Spacer for pipe visualization */}
        <div className="h-32" />

        {/* PM Silos Row - PRÉ-MISTURA */}
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
