"use client";

import { SiloVisual } from "./silo-visual";
import type { MillState, TransferConfig } from "@/hooks/use-mill-control";

interface FlowDiagramProps {
  state: MillState;
  setSiloAtual: (nome: string, valor: number) => void;
  setTransfer: (updates: Partial<TransferConfig>) => void;
}

// Componente de Rosca Transportadora
function ScrewConveyor({
  x1,
  y1,
  x2,
  y2,
  isActive,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
  id: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  
  const screwPitch = 12; // Espacamento entre as helices
  const numHelices = Math.floor(length / screwPitch);
  
  return (
    <g transform={`translate(${x1}, ${y1}) rotate(${angle})`}>
      {/* Tubo externo da rosca */}
      <rect
        x="0"
        y="-8"
        width={length}
        height="16"
        fill="#2d3748"
        stroke="#4a5568"
        strokeWidth="1"
        rx="3"
      />
      
      {/* Interior do tubo */}
      <rect
        x="2"
        y="-6"
        width={length - 4}
        height="12"
        fill="#1a202c"
        rx="2"
      />
      
      {/* Helices da rosca */}
      {Array.from({ length: numHelices }).map((_, i) => (
        <g key={`helix-${id}-${i}`}>
          <ellipse
            cx={6 + i * screwPitch}
            cy="0"
            rx="3"
            ry="5"
            fill="none"
            stroke={isActive ? "#fbbf24" : "#718096"}
            strokeWidth="2"
            style={{
              animation: isActive
                ? `screwRotate 0.3s linear infinite`
                : "none",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        </g>
      ))}
      
      {/* Eixo central */}
      <line
        x1="0"
        y1="0"
        x2={length}
        y2="0"
        stroke={isActive ? "#fbbf24" : "#4a5568"}
        strokeWidth="2"
      />
      
      {/* Indicador de material fluindo */}
      {isActive && (
        <>
          <rect
            x="0"
            y="-4"
            width="20"
            height="8"
            fill="#fbbf24"
            opacity="0.6"
            rx="2"
          >
            <animate
              attributeName="x"
              values={`0;${length - 20}`}
              dur="1s"
              repeatCount="indefinite"
            />
          </rect>
        </>
      )}
    </g>
  );
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

  // Posicoes dos silos FA
  const faPositions = [
    { x: 75, y: 175 },   // FA01
    { x: 195, y: 175 },  // FA02
    { x: 405, y: 175 },  // FA03
    { x: 525, y: 175 },  // FA04
  ];

  // Posicoes dos silos PM
  const pmPositions = [
    { x: 180, y: 400 },  // PM01
    { x: 420, y: 400 },  // PM02
  ];

  // Ponto de juncao central
  const junctionPoint = { x: 300, y: 290 };

  return (
    <div className="industrial-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="label-industrial">GERENCIAMENTO DE SILOS</div>
      </div>

      <div className="relative">
        {/* CSS para animacao das roscas */}
        <style jsx>{`
          @keyframes screwRotate {
            0% {
              transform: scaleX(1);
            }
            50% {
              transform: scaleX(0.3);
            }
            100% {
              transform: scaleX(1);
            }
          }
        `}</style>

        {/* SVG for screw conveyors */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 520"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="motorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#2d3748" />
              <stop offset="100%" stopColor="#1a202c" />
            </linearGradient>
          </defs>

          {/* MOAGEM Label bracket */}
          <path
            d="M 55 60 L 55 50 L 545 50 L 545 60"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
          />
          <text x="300" y="42" textAnchor="middle" fill="#9ca3af" fontSize="14" fontWeight="bold">
            MOAGEM
          </text>

          {/* Motores dos silos FA */}
          {faPositions.map((pos, i) => {
            const isOrigemSelected = transfer.origens.includes(faKeys[i]);
            const isActive = transfer.rotaAtiva && isOrigemSelected;
            
            return (
              <g key={`motor-fa-${i}`}>
                {/* Caixa do motor */}
                <rect
                  x={pos.x - 12}
                  y={pos.y}
                  width="24"
                  height="18"
                  fill="url(#motorGradient)"
                  stroke={isActive ? "#fbbf24" : "#4a5568"}
                  strokeWidth="2"
                  rx="3"
                />
                {/* Indicador de status do motor */}
                <circle
                  cx={pos.x}
                  cy={pos.y + 9}
                  r="4"
                  fill={isActive ? "#22c55e" : "#6b7280"}
                >
                  {isActive && (
                    <animate
                      attributeName="fill"
                      values="#22c55e;#4ade80;#22c55e"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            );
          })}

          {/* Roscas transportadoras de FA para juncao */}
          {faPositions.map((pos, i) => {
            const isOrigemSelected = transfer.origens.includes(faKeys[i]);
            const isActive = transfer.rotaAtiva && isOrigemSelected;
            
            return (
              <ScrewConveyor
                key={`screw-fa-${i}`}
                x1={pos.x}
                y1={pos.y + 18}
                x2={junctionPoint.x}
                y2={junctionPoint.y}
                isActive={isActive}
                id={`fa-${i}`}
              />
            );
          })}

          {/* Caixa de juncao central */}
          <rect
            x={junctionPoint.x - 20}
            y={junctionPoint.y - 15}
            width="40"
            height="30"
            fill="#2d3748"
            stroke={transfer.rotaAtiva ? "#fbbf24" : "#4a5568"}
            strokeWidth="2"
            rx="5"
          />
          <text
            x={junctionPoint.x}
            y={junctionPoint.y + 4}
            textAnchor="middle"
            fill={transfer.rotaAtiva ? "#fbbf24" : "#9ca3af"}
            fontSize="10"
            fontWeight="bold"
          >
            JCT
          </text>

          {/* PRE-MISTURA Label bracket */}
          <path
            d="M 130 370 Q 130 360 140 360 L 200 360"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <path
            d="M 400 360 L 460 360 Q 470 360 470 370"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text x="300" y="363" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
            PRE-MISTURA
          </text>

          {/* Roscas transportadoras da juncao para PM */}
          {pmPositions.map((pos, i) => {
            const pmKey = pmKeys[i];
            const isDestinoSelected = transfer.destinos.includes(pmKey);
            const isSensorPaused = transfer.sensorPausado[pmKey];
            const isActive = transfer.rotaAtiva && isDestinoSelected && !isSensorPaused;
            
            return (
              <g key={`screw-pm-${i}`}>
                <ScrewConveyor
                  x1={junctionPoint.x}
                  y1={junctionPoint.y + 15}
                  x2={pos.x}
                  y2={pos.y}
                  isActive={isActive}
                  id={`pm-${i}`}
                />
                
                {/* Motor de entrada do PM */}
                <rect
                  x={pos.x - 12}
                  y={pos.y - 18}
                  width="24"
                  height="18"
                  fill="url(#motorGradient)"
                  stroke={isActive ? "#fbbf24" : "#4a5568"}
                  strokeWidth="2"
                  rx="3"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y - 9}
                  r="4"
                  fill={isActive ? "#22c55e" : isSensorPaused ? "#ef4444" : "#6b7280"}
                >
                  {isActive && (
                    <animate
                      attributeName="fill"
                      values="#22c55e;#4ade80;#22c55e"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            );
          })}

          {/* Legenda de status */}
          <g transform="translate(20, 480)">
            <rect x="0" y="0" width="12" height="12" fill="#22c55e" rx="2" />
            <text x="18" y="10" fill="#9ca3af" fontSize="10">Rosca Ativa</text>
            
            <rect x="100" y="0" width="12" height="12" fill="#fbbf24" rx="2" />
            <text x="118" y="10" fill="#9ca3af" fontSize="10">Material Fluindo</text>
            
            <rect x="220" y="0" width="12" height="12" fill="#ef4444" rx="2" />
            <text x="238" y="10" fill="#9ca3af" fontSize="10">Sensor Bloqueado</text>
          </g>
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

        {/* Spacer for screw conveyor visualization */}
        <div className="h-40" />

        {/* PM Silos Row - PRE-MISTURA */}
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
