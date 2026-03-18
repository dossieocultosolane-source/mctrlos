"use client";

import { motion } from "framer-motion";
import { SiloVisual } from "./silo-visual";
import type { MillState, TransferConfig } from "@/hooks/use-mill-control";
import { MoreVertical } from "lucide-react";

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
    <div className="bg-[#252525] rounded-lg border border-[#333] overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
        <h2 className="text-sm font-semibold text-white">GERENCIAMENTO DE SILOS</h2>
        <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 h-px bg-[#444]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 border-l border-t border-b border-[#666]" />
            <span className="text-xs text-gray-400 font-medium tracking-wider px-2">MOAGEM</span>
            <div className="w-2 h-4 border-r border-t border-b border-[#666]" />
          </div>
          <div className="flex-1 h-px bg-[#444]" />
        </div>

        <div className="flex justify-center gap-6 mb-6">
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

        <svg className="w-full" height="180" viewBox="0 0 600 180" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5a6a7a" />
              <stop offset="50%" stopColor="#8090a0" />
              <stop offset="100%" stopColor="#5a6a7a" />
            </linearGradient>
          </defs>

          {faKeys.map((key, index) => {
            const xPos = 95 + index * 140;
            const isActive = isSourceActive(key);
            return (
              <g key={key}>
                <rect x={xPos - 4} y="0" width="8" height="35" fill="url(#pipeGradient)" rx="2" />
                <circle cx={xPos} cy="35" r="6" fill="#8090a0" stroke="#5a6a7a" strokeWidth="2" />
                {isActive && (
                  <motion.circle
                    r="4"
                    fill="#fbbf24"
                    cx={xPos}
                    initial={{ cy: 0, opacity: 0 }}
                    animate={{ cy: [0, 17, 35], opacity: [0, 1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </g>
            );
          })}

          <rect x="85" y="31" width="430" height="8" fill="url(#pipeGradient)" rx="2" />

          {faKeys.map((_, index) => {
            const xPos = 95 + index * 140;
            return <circle key={index} cx={xPos} cy="35" r="5" fill="#6a7a8a" />;
          })}

          <rect x="296" y="35" width="8" height="40" fill="url(#pipeGradient)" rx="2" />
          <line x1="300" y1="75" x2="180" y2="140" stroke="url(#pipeGradient)" strokeWidth="8" strokeLinecap="round" />
          <line x1="300" y1="75" x2="420" y2="140" stroke="url(#pipeGradient)" strokeWidth="8" strokeLinecap="round" />

          {transfer.rotaAtiva && (
            <>
              <motion.polygon
                points="175,130 185,130 180,145"
                fill="#fbbf24"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.polygon
                points="415,130 425,130 420,145"
                fill="#fbbf24"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
              />
            </>
          )}

          <circle cx="180" cy="145" r="5" fill="#6a7a8a" />
          <circle cx="420" cy="145" r="5" fill="#6a7a8a" />

          {transfer.rotaAtiva && (
            <>
              <motion.circle
                r="4"
                fill="#fbbf24"
                cy={35}
                animate={{ cx: [85, 300, 515], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                r="4"
                fill="#fbbf24"
                cx={300}
                animate={{ cy: [35, 55, 75], opacity: [0, 1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              {transfer.destinos.includes("PM01") && !transfer.sensorPausado["PM01"] && (
                <motion.circle
                  r="4"
                  fill="#fbbf24"
                  animate={{ cx: [300, 240, 180], cy: [75, 107, 140], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.8 }}
                />
              )}
              {transfer.destinos.includes("PM02") && !transfer.sensorPausado["PM02"] && (
                <motion.circle
                  r="4"
                  fill="#fbbf24"
                  animate={{ cx: [300, 360, 420], cy: [75, 107, 140], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 1 }}
                />
              )}
            </>
          )}
        </svg>

        <div className="flex items-center justify-center gap-4 my-4">
          <div className="flex-1 h-px bg-[#5a4a00]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 border-l border-t border-b border-[#8a7a00]" />
            <span className="text-xs text-yellow-500 font-medium tracking-wider px-2">PRE-MISTURA</span>
            <div className="w-2 h-4 border-r border-t border-b border-[#8a7a00]" />
          </div>
          <div className="flex-1 h-px bg-[#5a4a00]" />
        </div>

        <div className="flex justify-center gap-32">
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
              size="large"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
