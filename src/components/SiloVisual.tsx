import { motion } from "framer-motion";

interface SiloVisualProps {
  nome: string;
  atual: number;
  max: number;
  sensorAtivo: boolean;
  selected?: boolean;
  onClick?: () => void;
  onValueChange?: (value: number) => void;
}

export const SiloVisual = ({
  nome,
  atual,
  max,
  sensorAtivo,
  selected,
  onClick,
  onValueChange,
}: SiloVisualProps) => {
  const percent = Math.min(100, (atual / max) * 100);
  const isPM = nome.startsWith("PM");

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 p-3 industrial-card cursor-pointer transition-all duration-200 ${
        selected ? "ring-1 ring-primary" : ""
      }`}
    >
      <span className="label-industrial">{nome}</span>

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

        {/* High sensor indicator */}
        <div
          className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full transition-colors ${
            atual >= max ? "bg-destructive sensor-pulse" : "bg-foreground/10"
          }`}
        />
      </div>

      {/* Value display */}
      <div className="text-[10px] font-mono text-center leading-tight">
        <span className="text-foreground">{Math.round(atual).toLocaleString("pt-BR")}kg</span>
        <br />
        <span className="text-muted-foreground">{percent.toFixed(1)}%</span>
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

      {sensorAtivo && (
        <span className="text-[9px] font-mono text-warning uppercase tracking-wider">
          Sensor
        </span>
      )}
    </div>
  );
};
