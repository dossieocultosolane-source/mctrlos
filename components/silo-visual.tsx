"use client";

import { motion } from "framer-motion";

interface SiloVisualProps {
  nome: string;
  atual: number;
  max: number;
  sensorAtivo: boolean;
  selected?: boolean;
  onClick?: () => void;
  onValueChange?: (value: number) => void;
  showSensorIndicator?: boolean;
}

export function SiloVisual({
  nome,
  atual,
  max,
  sensorAtivo,
  selected,
  onClick,
  onValueChange,
  showSensorIndicator,
}: SiloVisualProps) {
  const percent = Math.min(100, (atual / max) * 100);

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 p-3 industrial-card cursor-pointer transition-all duration-200 ${
        selected ? "ring-1 ring-primary" : ""
      }`}
    >
      <span className="label-industrial">{nome}</span>

      {/* Sensor indicator for PM silos - red/green lights */}
      {showSensorIndicator && (
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            sensorAtivo ? "bg-red-500" : "bg-red-900"
          }`}
          style={{
            boxShadow: sensorAtivo ? "0 0 8px 2px rgba(239, 68, 68, 0.6)" : "none",
          }}
        />
      )}

      {/* Silo body */}
      <div className="silo-container w-14 h-24 sm:w-16 sm:h-28 relative">
        {/* Level fill */}
        <motion.div
          initial={false}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute bottom-0 w-full transition-colors duration-300 ${
            sensorAtivo ? "bg-warning sensor-pulse" : "bg-primary"
          }`}
        />

        {/* High sensor indicator inside silo */}
        <div
          className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full transition-colors ${
            atual >= max ? "bg-destructive sensor-pulse" : "bg-foreground/10"
          }`}
        />
      </div>

      {/* Value display */}
      <div className="text-[10px] font-mono text-center leading-tight">
        <span className="text-foreground">
          {Math.round(atual).toLocaleString("pt-BR")} kg
        </span>
        <br />
        <span className="text-muted-foreground">
          {Math.round(max).toLocaleString("pt-BR")} kg
        </span>
        <br />
        <span className="text-muted-foreground">{percent.toFixed(0)}%</span>
      </div>

      {/* Editable input */}
      {onValueChange && (
        <input
          type="number"
          value={Math.round(atual)}
          onChange={(e) => onValueChange(Number(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          className="input-industrial w-full text-[10px] text-center mt-1 py-1 px-1"
          min={0}
          max={max}
        />
      )}

      {/* Sensor labels for PM silos */}
      {showSensorIndicator && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="flex items-center gap-1">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                sensorAtivo ? "bg-red-500" : "bg-red-900"
              }`}
              style={{
                boxShadow: sensorAtivo ? "0 0 6px 1px rgba(239, 68, 68, 0.6)" : "none",
              }}
            />
            <span className="text-[8px] font-mono text-muted-foreground uppercase">
              Sensor Alto
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full bg-green-500"
              style={{
                boxShadow: "0 0 6px 1px rgba(34, 197, 94, 0.6)",
              }}
            />
            <span className="text-[8px] font-mono text-green-500 uppercase">
              Ativo
            </span>
          </div>
        </div>
      )}

      {sensorAtivo && !showSensorIndicator && (
        <span className="text-[9px] font-mono text-warning uppercase tracking-wider">
          Sensor
        </span>
      )}
    </div>
  );
}
