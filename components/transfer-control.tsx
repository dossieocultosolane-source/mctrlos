"use client";

import type { TransferConfig } from "@/hooks/use-mill-control";
import { Power } from "lucide-react";

interface TransferControlProps {
  transfer: TransferConfig;
  setTransfer: (updates: Partial<TransferConfig>) => void;
  toggleRota: () => void;
  sensorPausado: Record<string, boolean>;
}

const FA_SILOS = ["FA01", "FA02", "FA03", "FA04"];

export function TransferControl({
  transfer,
  setTransfer,
  toggleRota,
}: TransferControlProps) {
  return (
    <div className="bg-[#252525] rounded-lg border border-[#333] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#333]">
        <h2 className="text-sm font-semibold text-white">CONTROLE DE TRANSILAGEM</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Silo Origem */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Silo Origem</label>
          <select
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
            value={transfer.origens[0] || ""}
            onChange={(e) => {
              if (e.target.value) {
                setTransfer({ origens: [e.target.value] });
              }
            }}
          >
            <option value="">Silo Origem</option>
            {FA_SILOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Silo Destino */}
        <div>
          <label className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <input
              type="checkbox"
              checked={transfer.destinos.length === 2}
              onChange={(e) => {
                if (e.target.checked) {
                  setTransfer({ destinos: ["PM01", "PM02"] });
                } else {
                  setTransfer({ destinos: ["PM01"] });
                }
              }}
              className="rounded border-gray-600"
            />
            Silo Destino (PM01 / PM02)
          </label>
        </div>

        {/* Fluxo */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Fluxo (kg/min)</label>
          <input
            type="number"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
            value={transfer.fluxoKgMin}
            onChange={(e) => setTransfer({ fluxoKgMin: Number(e.target.value) })}
            min={1}
          />
        </div>

        {/* Toggle button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRota}
            className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              transfer.rotaAtiva
                ? "bg-green-600 text-white"
                : "bg-green-700 text-white"
            }`}
          >
            <Power size={16} />
            Ligar / Desligar Rota
          </button>
          <div
            className={`w-6 h-6 rounded ${
              transfer.rotaAtiva ? "bg-green-500" : "bg-red-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
