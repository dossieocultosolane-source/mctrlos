"use client";

import { useState } from "react";
import type { MillState } from "@/hooks/use-mill-control";
import { MoreVertical, Plus, FileText } from "lucide-react";

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

export function ProductionPanel({
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
}: ProductionPanelProps) {
  const [novoMotivo, setNovoMotivo] = useState("");
  const [novoTempo, setNovoTempo] = useState(0);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // OEE gauge component
  const OEEGauge = ({ value }: { value: number }) => {
    const angle = (value / 100) * 180 - 90;
    return (
      <div className="relative w-20 h-12 overflow-hidden">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#333"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 126} 126`}
          />
          {/* Needle */}
          <line
            x1="50"
            y1="50"
            x2={50 + 30 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 30 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="4" fill="white" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#252525] rounded-lg border border-[#333] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
        <h2 className="text-sm font-semibold text-white">DASHBOARD DE PRODUCAO</h2>
        <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="p-4 space-y-3">
        {/* Inputs */}
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Meta de Producao (un)"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white placeholder-gray-500"
            value={state.meta || ""}
            onChange={(e) => setField("meta", Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Contagem Inicial Datadora"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white placeholder-gray-500"
            value={state.contagemInicial || ""}
            onChange={(e) => setField("contagemInicial", Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Contagem Atual Datadora"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white placeholder-gray-500"
            value={state.contagemAtual || ""}
            onChange={(e) => setField("contagemAtual", Number(e.target.value))}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-36">Hora Inicio Producao</span>
            <input
              type="time"
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
              value={state.horaInicio}
              onChange={(e) => setField("horaInicio", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-36">Almoco (min)</span>
            <input
              type="number"
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
              value={state.almocoMinutos}
              onChange={(e) => setField("almocoMinutos", Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-36">Tempo Parada (min)</span>
            <input
              type="number"
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
              value={totalParadasMin}
              readOnly
            />
          </div>

          <select
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
            value={state.pesoUnidade}
            onChange={(e) => setField("pesoUnidade", Number(e.target.value))}
          >
            <option value={25}>Peso por Unidade (25kg / 1150kg)</option>
            <option value={1150}>Big Bag (1150kg)</option>
          </select>
        </div>

        {/* Metrics Row 1 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1e3a5f] rounded-lg p-3 text-center">
            <div className="text-xs text-blue-300">Producao Realizada</div>
            <div className="text-2xl font-bold text-white">{produzida}</div>
          </div>
          <div className="bg-[#1e3a5f] rounded-lg p-3 text-center">
            <div className="text-xs text-blue-300">Producao Restante</div>
            <div className="text-2xl font-bold text-white">{restante}</div>
          </div>
        </div>

        {/* Metrics Row 2 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1e3a5f] rounded-lg p-3 text-center">
            <div className="text-xs text-blue-300">Ritmo Atual (un/h)</div>
            <div className="text-2xl font-bold text-white">{ritmoH.toFixed(1)}</div>
          </div>
          <div className="bg-[#4a3f00] rounded-lg p-3 text-center">
            <div className="text-xs text-yellow-300">Previsao de Termino</div>
            <div className="text-2xl font-bold text-white">
              {ritmoH > 0 ? formatTime(previsaoTermino) : "--:--"}
            </div>
          </div>
        </div>

        {/* Metrics Row 3 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0f3d3d] rounded-lg p-3 text-center">
            <div className="text-xs text-teal-300">Tempo Restante (min)</div>
            <div className="text-2xl font-bold text-white">{Math.round(tempoRestanteMin)}</div>
          </div>
          <div className="bg-[#1a3a5f] rounded-lg p-3 text-center">
            <div className="text-xs text-blue-300">Consumo Farinha (kg)</div>
            <div className="text-2xl font-bold text-white">
              {consumoTotal.toLocaleString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Eficiencia row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Eficiencia Maxima (un/h)</span>
            <input
              type="number"
              className="w-16 bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 text-sm text-white text-center"
              value={state.ritmoMaximo}
              onChange={(e) => setField("ritmoMaximo", Number(e.target.value))}
            />
            <span className="text-gray-500">un/h</span>
            <span className="text-gray-500 text-lg">→</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Eficiencia (OEE)</span>
            <OEEGauge value={oee} />
          </div>
        </div>

        {/* Paradas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Paradas Registradas</span>
            <button
              onClick={() => {
                if (novoMotivo && novoTempo > 0) {
                  addParada(novoMotivo, novoTempo);
                  setNovoMotivo("");
                  setNovoTempo(0);
                }
              }}
              className="bg-[#1e3a5f] text-white text-xs px-3 py-1.5 rounded flex items-center gap-1"
            >
              Adicionar Parada
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>Motivo</div>
            <div>Tempo</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Paradas Registra"
              className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
              value={novoMotivo}
              onChange={(e) => setNovoMotivo(e.target.value)}
            />
            <input
              type="text"
              placeholder="00:00:00"
              className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
              value={novoTempo || ""}
              onChange={(e) => setNovoTempo(Number(e.target.value))}
            />
          </div>

          {state.paradas.length > 0 && (
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {state.paradas.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs bg-[#1a1a1a] rounded px-2 py-1">
                  <span className="text-white">{p.motivo}</span>
                  <span className="text-gray-400">{p.tempo}min</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export button */}
        <button className="w-full bg-[#1e3a5f] text-white text-sm py-2.5 rounded flex items-center justify-center gap-2">
          <FileText size={14} />
          Exportar Relatorio PDF
        </button>
      </div>
    </div>
  );
}
